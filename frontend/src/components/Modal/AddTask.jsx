import React from "react";
import { taskValidationSchema } from "../../Schemas";
import { useFormik } from "formik";

const AddTaskModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: {
        title: "",
        description: "",
        status: "",
      },
      validationSchema: taskValidationSchema,
      onSubmit: (values) => {
        onSubmit(values);
      },
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Add Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 focus:outline-none"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className={`mt-1 p-3 block w-full rounded-md border border-gray-400 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                touched.title && errors.title ? "border-red-500" : ""
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title}
            />
            {touched.title && errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              className={`mt-1 p-3 block w-full rounded-md border border-gray-400 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                touched.description && errors.description
                  ? "border-red-500"
                  : ""
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.description}
            />
            {touched.description && errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              required
              className={`mt-1 p-3 block w-full rounded-md border border-gray-400 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                touched.status && errors.status ? "border-red-500" : ""
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.status}
            >
              <option selected>Select Status</option>
              <option value="to-do">To Do</option>
              <option value="progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            {touched.status && errors.status && (
              <p className="text-sm text-red-500 mt-1">{errors.status}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
