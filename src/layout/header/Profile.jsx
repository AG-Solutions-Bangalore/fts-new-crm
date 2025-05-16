import React, { useState } from "react";
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
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import profile from "../../../public/user-1.jpg";
import {
  IconMail,
  IconUser,
  IconCircleX,
  IconInfoOctagon,
} from "@tabler/icons-react";
import Logout from "../../components/Logout";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { toast } from "react-toastify";

// Utility validators (assumed to be defined elsewhere)
const validateOnlyText = (str) => /^[a-zA-Z\s]*$/.test(str);
const validateOnlyDigits = (str) => /^[0-9]*$/.test(str);

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const [anchorEl2, setAnchorEl2] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog1, setOpenDialog1] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500";

  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const handleOpenLogout = () => setOpenModal((prev) => !prev);

  const handleProfileMenu = (event) => setAnchorEl2(event.currentTarget);
  const closeMenus = () => setAnchorEl2(null);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/fetch-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { first_name, phone, email } = res.data.user;
      setFirstName(first_name || "");
      setPhone(phone || "");
      setEmail(email || "");
    } catch (error) {
      toast.error("Failed to load profile data");
    }
  };

  const handleOpenProfile = () => {
    fetchProfile();
    setOpenDialog(true);
    closeMenus();
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!firstName) return toast.error("Enter Full Name");
    if (!phone || phone.length !== 10)
      return toast.error("Enter a valid 10-digit Mobile Number");
    if (!email) return toast.error("Enter Email Id");

    setIsButtonDisabled(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/update-profile`,
        { first_name: firstName, phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.code === 200) {
        toast.success(res.data.msg);
        setOpenDialog(false);
      } else {
        toast.error(res.data.msg || "Unexpected Error");
      }
    } catch {
      toast.error("Profile not Updated");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword)
      return toast.error("Passwords don't match");
    if (oldPassword === newPassword)
      return toast.error("Same Old Password is not allowed");

    setIsButtonDisabled(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/change-password`,
        {
          old_password: oldPassword,
          password: newPassword,
          confirm_password: confirmPassword,
          username,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.code === 200) {
        toast.success("Password Updated Successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setOpenDialog1(false);
      } else {
        toast.error(res.data.msg || "Unexpected Error");
      }
    } catch {
      toast.error("Please enter valid old password");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <Box>
      <IconButton onClick={handleProfileMenu} color="inherit">
        <Avatar src={profile} alt="Profile" sx={{ width: 35, height: 35 }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl2}
        open={Boolean(anchorEl2)}
        onClose={closeMenus}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{ "& .MuiMenu-paper": { width: "200px" } }}
      >
        <MenuItem onClick={handleOpenProfile}>
          <ListItemIcon>
            <IconUser size={20} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenDialog1(true);
            closeMenus();
          }}
        >
          <ListItemIcon>
            <IconMail size={20} />
          </ListItemIcon>
          <ListItemText>Change Password</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/manualguide-book");
            closeMenus();
          }}
        >
          <ListItemIcon>
            <IconInfoOctagon size={20} />
          </ListItemIcon>
          <ListItemText>Help</ListItemText>
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <Button onClick={handleOpenLogout} variant="outlined" fullWidth>
            Logout
          </Button>
        </Box>
      </Menu>

      <Logout open={openModal} handleOpen={handleOpenLogout} />

      {/* Profile Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <form onSubmit={handleUpdateProfile}>
          <div className="p-6 space-y-1 sm:w-[280px] md:w-[500px] bg-white rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-xl font-semibold text-slate-800">
                Personal Details
              </h1>
              <Tooltip title="Close">
                <button type="button" onClick={() => setOpenDialog(false)}>
                  <IconCircleX />
                </button>
              </Tooltip>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <FormLabel required>Full Name</FormLabel>
                <input
                  value={firstName}
                  required
                  onChange={(e) =>
                    validateOnlyText(e.target.value) &&
                    setFirstName(e.target.value)
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <FormLabel required>Phone</FormLabel>
                <input
                  value={phone}
                  required
                  maxLength={10}
                  onChange={(e) =>
                    validateOnlyDigits(e.target.value) &&
                    setPhone(e.target.value)
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <FormLabel required>Email</FormLabel>
                <input
                  value={email}
                  disabled
                  className={`${inputClass} cursor-not-allowed`}
                />
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="submit"
                  disabled={isButtonDisabled}
                  className="w-36 p-2 text-sm font-medium text-white bg-blue-600 hover:bg-green-700 rounded-lg shadow-md"
                >
                  {isButtonDisabled ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={openDialog1} onClose={() => setOpenDialog1(false)}>
        <form onSubmit={handleChangePassword}>
          <div className="p-6 sm:w-[280px] md:w-[500px] bg-white rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-xl font-semibold text-slate-800">
                Change Password
              </h1>
              <Tooltip title="Close">
                <button type="button" onClick={() => setOpenDialog1(false)}>
                  <IconCircleX />
                </button>
              </Tooltip>
            </div>
            <div className="p-4 space-y-4">
              <input
                type="text"
                name="username"
                autoComplete="username"
                value={username}
                className="hidden"
              />
              <div>
                <FormLabel required>Old Password</FormLabel>
                <input
                  required
                  autoComplete="current-password"
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
                  autoComplete="new-password"
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
                  autoComplete="new-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="submit"
                  disabled={isButtonDisabled}
                  className="w-36 p-2 text-sm font-medium text-white bg-blue-600 hover:bg-green-700 rounded-lg shadow-md"
                >
                  {isButtonDisabled ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </Dialog>
    </Box>
  );
};

export default Profile;
