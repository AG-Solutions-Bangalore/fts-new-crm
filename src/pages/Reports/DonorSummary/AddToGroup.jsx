import React, { useState, useEffect, useMemo } from "react";
import { Button, Spinner } from "@material-tailwind/react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { IconArrowBack } from "@tabler/icons-react";
import { DONOR_SUMMARY_FETCH_DONOR } from "../../../api";

const AddToGroup = ({ populateDonorName, handleClose }) => {
  const [loader, setLoader] = useState(true);
  const [donorData, setDonorData] = useState([]);

  const addDonorToReceipt = (fts_id) => {
    populateDonorName(fts_id);
  };

  const getData = async () => {
    setLoader(true);
    try {
      const res = await axios.get(`${DONOR_SUMMARY_FETCH_DONOR}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const response = res.data.individualCompanies || [];
      const tempRows = response.map((donor) => ({
        indicomp_full_name: donor["indicomp_full_name"],
        indicomp_mobile_phone: donor["indicomp_mobile_phone"],
        indicomp_fts_id: donor["indicomp_fts_id"],
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

  const columns = useMemo(
    () => [
      {
        accessorKey: "indicomp_full_name",
        header: "Donor Name",
      },
      {
        accessorKey: "indicomp_mobile_phone",
        header: "Mobile",
      },
      {
        accessorKey: "indicomp_fts_id",
        header: "Actions",
        enableColumnFilter: false,
        Cell: ({ cell }) => (
          <div className="flex justify-start ">
            <button
              className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse md:text-right text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
              onClick={() => addDonorToReceipt(cell.getValue())}
            >
              {" "}
              Select
            </button>
          </div>
        ),
      },
    ],
    []
  );
  const table = useMantineReactTable({
    columns,
    data: donorData || [],
    enableDensityToggle: false,
    enableColumnActions: false,
    enableFullScreenToggle: false,
    enableHiding: false,
  });
  return (
    <div className="data-table-wrapper">
      {loader ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner />
        </div>
      ) : (
        <div className="relative">
          <h2 className="absolute top-3 left-2 z-50 flex items-center space-x-2 text-lg px-4 font-bold text-black">
            <IconArrowBack
              onClick={handleClose}
              className="cursor-pointer hover:text-red-600"
            />
            <span>Add Donor</span>
          </h2>

          <MantineReactTable table={table} />
        </div>
      )}
    </div>
  );
};

export default AddToGroup;
