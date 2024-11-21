import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../../components/common/PageTitle";
import { Input, Button, Card } from "@material-tailwind/react";
import moment from "moment";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import axios from "axios";
import { FormLabel } from "@mui/material";
import SelectField from "../../../components/common/SelectInput";

const PromterSummary = () => {
  const navigate = useNavigate();
  const [promoter, setPromoters] = useState([]);
  const todayback = moment().format("YYYY-MM-DD");
  const firstdate = moment().startOf("month").format("YYYY-MM-DD");
  const [downloadDonor, setDonorDownload] = useState({
    receipt_from_date: firstdate,
    receipt_to_date: todayback,
    indicomp_promoter: "",
  });
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    const updatedDonor = {
      ...downloadDonor,
      [name]: value,
    };
    setDonorDownload(updatedDonor);
    checkIfButtonShouldBeEnabled(updatedDonor);
  };

  const checkIfButtonShouldBeEnabled = (data) => {
    const { receipt_from_date, receipt_to_date, indicomp_promoter } = data;
    setIsButtonEnabled(
      Boolean(receipt_from_date && receipt_to_date && indicomp_promoter)
    );
  };

  const onReportView = (e) => {
    e.preventDefault();
    if (document.getElementById("dowRecp").checkValidity()) {
      const { receipt_from_date, receipt_to_date, indicomp_promoter } =
        downloadDonor;
      localStorage.setItem("receipt_from_date_prm", receipt_from_date);
      localStorage.setItem("receipt_to_date_prm", receipt_to_date);
      localStorage.setItem("indicomp_full_name_prm", indicomp_promoter);
      navigate("/report/promoter-view");
    }
  };

  useEffect(() => {
    const theLoginToken = localStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };

    fetch(BASE_URL + "/api/fetch-promoter", requestOptions)
      .then((response) => response.json())
      .then((data) => setPromoters(data.promoter));
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      indicomp_promoter: downloadDonor.indicomp_promoter,
      receipt_from_date: downloadDonor.receipt_from_date,
      receipt_to_date: downloadDonor.receipt_to_date,
    };

    if (document.getElementById("dowRecp").reportValidity()) {
      axios({
        url: BASE_URL + "/api/download-promoter-summary",
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
          link.setAttribute("download", "promoter_summary.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Promoter Summary is Downloaded Successfully");
        })
        .catch(() => {
          toast.error("Promoter Summary is Not Downloaded");
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
            <span>Prompter Summary</span>
          </h2>
        </div>
        <hr />

        <div className="p-4">
          <h3 className="text-red-500 mb-5">
            Please fill all for View report.
          </h3>
          <form id="dowRecp" autoComplete="off">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <SelectField
                label="Notice Title"
                name="indicomp_promoter"
                value={downloadDonor.indicomp_promoter}
                options={promoter.map((item) => ({
                  value: item.indicomp_promoter,
                  label: item.indicomp_promoter,
                }))}
                onChange={onInputChange}
                placeholder="Select Notice"
                required
              />

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
                className={`text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ${
                  !isButtonEnabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={onReportView}
                disabled={!isButtonEnabled}
              >
                View
              </button>
              <button
                className={`text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4 ${
                  !isButtonEnabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={onSubmit}
                disabled={!isButtonEnabled}
              >
                Download
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PromterSummary;
