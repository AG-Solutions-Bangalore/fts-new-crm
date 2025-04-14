import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../base/BaseUrl";
import axios from "axios";
import { toast } from "react-toastify";

const Logout = ({ open, handleOpen }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/panel-logout`,{}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.code === 200) {
        toast.success(res.data.msg);
        localStorage.clear();
        navigate("/");
      } else {
        toast.error(res.data.msg);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>Confirm Logout</DialogHeader>
      <DialogBody>Are you sure you want to log out?</DialogBody>
      <DialogFooter>
        <button
          className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-red-600 hover:bg-red-400 p-2 rounded-lg shadow-md mr-2"
          onClick={handleOpen}
        >
          <span>Cancel</span>
        </button>
        <button
          className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md mr-2"
          onClick={handleLogout}
        >
          <span>Confirm</span>
        </button>
      </DialogFooter>
    </Dialog>
  );
};

export default Logout;
