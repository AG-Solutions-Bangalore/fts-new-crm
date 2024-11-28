import React, { useEffect, useState } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { Spinner } from "@material-tailwind/react";
import { IconArrowBack } from "@tabler/icons-react";

const MemberSelect = ({ populateDonorName, setOpenDialog }) => {
  const [loader, setLoader] = useState(true);
  const [donorData, setDonorData] = useState([]);

  const addDonorToReceipt = (fts_id, indicomp_full_name) => {
    populateDonorName(fts_id, indicomp_full_name);
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
          className="flex items-center text-sm gap-1 px-3 py-2 bg-blue-500 hover:bg-green-500 text-white rounded-lg transition-colors"
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
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div>
        <div className="relative">
          <h2 className="absolute top-3 left-2 z-50 flex items-center space-x-2 text-lg px-4 font-bold text-black">
            <IconArrowBack
              onClick={() => {
                setOpenDialog(false);
              }}
              className="cursor-pointer hover:text-red-600"
            />
            <span>Select</span>
          </h2>

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
          />
        </div>
      </div>
    </div>
  );
};

export default MemberSelect;
