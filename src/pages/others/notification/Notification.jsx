import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import axios from "axios";
import { HiMiniMinus } from "react-icons/hi2";
import { TfiReload } from "react-icons/tfi";
import { MdCancel } from "react-icons/md";
import BASE_URL from "../../../base/BaseUrl";
import moment from "moment";
import { toast } from "react-toastify";
import { IconInfoCircle, IconPrinter } from "@tabler/icons-react";
import NotificationDialog from "./NotificationDialog";
import {
  Button,
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import ReactToPrint from "react-to-print";

const Notification = () => {
  const [datanotification, setNotification] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const userTypeId = localStorage.getItem("id");
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const url =
        userTypeId === "3"
          ? `${BASE_URL}/api/superadmin-fetch-notices`
          : `${BASE_URL}/api/user-fetch-notices`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotification(response.data.notices || []);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [userTypeId]);

  const handleReload = () => {
    fetchNotices();
  };

  const handleMinimizeToggle = () => {
    setIsMinimized(!isMinimized);
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };

  const markNoticeAsRead = async (noticeId) => {
    var theLoginToken = localStorage.getItem("token");

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };

    fetch(
      `${BASE_URL}/api/user-mark-a-notice-as-read?notice_id=${noticeId}`,
      requestOptions
    ).then((response) => response.json());
    toast.success("Acknowledgment successfully updated");
    fetchNotices();
  };
  return (
    <Layout>
      <div className="  bg-[#FFFFFF] p-2    rounded-lg  ">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-green-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex w-full flex-row justify-between  items-center">
              <div className="flex  items-center gap-2">
                <IconInfoCircle className="w-4 h-4" />
                <span>Notification</span>
              </div>
              <div className="flex gap-3">
                <HiMiniMinus
                  onClick={handleMinimizeToggle}
                  className="text-2xl cursor-pointer"
                />

                <TfiReload
                  onClick={handleReload}
                  className="text-xl cursor-pointer"
                />
                <MdCancel
                  onClick={handleCancel}
                  className="text-2xl cursor-pointer"
                />
              </div>
            </div>
          </h2>
        </div>
        <hr />
        <div className="w-full  rounded-lg mx-auto p-2 overflow-y-auto custom-scroll  ">
          {isVisible && (
            <div className="grid grid-cols-1  gap-4">
              {!isMinimized && (
                <div
                  className="w-full overflow-y-auto"
                  style={{ height: "340px" }}
                >
                  <div className="p-4">
                    {loading ? (
                      <div className="flex justify-center items-center">
                        <Spinner className="h-8 w-8" />
                      </div>
                    ) : datanotification.length > 0 ? (
                      datanotification.map((notice) => (
                        <div key={notice.id} className="mb-4">
                          <h2 className="text-lg font-semibold mb-2 text-black">
                            {notice.notice_name}
                          </h2>
                          <p className="text-sm text-gray-700">
                            {notice.notice_detail}
                          </p>
                          <h3 className="my-4 text-xs text-gray-700">
                            Notice Posted On:{" "}
                            {moment(notice.created_at).format("DD-MM-YY")}
                          </h3>
                          <div className="flex items-center text-xs font-light text-gray-500 mt-1">
                            {notice.is_read === 0 ? (
                              <button
                                className="text-center text-sm font-[400]  hover:animate-pulse w-56 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md mr-2 cursor-pointer"
                                onClick={() => {
                                  setSelectedNotice(notice);
                                  handleOpen();
                                }}
                              >
                                Acknowledge this notice
                              </button>
                            ) : (
                              <button
                                className="text-center text-sm font-[400]  hover:animate-pulse w-36 text-white bg-blue-200 hover:bg-green-200 p-2 rounded-lg shadow-md mr-2 cursor-not-allowed"
                                disabled
                              >
                                Acknowledged
                              </button>
                            )}
                          </div>
                          <hr className="my-4 border-b border-gray-600" />
                        </div>
                      ))
                    ) : (
                      <p>No notices available.</p>
                    )}
                  </div>
                </div>
              )}
              <hr />
              {userTypeId === "3" && (
                <div className="flex w-max p-4">
                  <button
                    onClick={handleOpenDialog}
                    className="text-center text-sm font-[400]  hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md mr-2 cursor-pointer"
                  >
                    Add New Notice
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Dialog open={openDialog} handler={handleOpenDialog}>
        <DialogBody>
          <NotificationDialog
            fetchNotices={fetchNotices}
            handleOpenDialog={handleOpenDialog}
          />
        </DialogBody>
      </Dialog>

      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Acknowledge Notice</DialogHeader>
        <DialogBody>
          Are you sure you have read and understood this notice?
        </DialogBody>
        <DialogFooter>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg mr-2"
            onClick={handleOpen}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={() => {
              if (selectedNotice) {
                markNoticeAsRead(selectedNotice.id);
              }
              handleOpen();
            }}
          >
            Yes, I Understand
          </button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
};

export default Notification;
