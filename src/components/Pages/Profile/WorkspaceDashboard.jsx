import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MoreVertical, Trash2, SettingsIcon, Globe } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, onValue, ref, update, remove } from "firebase/database";
import { app } from "@/firebase";
import { Input } from "@/components/ui/input";
import SideBar from "./SideBar";

const auth = getAuth(app);
const db = getDatabase(app);

const WorkspaceDashboard = () => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [Profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    Project_Name: "",
    Project_Description: "",
    Project_Files: {
      HTML: "<!DOCTYPE html>\n<html>\n<head>\n  <title>Live Preview</title>\n</head>\n<body>\n  <h1>Hello World!</h1>\n</body>\n</html>",
      CSS: "body {\n  margin: 0;\n  padding: 20px;\n}",
      JavaScript: 'console.log("Hello from JavaScript!");',
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setProfile(user);
        setProfileLoading(false);
      } else {
        navigate("");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!Profile) return;

    setFilesLoading(true);
    const filesRef = ref(
      db,
      `users/${Profile.displayName}/workspaceFiles/files`
    );
    const unsubscribe = onValue(filesRef, (snapshot) => {
      const data = snapshot.val();
      setFiles(
        data
          ? Object.entries(data).map(([key, value]) => ({ id: key, ...value }))
          : []
      );
      setFilesLoading(false);
    });

    return () => unsubscribe();
  }, [Profile]);

  const handleNewProject = async (formData) => {
    if (!Profile || !formData.Project_Name) {
      alert("Project name is required");
      return;
    }

    const projectId = Date.now().toString();
    const fileRef = ref(
      db,
      `users/${Profile.displayName}/workspaceFiles/files/${projectId}`
    );

    const projectData = {
      ...formData,
      timestamp: Date.now(),
      id: projectId,
    };

    try {
      await update(fileRef, projectData);
      console.log("Project created successfully!");
      setFormData((prev) => ({
        ...prev,
        Project_Name: "",
        Project_Description: "",
      }));
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Error creating project");
    }
  };

  const handleDeleteFile = (e, file) => {
    e.stopPropagation();
    setSelectedFile(file);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (!selectedFile || !Profile) return;

    const fileRef = ref(
      db,
      `users/${Profile.displayName}/workspaceFiles/files/${selectedFile.id}`
    );
    remove(fileRef)
      .then(() => {
        console.log("Project deleted successfully");
        setShowDeleteDialog(false);
        setSelectedFile(null);
      })
      .catch((error) => {
        console.error("Error deleting project:", error);
        alert("Error deleting project");
      });
  };

  const handleLogOut = () => {
    signOut(auth)
      .then(() => navigate("/"))
      .catch(() => alert("Error signing out"));
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-300">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-500 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
            />
          </svg>
          <p className="mt-4 text-lg font-semibold text-gray-900">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-300">
      <div className="flex-1 overflow-auto">
        <div className="bg-gray-900 p-6 shadow-lg border-b border-gray-800">
          <div className="flex justify-between items-center h-3">
            <h2 className="text-2xl font-bold text-gray-100">
              Welcome, {Profile.displayName}
            </h2>
            <Dialog>
              <DialogTrigger className="bg-blue-600 text-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md">
                <Plus size={20} />
                New Project
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-gray-100">
                    Create a New Project
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Please provide the project name and description. Project
                    name is required.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Project Name
                    </label>
                    <Input
                      placeholder="Enter project name"
                      className="mt-2 bg-gray-800 border-gray-700 text-gray-100"
                      required
                      value={formData.Project_Name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          Project_Name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Project Description
                    </label>
                    <textarea
                      placeholder="Enter project description"
                      className="mt-2 p-2 rounded-md w-full min-h-16 bg-gray-800 border-gray-700 text-gray-100"
                      value={formData.Project_Description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          Project_Description: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-blue-600 text-gray-100 px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    onClick={() => handleNewProject(formData)}
                  >
                    Create Project
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="p-6">
          {filesLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <svg
                  className="animate-spin h-12 w-12 text-blue-500 mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  />
                </svg>
                <p className="mt-4 text-lg font-semibold text-gray-300">
                  Loading your files...
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {files.map((file) => (
                <div
                  key={file.id}
                  onClick={() =>
                    navigate(
                      `/code-editor?projectId=${file.id}&name=${Profile.displayName}&projectName=${file.Project_Name}&projectDescription=${file.Project_Description}`
                    )
                  }
                  className="bg-gray-200 rounded-xl shadow-lg hover:shadow-black-900/20 hover:shadow-2xl transition-all duration-200 p-6 border border-gray-800 cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-3xl">
                      <Globe size={24} className="text-blue-500" />
                    </span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="text-gray-900 hover:text-gray-950 focus:outline-none">
                          <MoreVertical size={20} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-300 border-gray-800">
                          <DropdownMenuItem
                            onClick={(e) => handleDeleteFile(e, file)}
                            className="flex items-center gap-2 text-red-400 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">
                    {file.Project_Name || "Untitled Project"}
                  </h3>
                  <p className="text-sm text-gray-700 mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                    {file.Project_Description || "No description"}
                  </p>
                  <div className="text-sm text-gray-700">
                    Last modified:{" "}
                    {file.timestamp
                      ? new Date(file.timestamp).toLocaleDateString()
                      : "Never"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-gray-900 border border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Delete Project</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete "{selectedFile?.Project_Name}"?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-gray-100 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkspaceDashboard;
