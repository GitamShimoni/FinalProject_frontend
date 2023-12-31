import React, { useEffect, useState } from "react";
import axios from "axios";
import Host from "../utils/routes";
import { Link, useNavigate } from "react-router-dom";
import UpdateUserForm from "./UpdateUserForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProjectPage.css";
import Loader from "./Loader";
import SignUp from "./SignUp";

// import { set } from "mongoose";


const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [token, setToken] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);  
  const navigate = useNavigate();

  function formatDate(dateString) {
    const dateSegments = dateString.split("T");
    const datePart = dateSegments[0].split("-").reverse().join(".");
    const timePart = dateSegments[1].split(":").slice(0, 2).join(":");
    return `${datePart}`;
  }

  useEffect(() => {
    const getAllProjects = async () => {
      try {
        const response = await axios.get(`${Host}/project/getAll`);
        setProjects(response.data);
        setLoadingProjects(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    const getAllUsers = async () => {
      try {
        const response = await axios.get(`${Host}/users/getUsers`);
        console.log("this is the response", response.data);
        setUsers(response.data);
        setLoadingUsers(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchToken = async () => {
      try {
        const token = localStorage.getItem("token");
        setToken(token)
        console.log(token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    getAllProjects();
    getAllUsers();
    fetchToken;
  }, []);

  const handleUserCreated = async () => {
    setIsCreateModalOpen(false);
    try {
      const response = await axios.get(`${Host}/users/getUsers`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  const getStatus = (finishDate) => {
    const currentDate = new Date();
    return currentDate > new Date(finishDate) ? "בעבודות" : "הסתיים";
  };

  const handleProjectClick = (projectId) => {
    localStorage.setItem("selectedProjectId", projectId);
    navigate(`/dashboard`);
  };

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };
  if (loadingProjects || loadingUsers) {
    return <Loader />;
  }

  const createUser = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div id="project-holder">
      <ToastContainer
        position="top-center"
        autoClose={1200}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <h1 className="projectPage-headline">פרוייקטים</h1>
      <div className="project-container">
        {projects.map((project) => (
          <div className="project-wrapper" key={project._id}>
            <div
              className="project-square"
              onClick={() => handleProjectClick(project._id)}
            >
              <h2 className="project-name">{project.name}</h2>
            </div>
            <div className="project-info">
              <p className="project-info">
                תחילת עבודות: {formatDate(project.startingDate)}
              </p>
              <p className="project-info">
                סטטוס פרוייקט: {getStatus(project.finishDate)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <h1 className="projectPage-headline">משתמשים</h1>
      <div className="user-container">
        {users.map((user) => (
          <div className="user-wrapper" key={user._id}>
            <div
              className="user-square"
              onClick={() => handleUserClick(user._id)}
            >
              <img
                className="user-image"
                src="https://thumbs.dreamstime.com/b/construction-worker-icon-vector-illustration-188332906.jpg"
                alt=""
              />
              <h2 className="user-name">{user.fullName}</h2>
            </div>
            <div className="user-info">
              <h5 className="user-phone">{user.phoneNumber}</h5>
              <h5 className="user-email">{user.email}</h5>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="add-user-container">
          <h2 className="add-user-header">להוספת משתמש</h2>
          <button
            type="button"
            className="add-user-button"
            onClick={() => createUser()}
          >
            <span className="add-user-button-text">הוסף משתמש</span>
            <span className="add-user-button-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                stroke="currentColor"
                height="24"
                fill="none"
                className="svg"
              >
                <line y2="19" y1="5" x2="12" x1="12"></line>
                <line y2="12" y1="12" x2="19" x1="5"></line>
              </svg>
            </span>
          </button>
        </div>
      </div>
      {selectedUserId && isModalOpen && (
        <div className="update-user-model">
          <UpdateUserForm
            users={users}
            setUsers={setUsers}
            token={token}
            userId={selectedUserId}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      )}
      {isCreateModalOpen && (
        <div className="crete-user-model">
          <SignUp onClose={() => setIsCreateModalOpen(false)} onUserCreated={handleUserCreated} />
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
