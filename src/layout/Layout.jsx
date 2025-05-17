import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="min-h-screen  ">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div
        className={`flex flex-col transition-all duration-200 ${
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <Header
          toggleSidebar={toggleSidebar}
          toggleMobileSidebar={toggleMobileSidebar}
        />

        <main className="flex-1 p-0">
          <div className="bg-blue-50/20 min-h-screen  p-6">
            {children}
          </div>
        </main>
             <Footer />
      </div>
    </div>
  );
};

export default Layout;

// /sajid 