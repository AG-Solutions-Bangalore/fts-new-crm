import React, { useEffect, useState } from 'react'
import BASE_URL from '../../../base/BaseUrl';
import axios from 'axios';
import { Button, Card, Spinner, Typography } from "@material-tailwind/react";
import { FaPlus } from 'react-icons/fa';
const TABLE_HEAD = ["Donor Name", "Mobile", "Actions"];
const MemberSelect = ({populateDonorName}) => {
    const [loader, setLoader] = useState(true);
  const [donorData, setDonorData] = useState([]);

  const addDonorToReceipt = (fts_id) => {
    populateDonorName(fts_id);
  };

  const getData = async () => {
    setLoader(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/fetch-ind-donors`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const response = res.data.individualCompanies || [];
      const tempRows = response.map((donor) => ({
        name: donor["indicomp_full_name"],
        mobile: donor["indicomp_mobile_phone"],
        fts_id: donor["indicomp_fts_id"],
      }));
      setDonorData(tempRows);
    } catch (error) {
      console.error("Error fetching donor data:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (loader) {
    return (
      <div className="flex justify-center items-center h-56">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
            <Card className="h-56 w-full overflow-scroll custom-scroll">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-2">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {donorData.map((donor, index) => (
            <tr key={index} className="even:bg-blue-gray-50/50">
              <td className="p-2">
                <Typography variant="small" color="blue-gray" className="font-normal">
                {donor.name}
                </Typography>
              </td>
              <td className="p-2">
                <Typography variant="small" color="blue-gray" className="font-normal">
                {donor.mobile}
                </Typography>
              </td>
              <td className="p-2">
                <button
                  onClick={() => addDonorToReceipt(donor.fts_id)}
                  className="flex items-center text-sm gap-1 p-1 bg-blue-500 hover:bg-red-500 text-white rounded-lg  transition-colors"
                >
                  <FaPlus className="h-2 w-2" />
                  Select
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
    </div>
  )
}

export default MemberSelect