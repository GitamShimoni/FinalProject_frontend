import "./CreateATool.css";
import { useState } from "react";
import axios from "axios";
import Host from "../utils/routes";
import { useContext } from "react";
import { ProjectContext } from "../Contexts/ProjectContext";
import { ToastContainer, toast } from "react-toastify";

const CreateATool = () => {
  const { setTools } = useContext(ProjectContext);
  const [toolName, setToolName] = useState("");

  const handleCreateTool = async () => {
    try {
      await axios
        .post(
          `${Host}/tools/createTool`,
          {
            toolName: toolName,
          },
          {
            headers: { projectId: localStorage.getItem("selectedProjectId") },
          }
        )
        .then(({ data }) => {
          console.log(data, "THIS IS THE ANSWER OF CREATE TOOL");
          setTools(data.tools);
          //   setToolName(""); SHOULD ADD A RESET TO THE INPUT
        });
      toast.success("  הכלי נוצר בהצלחה!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (err) {
      console.log(err);
      toast.error("לא ניתן להוסיף את הכלי", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <div id="createatool-container">
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
        theme="colored"
      />
      <h5 id="createatool-header">צור כלי חדש</h5>
      <br />
      <div id="createatool-input-div">
        <div className="the-group">
          <input
            onChange={(e) => setToolName(e.target.value)}
            required=""
            type="text"
            className="new-tool-input"
          />

          <span className="the-highlight"></span>
          <span className="the-bar"></span>
          <label className="new-tool-label">צור כלי </label>
        </div>
        {/* <input
          onChange={(e) => setToolName(e.target.value)}
          id="createatool-input"
          type="text"
          placeholder="שם הכלי"
        /> */}
        <button
          onClick={() => {
            handleCreateTool();
          }}
          id="createatool-button"
        >
          הוסף
        </button>
      </div>
    </div>
  );
};

export default CreateATool;
