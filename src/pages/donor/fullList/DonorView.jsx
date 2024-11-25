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
  MdWeb,
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
    <div className="bg-[#F8FAFC] p-4 sm:w-[300px] md:w-[48rem] overflow-y-auto custom-scroll-add">
      {/* Header Section */}
      {/* <div className="sticky top-0 z-10 bg-white shadow-md rounded-xl mb-6">
        <div className="bg-[#E1F5FA] p-4 rounded-t-xl border-b-2 border-green-500">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <IconInfoCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-sm font-semibold text-black">Donor View </h2>
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
                    onClick={toggleOldReceiptDetailsDrawer(true)}
                    className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
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
                    className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-56 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
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
      </div> */}

      <div className="sticky top-0 z-10 bg-white shadow-md rounded-xl mb-6">
        <div className="bg-[#E1F5FA] p-4 sm:p-6 rounded-t-xl border-b-2 border-green-500">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <IconInfoCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-sm sm:text-base font-semibold text-black">
                Donor View
              </h2>
            </div>
            <IconArrowBack
              onClick={onClose}
              className="cursor-pointer hover:text-red-600 transition-colors"
            />
          </div>
        </div>

        {donor && (
          <div className="p-4 sm:p-6 bg-white rounded-b-xl">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-semibold text-black">
                  {donor.indicomp_type === "Individual"
                    ? `${donor.title} ${donor.indicomp_full_name}`
                    : `M/s ${donor.indicomp_full_name}`}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-black">
                  FTS Id: {donor.indicomp_fts_id}
                </p>
                {famgroup.map((fam, key) => (
                  <p
                    key={key}
                    className="text-xs sm:text-sm font-semibold text-black"
                  >
                    Family Group: {fam.indicomp_full_name}
                  </p>
                ))}
              </div>

              {localStorage.getItem("user_type_id") != 4 && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={toggleOldReceiptDetailsDrawer(true)}
                    className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-full sm:w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
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
                    className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-full sm:w-56 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
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
        <div className="flex flex-col  bg-gray-50">
          {/* Section 1: Personal/Company Information and Additional Details */}
          <div className="w-full mb-8">
            <div className="bg-white rounded-xl p-8 shadow-md">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Personal/Company Info */}
                <div className="border-r pr-6">
                  <SectionHeader
                    icon={<MdPerson className="text-blue-600 w-6 h-6" />}
                    title={
                      donor.indicomp_type === "Individual"
                        ? "Personal Information"
                        : "Company Details"
                    }
                  />
                  <div className="grid gap-4 mt-4">
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
                          label="Date of Birth"
                          value={
                            donor.indicomp_dob_annualday
                              ? Moment(donor.indicomp_dob_annualday).format(
                                  "DD MMMM, YYYY"
                                )
                              : "Not Available"
                          }
                        />
                        <InfoField
                          label="Gender"
                          value={donor.indicomp_gender}
                        />
                      </>
                    ) : (
                      <>
                        <InfoField
                          label="Contact Person"
                          value={donor.indicomp_com_contact_name}
                        />
                        <InfoField
                          label="Designation"
                          value={donor.indicomp_com_contact_designation}
                        />
                        <InfoField
                          label="CSR Status"
                          value={donor.indicomp_csr}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="xl:col-span-2 mt-3 ">
                  <SectionHeader
                    icon={
                      <IconInfoCircle className="text-purple-600 w-6 h-6" />
                    }
                    title="Additional Details"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <InfoField
                      label="Belongs To"
                      value={donor.indicomp_belongs_to}
                    />
                    <InfoField
                      label="PAN Number"
                      value={donor.indicomp_pan_no}
                    />
                    <InfoField
                      label="Promoter"
                      value={donor.indicomp_promoter}
                    />
                    <InfoField label="Source" value={donor.indicomp_source} />
                    <InfoField
                      label="Donor Type"
                      value={donor.indicomp_donor_type}
                    />
                    <InfoField label="Type" value={donor.indicomp_type} />
                    <InfoField label="Remarks" value={donor.indicomp_remarks} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Contact and Address Information */}
          <div className="w-full">
            <div className="bg-white rounded-xl p-8  shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div>
                  <SectionHeader
                    icon={<MdPhone className="text-green-600 w-6 h-6" />}
                    title="Contact Information"
                  />
                  <div className="grid gap-4 mt-4">
                    <ContactItem
                      // icon={<MdPhone className="text-blue-500 w-5 h-5" />}
                      label="Mobile"
                      value={donor.indicomp_mobile_phone}
                    />
                    <ContactItem
                      // icon={<MdPhone className="text-green-500 w-5 h-5" />}
                      label="WhatsApp"
                      value={donor.indicomp_mobile_whatsapp}
                    />
                    <ContactItem
                      // icon={<MdEmail className="text-orange-500 w-5 h-5" />}
                      label="Email"
                      value={donor.indicomp_email}
                    />
                    <ContactItem
                      // icon={<MdWeb className="text-red-500 w-5 h-5" />}
                      label="Website"
                      value={donor.indicomp_website}
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <SectionHeader
                    icon={<MdLocationOn className="text-orange-600 w-6 h-6" />}
                    title="Address Information"
                  />
                  <div className="space-y-8 mt-4">
                    <AddressDisplay
                      title="Residence Address"
                      address={
                        donor.indicomp_res_reg_address ||
                        donor.indicomp_res_reg_city
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
                    <AddressDisplay
                      title="Office Address"
                      address={
                        donor.indicomp_off_branch_address ||
                        donor.indicomp_res_reg_city
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="bg-gray-100 p-2 rounded-lg">{icon}</div>
    <h5 className="text-lg font-semibold text-black">{title}</h5>
  </div>
);

const InfoField = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-sm font-medium text-gray-600">{label}</p>
    <p className="text-sm text-gray-900">{value || "Not Available"}</p>
  </div>
);

const ContactItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    {icon}
    <InfoField label={label} value={value} />
  </div>
);

const AddressDisplay = ({ title, address }) => (
  <div className="space-y-2">
    <h6 className="text-sm font-medium text-gray-600">{title}</h6>
    <div className="text-sm text-gray-900 leading-relaxed">
      {address ? (
        <div className="space-y-1">
          <p>{address.address}</p>
          <p>
            {address.area}
            {address.landmark && `, ${address.landmark}`}
          </p>
          <p>
            {address.city}, {address.state} - {address.pincode}
          </p>
        </div>
      ) : (
        <p>Address not available</p>
      )}
    </div>
  </div>
);

export default DonorView;
