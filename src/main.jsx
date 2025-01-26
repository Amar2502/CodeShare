import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "./components/Pages/Home";
import CodeEditorEnvironment from "./components/Pages/CodeEditorEnvironment";
import RegistrationPage from "./components/Pages/RegistrationPage";
import WorkspaceDashboard from "./components/Pages/Profile/WorkspaceDashboard";
import NoHFLayout from "./NoHFLayout";
import WorkspaceLayout from "./WorkspaceLayout";
import Settings from "./components/Pages/Profile/Settings";
import NotFound from "./components/Pages/NotFound";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound/>} />
      </Route>
      <Route path="/" element={<NoHFLayout />}>
        <Route path="code-editor" element={<CodeEditorEnvironment />} />
        <Route path="registration-page" element={<RegistrationPage />} />
      </Route>
      <Route path="/profile" element={<WorkspaceLayout />}>
        <Route path="dashboard" element={<WorkspaceDashboard />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);