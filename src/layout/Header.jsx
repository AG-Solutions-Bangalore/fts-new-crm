import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../base/BaseUrl";
import Profile from "./header/Profile";
import { Menu, X, MessageSquare, ChevronDown, Building } from "lucide-react";

const Header = ({ toggleSidebar, toggleMobileSidebar }) => {
  const userType = localStorage.getItem("user_type_id");
  const navigate = useNavigate();
  const [chapter, setChapter] = useState([]);
  const [selectedChapterName, setSelectedChapterName] = useState("All Chapter");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isChapterDropdownOpen, setIsChapterDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
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
      })
      .finally(() => {
        setIsLoading(false);
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
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 backdrop-blur-sm px-6 py-2">
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
                       className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition-colors duration-200 border border-blue-200"
                     >
                       <Building className="h-5 w-5 text-blue-600" />
                       <span className="text-sm font-medium">
                         {selectedChapterName}
                       </span>
                       <ChevronDown className={`h-4 w-4 text-blue-600 transition-transform duration-200 ${isChapterDropdownOpen ? 'transform rotate-180' : ''}`} />
                     </button>
       
                     {isChapterDropdownOpen && (
                       <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-blue-100 z-50">
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
                                           ? 'bg-blue-100 text-blue-700 font-medium'
                                           : 'text-gray-700 hover:bg-gray-100'
                                       }`}
                                     >
                                       {item.chapter_name}
                                     </button>
                                   </li>
                                 ))}
                               </ul>
                             ) : (
                               <p className="px-3 py-2 text-sm text-gray-700">No chapters available</p>
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

//sajid 