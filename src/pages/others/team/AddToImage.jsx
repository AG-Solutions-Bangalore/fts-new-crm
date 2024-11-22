import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import { Button } from "@material-tailwind/react";

const AddToImage = ({ selectDonorId, setOpenDialog, handleCloseDialog }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault(); // Call this once at the beginning
    setIsButtonDisabled(true);

    if (!selectedFile) {
      toast.error("Please select an image before submitting.");
      return;
    }
    const data = new FormData();
    data.append("indicomp_fts_id", selectDonorId);
    data.append("indicomp_image_logo", selectedFile);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/create-committee-image`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Image Inserted Successfully");
      setOpenDialog(false);
    } catch (error) {
      toast.error("Error creating committee");
      console.error(error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500";

  return (
    <div className="  bg-[#FFFFFF]    rounded-lg  ">
      <div className="sticky top-0 p-2  mb-2 border-b-2 border-green-500 rounded-lg  bg-[#E1F5FA] ">
        <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
          <div className="flex  items-center gap-2">
            <IconInfoCircle className="w-4 h-4" />
            <span>Add Donor image</span>
          </div>
        </h2>
      </div>
      <hr />
      <form
        onSubmit={onSubmit}
        id="dowRecp"
        className="w-full  rounded-lg mx-auto p-4  "
        autoComplete="off"
      >
        <div className="grid grid-cols-1  md:grid-cols-1 lg:grid-cols-1 gap-2">
          <div>
            <FormLabel required>Donor Image</FormLabel>
            <input
              type="file"
              name="indicomp_image_logo"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className={inputClass}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Please Add Donor Image</p>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isButtonDisabled}
              className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-24 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md mr-2"
            >
              {isButtonDisabled ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              onClick={handleCloseDialog}
              className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-24 text-white bg-red-600 hover:bg-red-400 p-2 rounded-lg shadow-md mr-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddToImage;
