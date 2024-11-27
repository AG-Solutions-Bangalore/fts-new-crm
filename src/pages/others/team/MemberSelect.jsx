import React, { useEffect, useState } from "react";
import { MantineReactTable } from "mantine-react-table";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

const MemberSelect = ({ populateDonorName }) => {
  const [loader, setLoader] = useState(true);
  const [donorData, setDonorData] = useState([]);

  const addDonorToReceipt = (fts_id, indicomp_full_name) => {
    populateDonorName(fts_id, indicomp_full_name);
    console.log("debug", fts_id);
    console.log("debug1", indicomp_full_name);
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

      setDonorData(response);
    } catch (error) {
      console.error("Error fetching donor data:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      accessorKey: "indicomp_full_name",
      header: "Donor Name",
    },
    {
      accessorKey: "indicomp_mobile_phone",
      header: "Mobile",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      enableColumnFilter: false,

      Cell: ({ row }) => (
        <button
          onClick={() =>
            addDonorToReceipt(
              row.original.indicomp_fts_id,
              row.original.indicomp_full_name
            )
          }
          className="flex items-center text-sm gap-1 px-3 py-2 bg-blue-500 hover:bg-red-500 text-white rounded-lg transition-colors"
        >
          <FaPlus className="h-3 w-3" />
          Select
        </button>
      ),
    },
  ];

  if (loader) {
    return (
      <div className="flex justify-center items-center h-56">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <MantineReactTable
        columns={columns}
        data={donorData}
        enableFullScreenToggle={false}
        enableDensityToggle={false}
        enableColumnActions={false}
        enableHiding={false}
        
        mantineTableContainerProps={{
          sx: { maxHeight: "400px" },
        }}
        // initialState={fil}
        // initialState={(showGlobalFilter = true)}
      />
    </div>
  );
};

export default MemberSelect;
