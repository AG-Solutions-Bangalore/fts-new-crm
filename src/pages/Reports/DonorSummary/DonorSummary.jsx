import React, { useState } from "react";
import Layout from "../../../layout/Layout";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Button,
  Card,
  Dialog,
  DialogBody,
  DialogHeader,
} from "@material-tailwind/react";
import moment from "moment/moment";
import { FormLabel } from "@mui/material";
import AddToGroup from "./AddToGroup";
import { IconArrowBack } from "@tabler/icons-react";

const DonorSummary = () => {
  const navigate = useNavigate();
  const todayback = moment().format("YYYY-MM-DD");
  const firstdate = moment().startOf("month").format("YYYY-MM-DD");
  const [donorSummary, setDonorSummary] = useState({
    indicomp_full_name: "",
    receipt_from_date: firstdate,
    receipt_to_date: todayback,
  });
  const [openDialog, setOpenDialog] = useState(false);

  // Handle input change
  const onInputChange = (e) => {
    console.log(e.target.value);
    const { name, value } = e.target;
    setDonorSummary({
      ...donorSummary,
      [name]: value,
    });
  };

  const handleOpenDialog = () => setOpenDialog(!openDialog);

  const populateDonorName = (fts_id) => {
    setDonorSummary({
      ...donorSummary,
      indicomp_full_name: fts_id,
    });
    setOpenDialog(false);
  };

  const onReporIndividualtView = (e) => {
    e.preventDefault();
    if (document.getElementById("dowRecp").checkValidity()) {
      const { receipt_from_date, receipt_to_date, indicomp_full_name } =
        donorSummary;

      localStorage.setItem("receipt_from_date_indv", receipt_from_date);
      localStorage.setItem("receipt_to_date_indv", receipt_to_date);
      localStorage.setItem("indicomp_full_name_indv", indicomp_full_name);

      navigate("/report/donor-view");
    }
  };

  const onReportGroupView = (e) => {
    e.preventDefault();
    if (document.getElementById("dowRecp").checkValidity()) {
      const { receipt_from_date, receipt_to_date, indicomp_full_name } =
        donorSummary;
      localStorage.setItem("receipt_from_date_grp", receipt_from_date);
      localStorage.setItem("receipt_to_date_grp", receipt_to_date);
      localStorage.setItem("indicomp_full_name_grp", indicomp_full_name);
      navigate("/report/donorgroup-view");
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
            <span>Donor Summary</span>
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
                <FormLabel required>Donor Name</FormLabel>
                <input
                  required
                  name="indicomp_full_name"
                  value={donorSummary.indicomp_full_name}
                  onClick={handleOpenDialog}
                  onChange={onInputChange}
                  className={inputClass}
                />
              </div>

              <div>
                <FormLabel required>From Date</FormLabel>
                <input
                  type="date"
                  name="receipt_from_date"
                  value={donorSummary.receipt_from_date}
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
                  value={donorSummary.receipt_to_date}
                  onChange={onInputChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="flex justify-start py-4">
              <button
                className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                onClick={onReporIndividualtView}
              >
                Individual View
              </button>
              <button
                className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
                onClick={onReportGroupView}
              >
                Group View
              </button>
            </div>
          </form>
        </div>

        <Dialog open={openDialog} handler={handleOpenDialog}>
          <DialogBody divider>
            <div className="max-h-[500px] overflow-y-auto">
              <AddToGroup
                populateDonorName={populateDonorName}
                handleClose={handleOpenDialog}
              />
            </div>
          </DialogBody>
        </Dialog>
      </div>
    </Layout>
  );
};

export default DonorSummary;
