import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import UserCard from "../../components/Cards/UserCard";
import { toast } from "react-hot-toast";

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [userTasks, setUserTasks] = useState([]);         
  const [loadingTasks, setLoadingTasks] = useState(false);

  // Get all users
  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    }
  };

  // Fetch tasks of a specific user
  const handleUserClick = async (user) => {
    setSelectedUser(user);
    setLoadingTasks(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASKS_BY_USER(user._id)
      );
      setUserTasks(response.data);
    } catch (error) {
      console.error("Error fetching user tasks:", error);
      toast.error("Failed to load user tasks.");
    } finally {
      setLoadingTasks(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setSelectedUser(null);
    setUserTasks([]);
  };

  // Download user report
  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.REPORTS.EXPORT_USERS,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report. Please try again later.");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="mt-5 mb-10">
        {/* Header */}
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Team Members</h2>

          <button
            className="flex md:flex download-btn"
            onClick={handleDownloadReport}
          >
            <LuFileSpreadsheet className="text-lg" />
            Download Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allUsers.map((user) => (
            <UserCard
              key={user._id}
              userInfo={user}
              onClick={handleUserClick} 
            />
          ))}
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4">
              Tasks for {selectedUser.name}
            </h2>

            {loadingTasks ? (
              <p>Loading tasks...</p>
            ) : userTasks.length === 0 ? (
              <p>No tasks assigned.</p>
            ) : (
              <ul className="space-y-3">
                {userTasks.map((task) => (
                  <li
                    key={task._id}
                    className="p-3 border rounded bg-gray-50"
                  >
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <span className="text-xs font-semibold text-blue-600">
                      {task.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageUsers;


