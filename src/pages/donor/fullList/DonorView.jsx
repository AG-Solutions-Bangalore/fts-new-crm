import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Moment from "moment";
import { Card, Typography, Button, Spinner } from "@material-tailwind/react";
import {
  MdPerson,
  MdBusiness,
  MdPhone,
  MdEmail,
  MdLocationOn,
} from "react-icons/md";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
import ReceiptDetails from "./ReceiptDetails";
import OldReceipt from "./OldReceipt";
const DonorView = ({ viewerId, onClose }) => {
  // States
  const [loader, setLoader] = useState(false);
  const [donor, setDonor] = useState(null);
  const [donorfam, setDonorFam] = useState([]);
  const [company, setCompany] = useState([]);
  const [famgroup, setFamGroup] = useState([]);

  // receipt details

  const [receiptDetailsDrawer, setReceiptDetailsDrawer] = useState(false);

  const toggleReceiptDetailsDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setReceiptDetailsDrawer(open);
  };
  // old receipt
  const [oldreceiptDetailsDrawer, setOldReceiptDetailsDrawer] = useState(false);

  const toggleOldReceiptDetailsDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOldReceiptDetailsDrawer(open);
  };

  const navigate = useNavigate();

  // Fetch data useEffect would go here
  useEffect(() => {
    // Add your data fetching logic here
    const fetchViewerData = async () => {
      try {
        axios
          .get(`${BASE_URL}/api/fetch-donor-by-id/${viewerId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            setDonor(res.data.individualCompany);
            setDonorFam(res.data.family_details);
            setCompany(res.data.company_details);
            setFamGroup(res.data.related_group);
            setLoader(false);
          });
      } catch (error) {
        console.error("Error fetching donor data:", error);
      }
    };

    if (viewerId) {
      fetchViewerData();
    }
  }, [viewerId]);

  const relId = donor?.indicomp_related_id;
  const indid = donor?.id;

  const handleRecipt = () => {
    navigate(`/receipt-details/${indid}`);
  };
  const handleOldRecipt = () => {
    navigate(`/receipt-list/${indid}`);
  };

  if (loader) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="h-12 w-12" color="blue" />
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] p-4 w-[48rem] overflow-y-auto custom-scroll-add">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-white shadow-md rounded-xl mb-6">
        <div className="bg-[#E1F5FA] p-4 rounded-t-xl border-b-2 border-green-500">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <IconInfoCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-sm font-semibold text-black">Donor View</h2>
            </div>
            <IconArrowBack
              onClick={onClose}
              className="cursor-pointer hover:text-red-600 transition-colors"
            />
          </div>
        </div>

        {donor && (
          <div className="p-4 bg-white rounded-b-xl">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-black">
                  {donor.indicomp_type === "Individual"
                    ? `${donor.title} ${donor.indicomp_full_name}`
                    : `M/s ${donor.indicomp_full_name}`}
                </h3>
                <p className="text-xs font-semibold text-black">
                  FTS Id: {donor.indicomp_fts_id}
                </p>
                {famgroup.map((fam, key) => (
                  <p key={key} className="text-xs font-semibold text-black">
                    Family Group: {fam.indicomp_full_name}
                  </p>
                ))}
              </div>

              {localStorage.getItem("user_type_id") != 4 && (
                <div className="flex gap-2">
                  <button
                    // onClick={() => navigate(`/receipt-list/${donor?.viewerId}`)}
                    onClick={toggleOldReceiptDetailsDrawer(true)}
                    // className="px-4 py-2 text-xs bg-gradient-to-r from-blue-500 to-red-600 text-white rounded-lg hover:from-green-600 hover:to-red-700 transition-all shadow-sm"
                    className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse md:text-right text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                  >
                    Old Receipts
                  </button>
                  <SwipeableDrawer
                    anchor="right"
                    open={oldreceiptDetailsDrawer}
                    onClose={toggleOldReceiptDetailsDrawer(false)}
                    onOpen={toggleOldReceiptDetailsDrawer(true)}
                  >
                    <OldReceipt
                      onClose={toggleOldReceiptDetailsDrawer(false)}
                      viewerId={viewerId}
                    />
                  </SwipeableDrawer>
                  <button
                    onClick={toggleReceiptDetailsDrawer(true)}
                    // onClick={() => navigate(`/receipt-details/${donor?.viewerId}`)}
                    className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse md:text-right text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                  >
                    Receipts & Family Details
                  </button>
                  <SwipeableDrawer
                    anchor="right"
                    open={receiptDetailsDrawer}
                    onClose={toggleReceiptDetailsDrawer(false)}
                    onOpen={toggleReceiptDetailsDrawer(true)}
                  >
                    <ReceiptDetails
                      onClose={toggleReceiptDetailsDrawer(false)}
                      viewerId={viewerId}
                    />
                  </SwipeableDrawer>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {donor && (
        <div className="space-y-6">
          {/* Main Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information Card */}
            <Card className="p-4 border-l-4 border-green-500  rounded-xl shadow-sm hover:shadow-md  hover:bg-gradient-to-r from-green-50 to-green-300 transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <MdPerson className="text-green-600 w-5 h-5" />
                <h5 className="text-sm font-semibold text-black">
                  Personal Information
                </h5>
              </div>
              <div className="space-y-4">
                {donor.indicomp_type === "Individual" ? (
                  <>
                    <InfoField
                      label="Father Name"
                      value={donor.indicomp_father_name}
                    />
                    <InfoField
                      label="Mother Name"
                      value={donor.indicomp_mother_name}
                    />
                    <InfoField
                      label="Spouse Name"
                      value={donor.indicomp_spouse_name}
                    />
                    <InfoField
                      label="DOB"
                      value={
                        donor.indicomp_dob_annualday
                          ? Moment(donor.indicomp_dob_annualday).format(
                              "DD-MM-YYYY"
                            )
                          : "N/A"
                      }
                    />
                    <InfoField label="Gender" value={donor.indicomp_gender} />
                  </>
                ) : (
                  <>
                    <InfoField
                      label="Contact Name"
                      value={donor.indicomp_com_contact_name}
                    />
                    <InfoField
                      label="Designation"
                      value={donor.indicomp_com_contact_designation}
                    />
                    <InfoField label="CSR" value={donor.indicomp_csr} />
                  </>
                )}
              </div>
            </Card>

            {/* Communication Card */}
            <Card className="p-4 border-l-4 border-red-500  hover:bg-gradient-to-r from-red-50 to-red-300  rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <MdPhone className="text-green-600 w-5 h-5" />
                <h5 className="text-sm font-semibold text-black">
                  Communication Details
                </h5>
              </div>
              <div className="space-y-4">
                <InfoField
                  label="Mobile"
                  value={donor.indicomp_mobile_phone}
                  icon={<MdPhone />}
                />
                <InfoField
                  label="WhatsApp"
                  value={donor.indicomp_mobile_whatsapp}
                  icon={<MdPhone />}
                />
                <InfoField
                  label="Email"
                  value={donor.indicomp_email}
                  icon={<MdEmail />}
                />
                <InfoField label="Website" value={donor.indicomp_website} />
              </div>
            </Card>
          </div>

          {/* Additional Information Card */}
          <Card className="p-4 border-l-4 border-blue-500  hover:bg-gradient-to-r from-blue-50 to-blue-300  rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <IconInfoCircle className="text-green-600 w-5 h-5" />
              <h5 className="text-sm font-semibold text-black">
                Additional Information
              </h5>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoField label="Belongs To" value={donor.indicomp_belongs_to} />
              <InfoField label="PAN Number" value={donor.indicomp_pan_no} />
              <InfoField label="Promoter" value={donor.indicomp_promoter} />
              <InfoField label="Source" value={donor.indicomp_source} />
              <InfoField label="Donor Type" value={donor.indicomp_donor_type} />
              <InfoField label="Type" value={donor.indicomp_type} />
            </div>
            <div className="mt-4">
              <InfoField
                label="Remarks"
                value={donor.indicomp_remarks}
                fullWidth
              />
            </div>
          </Card>

          {/* Address Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4 border-l-4 border-yellow-500  hover:bg-gradient-to-r from-yellow-50 to-yellow-300  rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <MdLocationOn className="text-green-600 w-5 h-5" />
                <h5 className="text-sm font-semibold text-black">
                  Residence Address
                </h5>
              </div>
              <AddressField
                address={
                  donor.indicomp_res_reg_address
                    ? {
                        address: donor.indicomp_res_reg_address,
                        area: donor.indicomp_res_reg_area,
                        landmark: donor.indicomp_res_reg_ladmark,
                        city: donor.indicomp_res_reg_city,
                        state: donor.indicomp_res_reg_state,
                        pincode: donor.indicomp_res_reg_pin_code,
                      }
                    : null
                }
              />
            </Card>

            <Card className="p-4 border-l-4 border-yellow-500  hover:bg-gradient-to-r from-yellow-50 to-yellow-300    rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <MdBusiness className="text-green-600 w-5 h-5" />
                <h5 className="text-sm font-semibold text-black">
                  Office Address
                </h5>
              </div>
              <AddressField
                address={
                  donor.indicomp_off_branch_address
                    ? {
                        address: donor.indicomp_off_branch_address,
                        area: donor.indicomp_off_branch_area,
                        landmark: donor.indicomp_off_branch_ladmark,
                        city: donor.indicomp_off_branch_city,
                        state: donor.indicomp_off_branch_state,
                        pincode: donor.indicomp_off_branch_pin_code,
                      }
                    : null
                }
              />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoField = ({ label, value, icon }) => (
  <div className="relative">
    <label className=" text-sm font-semibold text-black mb-1 flex items-center gap-2">
      {icon && <span className="text-gray-500">{icon}</span>}
      {label}
    </label>
    <div className="w-full px-3 py-2 text-xs border rounded-lg border-green-500 bg-white hover:bg-gray-50 transition-colors">
      {value || "N/A"}
    </div>
  </div>
);

const AddressField = ({ address }) => (
  <div className="w-full px-3 py-2 text-xs border rounded-lg border-green-500 bg-white hover:bg-gray-50 transition-colors min-h-[2.5rem]">
    {address
      ? `${address.address}, ${address.area}, ${address.landmark}, ${address.city}, ${address.state} - ${address.pincode}`
      : "N/A"}
  </div>
);

export default DonorView;
