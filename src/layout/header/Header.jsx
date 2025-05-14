import React, { useState } from "react";
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
  const [chapter, setChapter] = useState({});
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

  //selct chapters
  const [individualDrawer, setIndividualDrawer] = useState(false);

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
      } else if (res.data.code === 400) {
        toast.error(res.data.msg);
        setIsButtonDisabled(false);
      } else {
        toast.error("Unexcepted Error");
        setIsButtonDisabled(false);
      }
    });
  };

  const handleSelectChapter = async (id) => {
    try {
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

        <Stack spacing={1} direction="row" alignItems="center">
          <Tooltip title="Help" arrow>
            {" "}
            <IconInfoOctagon
              width={20}
              className="cursor-pointer"
              onClick={() => {
                navigate("/manualguide-book");
              }}
            />
          </Tooltip>
        </Stack>
        {userType === "4" ? (
          <>
            <Stack spacing={1} direction="row" alignItems="center">
              <Tooltip title="CLear" arrow>
                {" "}
                <button
                  className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-14 mx-5 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md mr-2"
                  onClick={clearChapter}
                >
                  Clear
                </button>
              </Tooltip>
            </Stack>

            <Stack
              spacing={1}
              direction="row"
              alignItems="center"
              className="mx-5 cursor-pointer"
            >
              <Tooltip title="Select Chapter" arrow>
                <IconMessages onClick={handleBoth} />
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
                    )}{" "}
                  </div>
                </Box>
              </SwipeableDrawer>
            </Stack>
          </>
        ) : (
          ""
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
