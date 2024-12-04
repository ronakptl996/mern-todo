import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Task } from "../models/task.model.js";
import { addTaskValidator, updateTaskValidate } from "../validators/index.js";

const add = asyncHandler(async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const { error } = addTaskValidator.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, error.details[0].message));
    }

    const data = await Task.create({
      title,
      description,
      status,
    });

    const createdData = await Task.findById(data._id);

    if (!createdData) {
      return res
        .status(500)
        .json(
          new ApiResponse(
            500,
            createdData,
            "Something went wrong while add task, please try again!"
          )
        );
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdData, "Article add successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong!");
  }
});

const update = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = updateTaskValidate.validate(req.params);
    const { error: updateTaskError } = addTaskValidator.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, error.details[0].message));
    }

    if (updateTaskError) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, updateTaskError.details[0].message));
    }

    const { title, description, status } = req.body;

    const data = await Task.findById(id);

    if (!data) {
      return res.status(401).json(new ApiResponse(401, [], "Data not found!"));
    }

    const updatedData = await Task.findByIdAndUpdate(
      id,
      {
        title,
        description,
        status,
      },
      { new: true }
    );

    if (!updatedData) {
      return res
        .status(500)
        .json(new ApiResponse(500, [], "Error while updating task!"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedData, "Task updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong!");
  }
});

const deleteTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = updateTaskValidate.validate(req.params);

    if (error) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, error.details[0].message));
    }

    const data = await Task.findById(id);

    if (!data) {
      return res.status(401).json(new ApiResponse(401, [], "Task not found!"));
    }

    const deleteData = await Task.findByIdAndDelete(id);

    if (!deleteData) {
      return res
        .status(500)
        .json(new ApiResponse(500, [], "Error while updating task!"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, deleteData, "Task deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong!");
  }
});

export { add, update, deleteTask };
