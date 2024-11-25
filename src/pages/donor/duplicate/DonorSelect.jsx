import React, { useEffect, useState } from "react";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";

const DonorSelect = ({ populateDonorName }) => {
  const [donors, setDonors] = useState([]);
  const [loader, setLoader] = useState(true);

  // Fetch donors from API
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/fetch-donors`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setDonors(res.data.individualCompanies || []);
        setLoader(false);
      })
      .catch(() => setLoader(false));
  }, []);
  return (
    <div className=" h-72 overflow-y-auto border rounded-lg  ">
      {loader ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : donors.length > 0 ? (
        <table className="table-auto w-full   border-collapse border-2 border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                FTS ID
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Donor Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Mobile
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {donors.map((donor) => (
              <tr key={donor.indicomp_fts_id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {donor.indicomp_fts_id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {donor.indicomp_full_name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {donor.indicomp_mobile_phone}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-20 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md mr-2"
                    onClick={() => populateDonorName(donor.indicomp_fts_id)}
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-gray-600">No donors found.</div>
      )}
    </div>
  );
};

export default DonorSelect;
