import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Task } from "../models/task.model.js";
import {
  addTaskValidator,
  updateTaskValidator,
  deleteTaskValidate,
} from "../validators/index.js";

const getTask = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body;

    const pipeline = [
      {
        $match: {
          createdBy: req.user._id,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          status: 1,
          createdAt: 1,
        },
      },
    ];

    if (status) {
      pipeline[0].$match.status = status;
    }
    const data = await Task.aggregate(pipeline);
    return res.status(200).json(new ApiResponse(200, data, ""));
  } catch (error) {
    throw new ApiError(500, "Something went wrong!");
  }
});

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
      createdBy: req.user._id,
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
      .json(new ApiResponse(201, createdData, "Task add successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong!");
  }
});

const update = asyncHandler(async (req, res) => {
  try {
    const { error } = updateTaskValidator.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, error.details[0].message));
    }

    const { title, description, status, id } = req.body;

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
    const { error } = deleteTaskValidate.validate(req.params);

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

export { add, update, deleteTask, getTask };
