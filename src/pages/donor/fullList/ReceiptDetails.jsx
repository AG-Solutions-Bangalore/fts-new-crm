import {
  IconArrowBack,
  IconInfoCircle,
  IconSquareRoundedX,
} from "@tabler/icons-react";

import React, { useState, useEffect } from "react";
import { Card, Typography, Spinner } from "@material-tailwind/react";
import { MdReceipt, MdGroup, MdPayment } from "react-icons/md";
import Moment from "moment";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";

const ReceiptDetails = ({ viewerId, onClose }) => {
  const [loader, setLoader] = useState(false);
  const [donation, setDonation] = useState([]);
  const [membership, setMembership] = useState([]);
  const [famgroup, setFamGroup] = useState([]);
   const [donorfam, setDonorFam] = useState([]);
  const [company, setCompany] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/fetch-donor-receipt-by-id/${viewerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setDonation(res.data.donor_receipts);
        setMembership(res.data.membership_details);
        setFamGroup(res.data.related_group);
        setLoader(false);
        console.log(res.data);
      });
  }, [viewerId]);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/fetch-donor-by-id/${viewerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
       
        setDonorFam(res.data.family_details);
        setCompany(res.data.company_details);
       
        console.log(res.data);
      });
  }, [viewerId]);
  return (
    <div className=" bg-[#FFFFFF] p-2  w-[47rem] inset-0  fixed overflow-y-auto custom-scroll-add">
      <div className=" top-0 p-2  mb-4 border-b-2 border-green-500 rounded-lg  bg-[#E1F5FA] ">
        <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
          <div className="flex  items-center gap-2">
            <IconInfoCircle className="w-4 h-4" />
            <span>Receipt Details{viewerId}</span>
          </div>
          <IconSquareRoundedX
            onClick={() => onClose()}
            className="cursor-pointer hover:text-red-600"
          />
        </h2>
      </div>
      <hr />
      <div className="p-4">
        {loader ? (
          <div className="flex justify-center items-center h-screen">
            <Spinner className="h-12 w-12" color="blue" />
          </div>
        ) : (
          <div className="space-y-2">
            {/* Page Title and Family Group */}
            <div className="flex  justify-between">
              <Typography variant="h5" className="text-gray-800">
                Receipts Details
              </Typography>

              {famgroup.map((fam, key) => (
                <div key={key} className="flex items-center gap-2">
                  <MdGroup className="text-blue-600 text-lg" />
                  <Typography variant="h5" className="text-gray-700">
                    Family Group of:{fam.indicomp_full_name}
                  </Typography>
                </div>
              ))}
            </div>

            {/* Donation Details Section */}
            {donation && (
              <Card className="p-3 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <MdReceipt className="text-blue-600 text-xl" />
                  <Typography variant="h4" color="blue-gray">
                    Donation Details
                  </Typography>
                </div>
                <div className="border-b border-gray-200 mb-2" />

                <div className="overflow-x-auto">
                  <table className="w-full min-w-max table-auto">
                    <thead>
                      <tr className="bg-blue-gray-50">
                        <TableHeader>R.No</TableHeader>
                        <TableHeader>Name</TableHeader>
                        <TableHeader>Date</TableHeader>
                        <TableHeader>Amount</TableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {donation.map((fam, key) => (
                        <tr
                          key={key}
                          className="border-b border-blue-gray-50 hover:bg-blue-gray-50/50 transition-colors"
                        >
                          <TableCell>{fam.receipt_no}</TableCell>
                          <TableCell>{fam.indicomp_full_name}</TableCell>
                          <TableCell>
                            {Moment(fam.receipt_date).format("DD-MM-YYYY")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MdPayment className="text-blue-600" />
                              {fam.receipt_total_amount}
                            </div>
                          </TableCell>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            <Card className="p-3 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <MdGroup className="text-blue-600 text-xl" />
                <Typography variant="h4" color="blue-gray">
                  Membership Details
                </Typography>
              </div>
              <div className="border-b border-gray-200 mb-2" />

              <div className="overflow-x-auto">
                <table className="w-full min-w-max table-auto">
                  <thead>
                    <tr className="bg-blue-gray-50">
                      <TableHeader>R.No</TableHeader>
                      <TableHeader>Name</TableHeader>
                      <TableHeader>Date</TableHeader>
                      <TableHeader>Amount</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {membership.map((fam, key) => (
                      <tr
                        key={key}
                        className="border-b border-blue-gray-50 hover:bg-blue-gray-50/50 transition-colors"
                      >
                        <TableCell>{fam.receipt_no}</TableCell>
                        <TableCell>
                          {fam.individual_company.indicomp_full_name}
                        </TableCell>
                        <TableCell>
                          {Moment(fam.receipt_date).format("DD-MM-YYYY")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MdPayment className="text-blue-600" />
                            {fam.receipt_total_amount}
                          </div>
                        </TableCell>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col gap-2 bg-white">
         {/* Family Details Section */}
         <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Typography variant="h5" color="blue-gray">Family Details</Typography>
              {/* {localStorage.getItem("user_type_id") != 2 &&
               localStorage.getItem("user_type_id") != 3 &&
               localStorage.getItem("user_type_id") != 4 && (
                <Link to={`/add-indivisual/${relId}`}>
                  <Button color="red" size="sm">
                    + Add Family Member
                  </Button>
                </Link>
              )} */}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr className="bg-blue-gray-50">
                    <TableHeader>FTS</TableHeader>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>DOB</TableHeader>
                    <TableHeader>Mobile</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {donorfam.map((fam, key) => (
                    <tr key={key} className="border-b border-blue-gray-50">
                      <TableCell>{fam.indicomp_fts_id}</TableCell>
                      <TableCell>{fam.indicomp_full_name}</TableCell>
                      <TableCell>
                        {fam.indicomp_dob_annualday ? 
                          Moment(fam.indicomp_dob_annualday).format('DD-MM-YYYY') : 
                          'N/A'
                        }
                      </TableCell>
                      <TableCell>{fam.indicomp_mobile_phone}</TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Company Details Section */}
          <Card className="p-6 bg-white">
            <div className="flex justify-between items-center mb-6">
              <Typography variant="h5" color="blue-gray">Company Details</Typography>
              {/* {localStorage.getItem("user_type_id") != 2 &&
               localStorage.getItem("user_type_id") != 3 &&
               localStorage.getItem("user_type_id") != 4 && (
                <Link to={`/add-company/${relId}`}>
                  <Button color="red" size="sm">
                    + Add Company
                  </Button>
                </Link>
              )} */}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr className="bg-blue-gray-50">
                    <TableHeader>FTS</TableHeader>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>DOB</TableHeader>
                    <TableHeader>Mobile</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {company.map((fam, key) => (
                    <tr key={key} className="border-b border-blue-gray-50">
                      <TableCell>{fam.indicomp_fts_id}</TableCell>
                      <TableCell>{fam.indicomp_full_name}</TableCell>
                      <TableCell>
                        {fam.indicomp_dob_annualday ? 
                          Moment(fam.indicomp_dob_annualday).format('DD-MM-YYYY') : 
                          'N/A'
                        }
                      </TableCell>
                      <TableCell>{fam.indicomp_mobile_phone}</TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
      </div>
    </div>
  );
};

const TableHeader = ({ children }) => (
  <th className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-2">
    <Typography
      variant="small"
      className="font-medium leading-none text-blue-gray-600"
    >
      {children}
    </Typography>
  </th>
);

const TableCell = ({ children }) => (
  <td className="p-4">
    <Typography variant="small" className="font-normal text-blue-600">
      {children}
    </Typography>
  </td>
);

export default ReceiptDetails;
