import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Menuitems from "./MenuItems";
import { Upgrade } from "./sidebar/Upgrade";
import Logo from "./shared/logo/Logo";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const itemVariants = {
  open: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
};

const buttonVariants = {
  hover: { scale: 1.02 },
};

const Sidebar = ({ isCollapsed, isMobileOpen, onClose }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});
  const userTypeId = localStorage.getItem("user_type_id");

  useEffect(() => {
    const initialExpanded = {};
    Menuitems(userTypeId).forEach((item) => {
      if (item.subItems) {
        const hasActiveChild = item.subItems.some(
          (subItem) => location.pathname === subItem.href
        );
        if (hasActiveChild) {
          initialExpanded[item.id] = true;
        }
      }
    });
    setExpandedMenus(initialExpanded);
  }, [userTypeId, location.pathname]);

  const toggleMenu = (id) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleLinkClick = () => {
    const sidebarContent = document.querySelector(".sidebar-content");
    if (sidebarContent) {
      sessionStorage.setItem("sidebarScrollPosition", sidebarContent.scrollTop);
    }
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  useEffect(() => {
    const sidebarContent = document.querySelector(".sidebar-content");
    const scrollPosition = sessionStorage.getItem("sidebarScrollPosition");

    if (sidebarContent && scrollPosition) {
      sidebarContent.scrollTop = parseInt(scrollPosition);
    }
  }, [location.pathname]);

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-200 ease-in-out ${
          isCollapsed ? "lg:w-20" : "lg:w-64"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-0.5 border-b border-gray-200">
            <Logo isCollapsed={isCollapsed} />
          </div>

          {/* Menu items */}
          <div className="flex-1 overflow-y-auto sidebar-content py-4">
            <nav className="px-2">
              <ul className="space-y-1">
                {Menuitems(userTypeId).map((item) => {
                  if (item.subheader) {
                    return (
                      !isCollapsed && (
                        <li key={item.subheader} className="px-4 py-2">
                          <span className="text-xs font-semibold uppercase text-gray-700 tracking-wider">
                            {item.subheader}
                          </span>
                        </li>
                      )
                    );
                  }

                  if (item.subItems) {
                    const isParentActive = item.subItems.some(
                      (subItem) => location.pathname === subItem.href
                    );
                    const isOpen = expandedMenus[item.id] || isParentActive;

                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => toggleMenu(item.id)}
                          className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${
                            isParentActive
                              ? "text-blue-700 bg-blue-100"
                              : "text-gray-800 hover:bg-gray-100"
                          }`}
                        >
                          <item.icon className="flex-shrink-0 h-5 w-5" />
                          {!isCollapsed && (
                            <>
                              <span className="ml-3 text-sm font-medium">
                                {item.title}
                              </span>
                              <ChevronRight
                                className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                                  isOpen ? "rotate-90" : ""
                                }`}
                              />
                            </>
                          )}
                        </button>

                        <motion.div
                          initial={isOpen ? "open" : "closed"}
                          animate={isOpen ? "open" : "closed"}
                          variants={itemVariants}
                          className="overflow-hidden"
                        >
                          {isOpen && (
                            <ul className="mt-1 space-y-1 pl-4 border-l-2 border-blue-200">
                              {item.subItems.map((subItem) => {
                                const isSubItemActive =
                                  location.pathname === subItem.href;
                                return (
                                  <motion.li
                                    key={subItem.id}
                                    variants={buttonVariants}
                                    whileHover="hover"
                                  >
                                    <Link
                                      to={subItem.href}
                                      onClick={handleLinkClick}
                                      className={`block pl-4 py-2 rounded-lg transition-colors duration-200 ${
                                        isSubItemActive
                                          ? "text-blue-700 bg-blue-50 border-l-2 border-blue-600 -ml-0.5"
                                          : "text-gray-800 hover:bg-gray-100 border-l-2 border-transparent hover:border-gray-300"
                                      }`}
                                    >
                                      <div className="flex items-center">
                                        <subItem.icon className="flex-shrink-0 h-5 w-5" />
                                        {!isCollapsed && (
                                          <span className="ml-3 text-sm">
                                            {subItem.title}
                                          </span>
                                        )}
                                      </div>
                                    </Link>
                                  </motion.li>
                                );
                              })}
                            </ul>
                          )}
                        </motion.div>
                      </li>
                    );
                  }

                  const isActive = location.pathname === item.href;
                  return (
                    <motion.li
                      key={item.id}
                      variants={buttonVariants}
                      whileHover="hover"
                    >
                      <Link
                        to={item.href}
                        onClick={handleLinkClick}
                        className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                          isActive
                            ? "text-blue-700 bg-blue-100"
                            : "text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        <item.icon className="flex-shrink-0 h-5 w-5" />
                        {!isCollapsed && (
                          <span className="ml-3 text-sm font-medium">
                            {item.title}
                          </span>
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Upgrade  */}
          {!isCollapsed && (
            <div className="p-1 border-t border-gray-200">
              <Upgrade />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;