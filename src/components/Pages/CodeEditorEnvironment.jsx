import React, { useState, useEffect } from "react";
import {
  Code,
  DeleteIcon,
  ExternalLink,
  Menu,
  SaveAll,
  Settings,
  Terminal,
} from "lucide-react"; // Importing Lucide icons
import Editor from "@monaco-editor/react";
import { useLocation } from "react-router-dom";
import { app } from "@/firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getDatabase, get, ref, set, update } from "firebase/database";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const db = getDatabase(app);
const auth = getAuth(app);

const CodeEditorEnvironment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const projectId = params.get("projectId");
  const displayName = params.get("name");
  const projectName = params.get("projectName");
  const projectDescription = params.get("projectDescription");
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState({
    "index.html": { content: "", type: "html" },
    "styles.css": { content: "", type: "css" },
    "script.js": { content: "", type: "javascript" },
  });
  const [activeFile, setActiveFile] = useState("index.html");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [previewContent, setPreviewContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [projectDetails, setProjectDetails] = useState({
    Name: "",
    Description: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(false);
      } else {
        navigate("/login-page");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Fetch project data when component mounts or when projectId or displayName change
    if (projectId && displayName) {
      get(ref(db, `users/${displayName}/workspaceFiles/files/${projectId}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const projectData = snapshot.val();
            setProject(projectData);

            // Set files after project data is fetched
            setFiles({
              "index.html": {
                content: projectData.Project_Files.HTML,
                type: "html",
              },
              "styles.css": {
                content: projectData.Project_Files.CSS,
                type: "css",
              },
              "script.js": {
                content: projectData.Project_Files.JavaScript,
                type: "javascript",
              },
            });
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [projectId, displayName]); // Re-run effect if projectId or displayName changes

  useEffect(() => {
    if (files["index.html"] && files["styles.css"] && files["script.js"]) {
      setPreviewContent(generatePreview());
    }
  }, [files]);

  const generatePreview = () => {
    const html = files["index.html"]?.content || "";
    const css = files["styles.css"]?.content || "";
    const js = files["script.js"]?.content || "";

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "html":
        return <Code size={16} className="text-orange-400" />;
      case "css":
        return <Code size={16} className="text-green-400" />;
      case "javascript":
        return <Code size={16} className="text-yellow-400" />;
      default:
        return <Code size={16} className="text-gray-400" />;
    }
  };

  const handleSaveAllFiles = () => {
    const Project_Files = {
      HTML: files["index.html"].content,
      CSS: files["styles.css"].content,
      JavaScript: files["script.js"].content,
    };

    toast("Files Saved Successfully", {
      style: {
        background: "#5c93e6",
        border: 0,
      },
    });

    const userRef = ref(
      db,
      `users/${displayName}/workspaceFiles/files/${projectId}/Project_Files`
    );

    set(userRef, Project_Files)
      .then(() => {})
      .catch((error) => {
        console.error("Error updating user data: ", error);
      });
  };

  const handleUpdateProjectDetails = () => {
    const ProjectDetails = {
      Project_Name: projectDetails.Name,
      Project_Description: projectDetails.Description,
    };

    const userRef = ref(
      db,
      `users/${displayName}/workspaceFiles/files/${projectId}`
    );

    update(userRef, ProjectDetails)
      .then(() => {
        toast("Change Updated Successfully");
        setIsDialogOpen(false); // Close the dialog
        navigate("/dashboard")
      })
      .catch((error) => {
        console.error("Error updating user data: ", error);
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mx-auto"
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
          <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
            Loading, please wait...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Top Bar */}
      <div className="h-12 bg-gray-800 flex items-center justify-between px-4 border-b border-gray-700">
        <h1 className="text-lg font-semibold">{projectName}</h1>
        <div className="flex space-x-4 items-center">
          <Link to="/dashboard">
            <Button
              variant="ghost"
              className="transition-opacity duration-200 hover:opacity-80"
            >
              DashBoard
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Settings />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="m-2 bg-slate-700 text-white">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* DropdownMenuItem for opening Dialog */}
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <span className="cursor-pointer">Project Details</span>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-600 text-white">
                    <DialogHeader>
                      <DialogTitle>Update Project</DialogTitle>
                      <DialogDescription>
                        Please provide the project name and description
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white">
                          Project Name
                        </label>
                        <Input
                          placeholder={projectDetails.Name}
                          className="mt-2 bg-slate-500 text-white placeholder-gray-300"
                          value={projectDetails.Name}
                          onChange={(e) =>
                            setProjectDetails((prev) => ({
                              ...prev,
                              Name: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white">
                          Project Description
                        </label>
                        <textarea
                          placeholder={projectDescription}
                          className="mt-2 p-2 border rounded-md w-full min-h-16 bg-slate-500 text-white placeholder-gray-300"
                          value={projectDetails.Description}
                          onChange={(e) =>
                            setProjectDetails((prev) => ({
                              ...prev,
                              Description: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        onClick={handleUpdateProjectDetails}
                      >
                        Update Details
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Team
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Subscription
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div
          className={`flex flex-col bg-gray-800 border-r border-gray-700 transition-all duration-300 ${
            isSidebarOpen ? "w-48" : "w-12 items-center justify-center"
          }`}
        >
          {/* Sidebar Header */}
          <div className="h-12 flex items-center justify-between px-4 border-b border-gray-700">
            {isSidebarOpen && (
              <span className="text-sm font-medium">Explorer</span>
            )}
            <button
              onClick={toggleSidebar}
              className="p-1 hover:bg-gray-700 rounded-md"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            {Object.entries(files).map(([filename, file]) => (
              <div
                key={filename}
                className={`flex items-center cursor-pointer px-3 py-2 mb-1 rounded-md group ${
                  activeFile === filename
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700"
                }`}
                onClick={() => setActiveFile(filename)}
              >
                {getFileIcon(file.type)}
                {isSidebarOpen && (
                  <span className="ml-3 truncate">{filename}</span>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="h-12 border-t border-gray-700 flex items-center justify-evenly px-2">
            {isSidebarOpen && (
              <>
                <button
                  className="p-1.5 bg-green-600 text-white hover:bg-green-700 rounded-md flex items-center justify-center"
                  onClick={() => {
                    handleSaveAllFiles();
                    console.log("file saved");
                  }}
                >
                  <SaveAll size={16} /> Save All
                </button>
                <button
                  className="p-2 bg-red-600 text-white hover:bg-red-700 rounded-md flex items-center justify-center"
                  onClick={() => setFiles({})}
                >
                  <DeleteIcon size={16} />
                  <span className="ml-2 text-sm">Clear</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Editor and Preview */}
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full rounded-lg "
          >
            <ResizablePanel defaultSize={50} minSize={0}>
              <div className="h-full">
                <Editor
                  height="100%"
                  language={files[activeFile]?.type}
                  theme="vs-dark"
                  value={files[activeFile]?.content}
                  onChange={(value) => {
                    setFiles((prev) => ({
                      ...prev,
                      [activeFile]: {
                        ...prev[activeFile],
                        content: value || "",
                      },
                    }));
                  }}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                    padding: { top: 16 },
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: true,
                    parameterHints: true,
                  }}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={50} minSize={0}>
              <div className="h-full bg-white">
                <iframe
                  title="Preview"
                  className="w-full h-full border-none"
                  srcDoc={previewContent}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      {/* Footer */}
      <div className="h-12 bg-gray-800 flex items-center px-4 border-t border-gray-700">
        <div className="flex space-x-4">
          <button
            className="p-2 flex items-center bg-blue-600 text-white hover:bg-blue-700 rounded-md"
            onClick={() =>
              window.open("", "_blank").document.write(previewContent)
            }
          >
            <ExternalLink size={16} />
            <span className="ml-2">Open Preview in New Tab</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorEnvironment;
