import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Dialog,
  FormLabel,
} from "@mui/material";

import {
  IconCircleX,
  IconListCheck,
  IconMail,
  IconUser,
} from "@tabler/icons-react";
import Logout from "../../components/Logout";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { toast } from "react-toastify";

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const handleOpenLogout = () => setOpenModal(!openModal);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog1, setOpenDialog1] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const getData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/fetch-profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFirstName(res.data.user.first_name || "");
      setPhone(res.data.user.phone || "");
      setEmail(res.data.user.email || "");
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile data");
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const onUpdateProfile = async (e) => {
    e.preventDefault();
    if (!firstName) {
      toast.error("Enter Full Name");
      return;
    }
    if (!phone || phone.length !== 10) {
      toast.error("Enter a valid 10-digit Mobile Number");
      return;
    }
    if (!email) {
      toast.error("Enter Email Id");
      return;
    }
    setIsButtonDisabled(true);

    const data = { first_name: firstName, phone: phone };

    try {
      const res = await axios.post(`${BASE_URL}/api/update-profile`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.status === 200) {
        console.log(res.status, "satus");
        console.log("start");
        toast.success("Profile Updated Successfully!");
        console.log("end");

        handleClose();
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Profile not Updated");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (oldPassword === newPassword) {
      toast.error("Same Old Password is not allowed");
      return;
    }

    const data = {
      old_password: oldPassword,
      password: newPassword,
      confirm_password: confirmPassword,
      username: localStorage.getItem("username"),
    };

    try {
      await axios.post(`${BASE_URL}/api/change-password`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Password Updated Successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOpenDialog1(false);
    } catch (error) {
      console.error("Password change failed:", error);
      toast.error("Please enter valid old password");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };
  const handleClose = () => {
    setOpenDialog(false);
    setAnchorEl2(null);
  };
  const handleClose1 = () => {
    setOpenDialog1(false);
    setAnchorEl2(null);
  };
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const validateOnlyText = (inputtxt) =>
    /^[A-Za-z ]+$/.test(inputtxt) || inputtxt === "";

  const validateOnlyDigits = (inputtxt) =>
    /^\d+$/.test(inputtxt) || inputtxt.length === 0;
  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500";
  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src="/images/profile/user-1.jpg"
          alt="image"
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
          },
        }}
      >
        <MenuItem onClick={() => setOpenDialog(true)}>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setOpenDialog1(true)}>
          <ListItemIcon>
            <IconMail width={20} />
          </ListItemIcon>
          <ListItemText>Change Password</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <IconListCheck width={20} />
          </ListItemIcon>
          <ListItemText>My Tasks</ListItemText>
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <Button
            onClick={handleOpenLogout}
            variant="outlined"
            color="primary"
            fullWidth
          >
            Logout
          </Button>
        </Box>
      </Menu>
      <Logout open={openModal} handleOpen={handleOpenLogout} />
      {/*........................................... //Profile ......................................................*/}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        sx={{
          backdropFilter: "blur(5px) sepia(5%)",
          "& .MuiDialog-paper": {
            borderRadius: "18px",
          },
        }}
      >
        <form autoComplete="off" onSubmit={onUpdateProfile}>
          <div className="p-6 space-y-1 sm:w-[280px] md:w-[500px] bg-white rounded-2xl shadow-md">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-slate-800 text-xl font-semibold">
                  Personal Details
                </h1>

                <div className="flex " onClick={handleClose}>
                  <Tooltip title="Close">
                    <button type="button" className="ml-3 pl-2">
                      <IconCircleX />
                    </button>
                  </Tooltip>
                </div>
              </div>

              <div className="mt-2 p-4 ">
                <div className="grid grid-cols-1  gap-6 mb-4">
                  <div>
                    <FormLabel required>Full Name</FormLabel>
                    <input
                      required
                      value={firstName}
                      onChange={(e) => {
                        if (validateOnlyText(e.target.value)) {
                          setFirstName(e.target.value);
                        }
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <FormLabel required>Phone</FormLabel>
                    <input
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => {
                        if (validateOnlyDigits(e.target.value)) {
                          setPhone(e.target.value);
                        }
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <FormLabel required>Email</FormLabel>
                    <input
                      required
                      value={email}
                      disabled
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="mt-5 flex justify-center">
                  <button
                    disabled={isButtonDisabled}
                    type="submit"
                    className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse md:text-right text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
                  >
                    {isButtonDisabled ? "updating..." : "Update Profile"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Dialog>
      {/*........................................... //chnage password ......................................................*/}
      <Dialog
        open={openDialog1}
        onClose={() => setOpenDialog1(false)}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        sx={{
          backdropFilter: "blur(5px) sepia(5%)",
          "& .MuiDialog-paper": {
            borderRadius: "18px",
          },
        }}
      >
        <form autoComplete="off" onSubmit={onChangePassword}>
          <div className="p-6 space-y-1 sm:w-[280px] md:w-[500px] bg-white rounded-2xl shadow-md">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-slate-800 text-xl font-semibold">
                  Change Password
                </h1>

                <div className="flex " onClick={handleClose1}>
                  <Tooltip title="Close">
                    <button type="button" className="ml-3 pl-2">
                      <IconCircleX />
                    </button>
                  </Tooltip>
                </div>
              </div>

              <div className="mt-2 p-4 ">
                <div className="grid grid-cols-1  gap-6 mb-4">
                  <div>
                    <FormLabel required>Old Password</FormLabel>
                    <input
                      required
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <FormLabel required>New Password</FormLabel>
                    <input
                      required
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <FormLabel required>Confirm Password</FormLabel>
                    <input
                      required
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="mt-5 flex justify-center">
                  <button
                    disabled={isButtonDisabled}
                    type="submit"
                    className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse md:text-right text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
                  >
                    {isButtonDisabled ? "updating..." : "Update Profile"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Dialog>
    </Box>
  );
};

export default Profile;
