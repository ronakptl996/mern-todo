import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { loginValidate, registerValidate } from "../validators/index.js";

const generateAccessTokenForUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();

    return { accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token"
    );
  }
};

const registerHandler = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const { error } = registerValidate.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, error.details[0].message));
  }

  const existedUser = await User.findOne({
    email,
  });

  if (existedUser) {
    return res
      .status(401)
      .json(new ApiResponse(401, [], "User with email already exists"));
  }

  try {
    const userData = await User.create({
      password,
      email,
      username,
    });

    const createdData = await User.findById(userData._id).select("-password");

    if (!createdData) {
      return res
        .status(500)
        .json(new ApiResponse(500, [], "Error while registering user!"));
    }

    return res
      .status(201)
      .json(new ApiResponse(200, createdData, "User registered Successfully"));
  } catch (error) {
    throw new ApiError(500, "Error while register user");
  }
});

const loginHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginValidate.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, error.details[0].message));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "User does not exist!"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Invalid user credentials!"));
  }

  const { accessToken } = await generateAccessTokenForUser(user._id);

  const loggedInUser = await User.findById(user._id).select("-password");

  const option = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "User logged in Successfully!"
      )
    );
});

const getUserDetails = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        decoded: req.user,
      },
      ""
    )
  );
});

export { registerHandler, loginHandler, getUserDetails };
