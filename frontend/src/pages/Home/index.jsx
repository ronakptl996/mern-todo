import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setTodos } from "../../features/auth/authSlice";
import AddTaskModal from "../../components/Modal/AddTask";
import { truncateString } from "../../utils";
import EditTaskModal from "../../components/Modal/EditTask";

const Home = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({});

  const { todos } = useSelector((state) => state.auth);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditModalOpen(false);
  };

  const handleTaskSubmit = async (task) => {
    try {
      const result = await fetch(`/api/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
        credentials: "include",
      });
      const response = await result.json();

      if (response.success) {
        toast.success(response.message);
        setModalOpen(false);
        fetchTaskDetails();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handleEditTask = async (data) => {
    try {
      const result = await fetch(`/api/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const response = await result.json();

      if (response.success) {
        toast.success(response.message);
        setEditModalOpen(false);
        fetchTaskDetails();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const deleteTask = async (id) => {
    try {
      const result = await fetch(`/api/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const response = await result.json();

      if (response.success) {
        toast.success(response.message);
        fetchTaskDetails();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const fetchTaskDetails = async () => {
    try {
      let response = await fetch("/api", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        credentials: "include",
      });

      let data = await response.json();
      console.log({ data });

      if (data && data.success) {
        dispatch(setTodos(data.data));
      }
    } catch (error) {
      console.log(`fetchTaskDetails Error ${error}`);
    }
  };

  const editTask = (data) => {
    setEditData(data);
    setEditModalOpen(true);
  };

  useEffect(() => {
    fetchTaskDetails();
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <div className="flex mb-8">
        <div className="ml-auto">
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Create Task
          </button>
          <AddTaskModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleTaskSubmit}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {todos &&
          todos.length > 0 &&
          todos.map((el) => (
            <div className="bg-blue-500 p-3 h-32 rounded-lg" key={el._id}>
              <h2 className="text-xl font-semibold">{el.title}</h2>
              <p>{truncateString(el.description, 200)}</p>
              <div className="flex mt-1">
                <button
                  onClick={() => editTask(el)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(el._id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
      {todos.length == 0 && (
        <div>
          <h2 className="text-center text-2xl font-bold">No data found!</h2>
          <h6 className="text-center text-base mt-1">Add Task first</h6>
        </div>
      )}

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleEditTask}
        data={editData}
      />
    </div>
  );
};

export default Home;
