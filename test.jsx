import {
    LayoutDashboard,
    User,
    Network,
    PieChart,
    Languages,
    Briefcase,
    Copy,
    MessageSquare,
    Users,
    Receipt,
    School,
    List,
    Repeat,
    Component,
    FileText,
    Download,

    Type,
    Bell,
    DollarSign,
    Box,
  } from "lucide-react";
  
  const Menuitems = (userTypeId) => {
    const items = [
      {
        navlabel: true,
        subheader: "Home",
      },
      {
        id: "dashboard",
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/home",
      },
    ];
  
    if (userTypeId === "5") {
      items.push(
        {
          id: "receipt-sup",
          title: "Receipt",
          icon: Receipt,
          href: "/recepit-sup",
        },
        {
          id: "change-promoter",
          title: "Change Promoter",
          icon: DollarSign,
          href: "/change-promoter",
        },
        {
          id: "change-receipt-donor",
          title: "C-receipt Donor",
          icon: DollarSign,
          href: "/change-receipt-donor",
        }
      );
    } else {
      // Add other menu items based on user type
      if (userTypeId === "2") {
        items.push(
          {
            id: "chapters",
            title: "Chapters",
            icon: Network,
            href: "/chapter",
          },
          {
            id: "data-sources",
            title: "Data Sources",
            icon: PieChart,
            href: "/datasource",
          }
        );
      }
  
      items.push(
        {
          navlabel: true,
          subheader: "Operation",
        }
      );
  
      if (userTypeId === "3") {
        items.push({
          id: "master",
          title: "Master",
          icon: User,
          subItems: [
            {
              id: "master-chapters",
              title: "Chapters",
              icon: Network,
              href: "/master/chapters",
            },
            {
              id: "master-states",
              title: "States",
              icon: Languages,
              href: "/master/states",
            },
            {
              id: "master-designation",
              title: "Designation",
              icon: Briefcase,
              href: "/master/designation",
            },
            {
              id: "master-expensive-type",
              title: "OTS Expensive Type",
              icon: Copy,
              href: "/master/expensive-type",
            },
            {
              id: "master-faq",
              title: "FAQ",
              icon: MessageSquare,
              href: "/master/faqList",
            },
          ],
        });
      }
  
      items.push(
        {
          id: "donors",
          title: "Donors",
          icon: Users,
          subItems: [
            {
              id: "donor-list",
              title: "Full List",
              icon: List,
              href: "/donor-list",
            },
            {
              id: "member-list",
              title: "Members",
              icon: Users,
              href: "/member-list",
            },
            ...(userTypeId === "3"
              ? [
                  {
                    id: "viewer-list",
                    title: "Viewers",
                    icon: Box,
                    href: "/viewer-list",
                  },
                ]
              : []),
            {
              id: "duplicate-list",
              title: "Duplicate",
              icon: DollarSign,
              href: "/duplicate-list",
            },
          ],
        },
        {
          id: "receipts",
          title: "Receipts",
          icon: Receipt,
          subItems: [
            {
              id: "receipt-list",
              title: "Current Receipts",
              icon: Receipt,
              href: "/receipt-list",
            },
            {
              id: "receipt-old-list",
              title: "Old Receipts",
              icon: Receipt,
              href: "/receipt-old-list",
            },
            {
              id: "suspense-list",
              title: "Suspense Receipts",
              icon: Receipt,
              href: "/suspense-list",
            },
          ],
        },
        {
          id: "schools",
          title: "Schools",
          icon: School,
          subItems: [
            {
              id: "students-full-list",
              title: "Full List",
              icon: List,
              href: "/students-full-list",
            },
            {
              id: "students-to-allot",
              title: "School To Allot",
              icon: Component,
              href: "/students-to-allot",
            },
            {
              id: "students-schoolallot",
              title: "School Alloted",
              icon: Component,
              href: "/students-schoolallot",
            },
            {
              id: "students-report-donor",
              title: "Repeat Donors",
              icon: Repeat,
              href: "/students-report-donor",
            },
          ],
        },
        {
          navlabel: true,
          subheader: "Summary",
        },
        {
          id: "reports",
          title: "Reports",
          icon: FileText,
          subItems: [
            {
              id: "donorsummary",
              title: "Donor Summary",
              icon: Copy,
              href: "/report/donorsummary",
            },
            {
              id: "promoter",
              title: "Promoter Summary",
              icon: Copy,
              href: "/report/promoter",
            },
            {
              id: "recepit",
              title: "Receipt Summary",
              icon: Copy,
              href: "/report/recepit",
            },
            {
              id: "donation",
              title: "Donation Summary",
              icon: Copy,
              href: "/report/donation",
            },
            {
              id: "school",
              title: "School Summary",
              icon: Copy,
              href: "/report/school",
            },
            {
              id: "otg",
              title: "10BD Statement",
              icon: Copy,
              href: "/report/otg",
            },
            {
              id: "suspense",
              title: "Suspense Summary",
              icon: Copy,
              href: "/report/suspense",
            },
          ],
        },
        {
          id: "download",
          title: "Download",
          icon: Download,
          subItems: [
            {
              id: "receipts",
              title: "Receipt",
              icon: Copy,
              href: "/download/receipts",
            },
            {
              id: "donor",
              title: "Donor",
              icon: Copy,
              href: "/download/donor",
            },
            {
              id: "school",
              title: "School",
              icon: Copy,
              href: "/download/school",
            },
            {
              id: "ots",
              title: "OTS",
              icon: Copy,
              href: "/download/ots",
            },
            {
              id: "team",
              title: "Team",
              icon: Copy,
              href: "/download/team",
            },
            {
              id: "allrecepit",
              title: "All Receipts",
              icon: Copy,
              href: "/download/allrecepit",
            },
          ],
        },
        {
          navlabel: true,
          subheader: "Extra",
        },
        {
          id: "others",
          title: "Others",
          icon: Copy,
          subItems: [
            {
              id: "faq",
              title: "FAQ",
              icon: Type,
              href: "/faq",
            },
            {
              id: "team",
              title: "Team",
              icon: Users,
              href: "/team",
            },
            {
              id: "notification",
              title: "Notification",
              icon: Bell,
              href: "/notification",
            },
          ],
        }
      );
    }
  
    return items;
  };
  
  export default Menuitems;




  ///


  import React, { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";
  import { toast } from "react-toastify";
  import BASE_URL from "../base/BaseUrl";
  import Profile from "./header/Profile";
  import { Menu, X, MessageSquare, ChevronDown } from "lucide-react";
  
  const Header = ({ toggleSidebar, toggleMobileSidebar }) => {
    const userType = localStorage.getItem("user_type_id");
    const navigate = useNavigate();
    const [chapter, setChapter] = useState([]);
    const [selectedChapterName, setSelectedChapterName] = useState("All Chapter");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isChapterDropdownOpen, setIsChapterDropdownOpen] = useState(false);
  
    useEffect(() => {
      const storedChapterName = localStorage.getItem("selected_chapter_name");
      const viewerChapterIds = localStorage.getItem("viewer_chapter_ids");
  
      if (storedChapterName) {
        setSelectedChapterName(storedChapterName);
      } else if (viewerChapterIds) {
        const ids = viewerChapterIds.split(",");
        if (ids.length === 1 && ids[0] !== "") {
          fetchChaptersAndSetName(ids[0]);
        }
      }
    }, []);
  
    const fetchChaptersAndSetName = (chapterId) => {
      axios
        .get(`${BASE_URL}/api/fetch-profile-chapter`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setChapter(res.data.chapter);
          const foundChapter = res.data.chapter.find(
            (chap) => chap.id.toString() === chapterId
          );
          if (foundChapter) {
            setSelectedChapterName(foundChapter.chapter_name);
          }
        })
        .catch((error) => {
          console.error("Error fetching chapters:", error);
        });
    };
  
    const fetchData = () => {
      axios
        .get(`${BASE_URL}/api/fetch-profile-chapter`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setChapter(res.data.chapter);
        });
    };
  
    const clearChapter = () => {
      let data = {
        viewer_chapter_ids: "1",
      };
      axios({
        url: BASE_URL + "/api/update-profile-chapter-clear",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        if (res.data.code === 200) {
          toast.success(res.data.msg);
          localStorage.removeItem("selected_chapter_name");
          setSelectedChapterName("All Chapter");
          setIsChapterDropdownOpen(false);
        } else if (res.data.code === 400) {
          toast.error(res.data.msg);
        } else {
          toast.error("Unexpected Error");
        }
      });
    };
  
    const handleSelectChapter = async (id) => {
      try {
        const selectedChapter = chapter.find((item) => item.id === id);
        const response = await axios.post(
          `${BASE_URL}/api/update-profile-chapter`,
          {
            viewer_chapter_ids: id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
  
        if (response.data.code === 200) {
          if (selectedChapter) {
            localStorage.setItem(
              "selected_chapter_name",
              selectedChapter.chapter_name
            );
            setSelectedChapterName(selectedChapter.chapter_name);
          }
          toast.success(response.data.msg);
          setIsChapterDropdownOpen(false);
        } else if (response.data.code === 400) {
          toast.error(response.data.msg);
        } else {
          toast.error(response.data.msg);
        }
      } catch (error) {
        console.error("Error selecting chapter:", error);
        toast.error("Something went wrong. Please try again.");
      }
    };
  
    return (
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileSidebar}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            {/* Desktop menu button */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:block text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
  
          <div className="flex items-center space-x-6">
            {userType === "4" && (
              <div className="relative">
                <button
                  onClick={() => {
                    fetchData();
                    setIsChapterDropdownOpen(!isChapterDropdownOpen);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  <MessageSquare className="h-5 w-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">
                    {selectedChapterName}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isChapterDropdownOpen ? 'transform rotate-180' : ''}`} />
                </button>
  
                {isChapterDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-2">
                      {selectedChapterName !== "All Chapter" && (
                        <button
                          onClick={clearChapter}
                          className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 mb-2"
                        >
                          Clear Selection
                        </button>
                      )}
                      <div className="max-h-60 overflow-y-auto">
                        {chapter && chapter.length > 0 ? (
                          <ul className="space-y-1">
                            {chapter.map((item) => (
                              <li key={item.id}>
                                <button
                                  onClick={() => handleSelectChapter(item.id)}
                                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                                    selectedChapterName === item.chapter_name
                                      ? 'bg-blue-50 text-blue-700 font-medium'
                                      : 'text-gray-700 hover:bg-gray-100'
                                  }`}
                                >
                                  {item.chapter_name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="px-3 py-2 text-sm text-gray-500">No chapters available</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
  
            <Profile />
          </div>
        </div>
      </header>
    );
  };
  
  export default Header;


  //


  import React, { useState, useEffect } from "react";
  import { useLocation, Link } from "react-router-dom";
  import Menuitems from "./MenuItems";
  import { Upgrade } from "./sidebar/Upgrade";
  import Logo from "./shared/logo/Logo";
  import { ChevronDown, ChevronRight } from "lucide-react";
  
  const Sidebar = ({ isCollapsed, isMobileOpen, onClose }) => {
    const location = useLocation();
    const [expandedMenus, setExpandedMenus] = useState({});
    const userTypeId = localStorage.getItem("user_type_id");
  
    useEffect(() => {
      // Initialize expanded menus based on current path
      const initialExpanded = {};
      Menuitems(userTypeId).forEach((item) => {
        if (item.subItems) {
          const hasActiveChild = item.subItems.some(
            (subItem) => subItem.href === location.pathname
          );
          if (hasActiveChild) {
            initialExpanded[item.id] = true;
          }
        }
      });
      setExpandedMenus(initialExpanded);
    }, [location.pathname, userTypeId]);
  
    const toggleMenu = (id) => {
      setExpandedMenus((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    };
  
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
            <div className="p-4 border-b border-gray-200">
              <Logo isCollapsed={isCollapsed} />
            </div>
  
            {/* Menu items */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-2">
                <ul className="space-y-1">
                  {Menuitems(userTypeId).map((item) => {
                    if (item.subheader) {
                      return (
                        !isCollapsed && (
                          <li key={item.subheader} className="px-4 py-2">
                            <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
                              {item.subheader}
                            </span>
                          </li>
                        )
                      );
                    }
  
                    if (item.subItems) {
                      const isActive = item.subItems.some(
                        (subItem) => subItem.href === location.pathname
                      );
  
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() => toggleMenu(item.id)}
                            className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${
                              isActive
                                ? "text-blue-600 bg-blue-50"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <item.icon className="flex-shrink-0 h-5 w-5" />
                            {!isCollapsed && (
                              <>
                                <span className="ml-3 text-sm font-medium">
                                  {item.title}
                                </span>
                                {expandedMenus[item.id] ? (
                                  <ChevronDown className="ml-auto h-4 w-4" />
                                ) : (
                                  <ChevronRight className="ml-auto h-4 w-4" />
                                )}
                              </>
                            )}
                          </button>
                          {expandedMenus[item.id] && (
                            <ul className="mt-1 space-y-1 pl-4">
                              {item.subItems.map((subItem) => {
                                const isSubItemActive =
                                  location.pathname === subItem.href;
                                return (
                                  <li key={subItem.id}>
                                    <Link
                                      to={subItem.href}
                                      className={`block pl-4 py-2 rounded-lg transition-colors duration-200 ${
                                        isSubItemActive
                                          ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                                          : "text-gray-700 hover:bg-gray-100 border-l-4 border-gray-200 hover:border-gray-300"
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
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </li>
                      );
                    }
  
                    const isActive = location.pathname === item.href;
                    return (
                      <li key={item.id}>
                        <Link
                          to={item.href}
                          className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                            isActive
                              ? "text-blue-600 bg-blue-50"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <item.icon className="flex-shrink-0 h-5 w-5" />
                          {!isCollapsed && (
                            <span className="ml-3 text-sm font-medium">
                              {item.title}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
  
            {/* Upgrade section */}
            {!isCollapsed && (
              <div className="p-4 border-t border-gray-200">
                <Upgrade />
              </div>
            )}
          </div>
        </aside>
      </>
    );
  };
  
  export default Sidebar;


  //


  import React from "react";
  import Sidebar from "./Sidebar";
  import Header from "./Header";
  
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
      <div className="min-h-screen bg-gray-50">
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
  
          <main className="flex-1 p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  };
  
  export default Layout;