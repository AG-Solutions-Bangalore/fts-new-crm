import { Button } from '@material-tailwind/react';
import { IconInfoCircle } from '@tabler/icons-react';
import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import BASE_URL from '../../../base/BaseUrl';

const NotificationDialog = ({fetchNotices,handleOpenDialog}) => {
    
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [noticeName, setNoticeName] = useState('');
  const [noticeDetail, setNoticeDetail] = useState('');
  const [toBeSentTo, setToBeSentTo] = useState('users');
  const sento = [
    { value: "To All", label: "To All" },
    { value: "To Only Viewers", label: "To Only Viewers" },
    { value: "To Only Admins", label: "To Only Admins" },
    { value: "To Only Users", label: "To Only Users" },
  ];


  const handleNoticeNameChange = (e) => setNoticeName(e.target.value);
  const handleNoticeDetailChange = (e) => setNoticeDetail(e.target.value);
  const handleTargetChange = (e) => setToBeSentTo(e.target.value);

  const handleSubmitNotice = async (e) => {
    e.preventDefault();
    setIsButtonDisabled
    try {
      const response = await axios.post(
        `${BASE_URL}/api/superadmin-add-notice`,
        {
          notice_name: noticeName,
          notice_detail: noticeDetail,
          to_be_sent_to: toBeSentTo,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Notice successfully posted");

        fetchNotices();
        setNoticeName("");
        setNoticeDetail("");
        setToBeSentTo("");
        handleOpenDialog();
      }
    } catch (error) {
      console.error("Error adding notice:", error);
      toast.error("Error Adding Notice")
    }finally{
        setIsButtonDisabled(false);
    }
  };

    const FormLabel = ({ children, required }) => (
        <label className="block text-sm font-semibold text-black mb-1 ">
          {children}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      );
    
      const inputClassSelect =
        "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-green-500";
      const inputClass =
        "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500";
  return (
    <div className="  bg-[#FFFFFF]    rounded-lg  ">
         <div className="sticky top-0 p-2  mb-2 border-b-2 border-green-500 rounded-lg  bg-[#E1F5FA] ">
        <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
          <div className="flex  items-center gap-2">
            <IconInfoCircle className="w-4 h-4" />
            <span>Post A New Notice</span>
          </div>
        </h2>
      </div>
      <hr />
        
      <form
        onSubmit={handleSubmitNotice}
        id="dowRecp"
        className="w-full  rounded-lg mx-auto p-4  "
        autoComplete="off"
      >
        <div className="grid grid-cols-1  md:grid-cols-1 lg:grid-cols-1 gap-2">
          <div>
          <FormLabel required>Notice Title</FormLabel>
              <input
                type="text"
                name="notice_name"
                value={noticeName}
                onChange={handleNoticeNameChange}
             
                className={inputClass}
                required
              />
              
          </div>
          <div>
          <FormLabel required>Notice Details</FormLabel>
              <input
                type="text"
                name="notice_detail"
                value={noticeDetail}
                onChange={handleNoticeDetailChange}
        
                className={inputClass}
                required
              />
           
          </div>
          <div>
          <FormLabel required>TSend To</FormLabel>
              <select
                name="to_be_sent_to"
                value={toBeSentTo}
                onChange={handleTargetChange}
                required
                className={inputClassSelect}
              >
                <option value="">Select Send To</option>
                {sento.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
          </div>
          <div>
            <Button
              type="submit"
              color="blue"
              disabled={isButtonDisabled}
              className={inputClass}
            >
              {isButtonDisabled ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </form>
        
        
        
        </div>
  )
}

export default NotificationDialog