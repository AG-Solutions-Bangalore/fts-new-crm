import Layout from "../../../layout/Layout";
import Moment from "moment";
import { useState } from "react";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import axios from "axios";
import { FormLabel } from "@mui/material";
import { DOWNLOAD_PURCHASE_OTS } from "../../../api";

function Downloadots() {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isButtonDisableds, setIsButtonDisableds] = useState(false);

  // Get the first and last date
  const todayback = Moment().format("YYYY-MM-DD");
  const firstdate = Moment().startOf("month").format("YYYY-MM-DD");

  const [receiptsdwn, setReceiptDownload] = useState({
    receipt_from_date: firstdate,
    receipt_to_date: todayback,
  });

  // Input change handler for native inputs
  const onInputChange = (e) => {
    console.log(e.target.value);
    const { name, value } = e.target;
    setReceiptDownload({
      ...receiptsdwn,
      [name]: value,
    });
  };

  // Submit handler for download
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      receipt_from_date: receiptsdwn.receipt_from_date,
      receipt_to_date: receiptsdwn.receipt_to_date,
    };

    if (document.getElementById("dowRecp").reportValidity()) {
      setIsButtonDisabled(true);

      axios({
        url: DOWNLOAD_PURCHASE_OTS,
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "ots_list.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("OTS is Downloaded Successfully");
          setReceiptDownload({
            receipt_from_date: firstdate,
            receipt_to_date: todayback,
          });
        })
        .catch((err) => {
          toast.error("OTS is Not Downloaded");
          console.error("Download error:", err.response);
        })
        .finally(() => {
          setIsButtonDisabled(false);
        });
    }
  };

  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500";

  return (
    <Layout>
      <div className="  bg-[#FFFFFF] p-2   rounded-lg">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-green-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row gap-2 items-center  rounded-xl p-2 ">
            {/* <IconInfoCircle className="w-4 h-4" /> */}
            <span>Download OTS</span>
          </h2>
        </div>
        <hr />
        <h3 className="text-red-500 mb-5">
          Leave blank if you want all records.
        </h3>

        <form id="dowRecp" autoComplete="off">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <FormLabel required>From Date</FormLabel>
              <input
                type="date"
                name="receipt_from_date"
                value={receiptsdwn.receipt_from_date}
                onChange={onInputChange}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>To Date</FormLabel>
              <input
                type="date"
                name="receipt_to_date"
                value={receiptsdwn.receipt_to_date}
                onChange={onInputChange}
                className={inputClass}
                required
              />
            </div>
          </div>
          <div className="flex justify-start py-4">
            <button
              className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md mr-2"
              onClick={onSubmit}
              disabled={isButtonDisabled}
            >
              {" "}
              {isButtonDisabled ? "Downloading ..." : "Download "}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default Downloadots;
