import React, { useState } from "react";
import { Settings, FolderOpen, User, Folders } from "lucide-react";
import { Link } from "react-router-dom";

function SideBar() {
  const [activeSection, setActiveSection] = useState("files");

  return (
    <div className="h-full">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 shadow-xl h-full">
        <div className="p-6 border-b border-gray-700">
          <div className="text-2xl font-bold text-white flex items-center gap-4"><User size={20}/> Profile</div>
        </div>

        <nav className="px-4 py-4">
          {[
            {
              icon: Folders,
              label: "My Files",
              section: "files",
              link: "/profile/dashboard",
            },
            {
              icon: FolderOpen,
              label: "Shared Files",
              section: "shared",
              link: "/profile/shared",
            },
            {
              icon: User,
              label: "Posts",
              section: "post",
              link: "/profile/posts",
            },
            {
              icon: Settings,
              label: "Settings",
              section: "settings",
              link: "/profile/settings",
            },
          ].map(({ icon: Icon, label, section, link }) => (
            <Link to={`${link}`}>
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-all duration-200 ${
                  activeSection === section
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </button>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default SideBar;
