import React, { useState } from "react";
import Layout from "../../../layout/Layout";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import moment from "moment";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import axios from "axios";
import { FormLabel } from "@mui/material";
import { RECEIPT_SUMMARY_DOWNLOAD } from "../../../api";

const RecepitSummary = () => {
  const navigate = useNavigate();
  const todayback = moment().format("YYYY-MM-DD");
  const firstdate = moment().startOf("month").format("YYYY-MM-DD");
  const [downloadDonor, setDonorDownload] = useState({
    receipt_from_date: firstdate,
    receipt_to_date: todayback,
  });
  const onInputChange = (e) => {
    // console.log(e.target.value);
    const { name, value } = e.target;
    setDonorDownload({
      ...downloadDonor,
      [name]: value,
    });
  };
  //VIEW

  const onReportView = (e) => {
    e.preventDefault();
    if (document.getElementById("dowRecp").checkValidity()) {
      const { receipt_from_date, receipt_to_date } = downloadDonor;
      localStorage.setItem("receipt_from_date_recp", receipt_from_date);
      localStorage.setItem("receipt_to_date_recp", receipt_to_date);
      navigate("/recepit-summary-view");
      // console.log(
      //   `/recepit-summary-view?from=${receipt_from_date}&to=${receipt_to_date}`,
      //   "console"
      // );
    }
  };

  //DOWNLOAD
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      receipt_from_date: downloadDonor.receipt_from_date,
      receipt_to_date: downloadDonor.receipt_to_date,
    };
    var v = document.getElementById("dowRecp").checkValidity();
    var v = document.getElementById("dowRecp").reportValidity();

    if (v) {
      axios({
        url: RECEIPT_SUMMARY_DOWNLOAD,
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          // console.log("data : ", res.data);
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "receipt_summary.csv"); //or any other extension
          document.body.appendChild(link);
          link.click();
          toast.success("Receipt Summary is Downloaded Successfully");
        })
        .catch((err) => {
          toast.error("Receipt Summary is Not Downloaded");
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
            <span>Receipt Summary </span>
          </h2>
        </div>
        <hr />
        <div className="p-4">
          <h3 className="text-red-500 mb-5">
            Please fill all for View report.
          </h3>
          <form id="dowRecp" autoComplete="off">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <FormLabel required>From Date</FormLabel>
                <input
                  type="date"
                  name="receipt_from_date"
                  value={downloadDonor.receipt_from_date}
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
                  value={downloadDonor.receipt_to_date}
                  onChange={onInputChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>
            <div className="flex justify-start py-4">
              <button
                className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
                onClick={onSubmit}
              >
                {" "}
                Download
              </button>
              <button
                className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
                onClick={onReportView}
              >
                View
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default RecepitSummary;
