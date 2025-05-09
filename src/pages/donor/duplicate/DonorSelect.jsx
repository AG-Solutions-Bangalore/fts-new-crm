import React, { useEffect, useState } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Center, Button } from "@mantine/core";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { Spinner } from "@material-tailwind/react";
import { IconArrowBack } from "@tabler/icons-react";

const DonorSelect = ({ populateDonorName, setShowModal }) => {
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

  // Define table columns
  const columns = [
    {
      accessorKey: "indicomp_fts_id",
      header: "FTS ID",
      size: 20,
    },
    {
      accessorKey: "indicomp_full_name",
      header: "Donor Name",
      size: 20,
    },
    {
      accessorKey: "indicomp_mobile_phone",
      header: "Mobile",
      size: 20,
    },
    {
      id: "actions",
      header: "Actions",
      size: 20,
      Cell: ({ row }) => (
        <button
          size="xs"
          className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-20 text-white bg-blue-600 hover:bg-blue-400 p-2 rounded-lg shadow-md mr-2"
          onClick={() =>
            populateDonorName(
              row.original.indicomp_fts_id,
              row.original.indicomp_full_name
            )
          }
        >
          Select
        </button>
      ),
    },
  ];
  const table = useMantineReactTable({
    columns,
    data: donors,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    mantineTableContainerProps: { sx: { maxHeight: "400px" } },
    initialState: {
      showGlobalFilter: true, 
    },
    mantineSearchTextInputProps: {
      autoFocus: true, 
    },
  });

 
  if (loader) {
    return (
      <div className="flex justify-center items-center h-56">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="relative">
      <h2 className="absolute top-3 left-2 z-50 flex items-center space-x-2 text-lg px-4 font-bold text-black">
        <IconArrowBack
          onClick={() => {
            setShowModal(false);
          }}
          className="cursor-pointer hover:text-red-600"
        />
        <span>Add a Donor</span>
      </h2>

      <MantineReactTable table={table} />
    </div>
  );
};

export default DonorSelect;
