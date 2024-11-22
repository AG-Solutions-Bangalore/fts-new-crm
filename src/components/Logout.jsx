import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ open, handleOpen }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
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
