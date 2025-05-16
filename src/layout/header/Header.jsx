import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  Tooltip,
  SwipeableDrawer,
} from "@mui/material";
import PropTypes from "prop-types";

// components
import Profile from "./Profile";
import {
  IconArrowBack,
  IconBuilding,
  IconInfoOctagon,
  IconMenu,
  IconMenuDeep,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { IconMessages } from "@tabler/icons-react";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import { toast } from "react-toastify";

const Header = ({ toggleMobileSidebar, toggleSidebar }) => {
  const userType = localStorage.getItem("user_type_id");
  const navigate = useNavigate();
  const [chapter, setChapter] = useState([]);
  const [selectedChapterName, setSelectedChapterName] = useState("All Chapter");
  const [individualDrawer, setIndividualDrawer] = useState(false);

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: theme.palette.background.paper,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    borderRadius: 13,
    [theme.breakpoints.up("lg")]: {
      minHeight: "70px",
    },
  }));

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));

  // Fetch chapters and determine initial chapter name
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

  const toggleIndividualDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIndividualDrawer(open);
  };

  const handleBoth = () => {
    fetchData();
    setIndividualDrawer(true);
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
        setIndividualDrawer(false);
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
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
          sx={{
            display: {
              lg: "inline",
              xs: "none",
            },
          }}
        >
          <IconMenuDeep width="20" height="20" />
        </IconButton>

        <Box flexGrow={1} />
        {userType === "4" && (
          <Stack
            spacing={1}
            direction="row"
            alignItems="center"
            className="mr-2"
          >
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm flex items-center">
              {selectedChapterName}
            </span>
          </Stack>
        )}

        {userType === "4" && (
          <>
            {selectedChapterName !== "All Chapter" && (
              <Stack spacing={1} direction="row" alignItems="center">
                <Tooltip title="Clear" arrow>
                  <button
                    className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-14 mx-5 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md mr-2"
                    onClick={clearChapter}
                  >
                    Clear
                  </button>
                </Tooltip>
              </Stack>
            )}
            {selectedChapterName == "All Chapter" && (
              <Stack
                spacing={1}
                direction="row"
                alignItems="center"
                className="mx-5 cursor-pointer"
              >
                <Tooltip title="Select Chapter" arrow>
                  <IconBuilding onClick={handleBoth} />
                </Tooltip>

                <SwipeableDrawer
                  anchor="right"
                  open={individualDrawer}
                  onClose={toggleIndividualDrawer(false)}
                  onOpen={toggleIndividualDrawer(true)}
                  sx={{
                    backdropFilter: "blur(5px) sepia(5%)",
                  }}
                >
                  <Box
                    sx={{
                      width: 250,
                    }}
                    role="presentation"
                    onKeyDown={toggleIndividualDrawer(false)}
                  >
                    <div>
                      <h2 className="bg-blue-gray-800 p-4 text-center text-white text-lg font-sans flex">
                        <IconArrowBack
                          onClick={toggleIndividualDrawer(false)}
                          className="cursor-pointer hover:text-red-600 mr-3"
                        />
                        Select Chapters
                      </h2>
                      {chapter && chapter.length > 0 ? (
                        chapter.map((item, index) => (
                          <h4
                            key={index}
                            onClick={() => handleSelectChapter(item.id)}
                            className="text-blue-gray-900 p-4 text-start cursor-pointer hover:bg-blue-gray-50"
                          >
                            {item.chapter_name}
                          </h4>
                        ))
                      ) : (
                        <p className="text-gray-500">No chapters available</p>
                      )}
                    </div>
                  </Box>
                </SwipeableDrawer>
              </Stack>
            )}
          </>
        )}
        <Stack spacing={1} direction="row" alignItems="center">
          <Tooltip title="Profile" arrow>
            <Profile />
          </Tooltip>
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
