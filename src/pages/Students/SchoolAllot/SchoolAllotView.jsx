import React, { useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import Layout from "../../../layout/Layout";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { ContextPanel } from "../../../utils/ContextPanel";
import BASE_URL from "../../../base/BaseUrl";
import { IconArrowBack } from "@tabler/icons-react";

const SchoolAllotView = () => {
  const [schoolAllot, setSchoolAllot] = useState([]);
  const navigate = useNavigate();
  const id = localStorage.getItem("sclaltid");
  useEffect(() => {
    const fetchApprovedRData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/fetch-schoolsallotview-by-id/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSchoolAllot(response.data?.SchoolAlotView);
      } catch (error) {
        console.error("Error fetching approved list request data", error);
      }
    };

    fetchApprovedRData();
  }, []);

  const columns = [
    { accessorKey: "school_state", header: "State", size: 50 },
    { accessorKey: "district", header: "District", size: 50 },
    { accessorKey: "achal", header: "Achal", size: 50 },
    { accessorKey: "cluster", header: "Cluster", size: 50 },
    { accessorKey: "sub_cluster", header: "Sub Cluster", size: 50 },
    { accessorKey: "village", header: "Village", size: 50 },
    { accessorKey: "school_code", header: "School Code", size: 50 },
  ];

  const table = useMantineReactTable({
    columns,
    data: schoolAllot || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    mantineTableContainerProps: { sx: { maxHeight: "400px" } },
    enableHiding: false,
    initialState: { columnVisibility: { address: false } },
  });

  return (
    <Layout>
      <div className="max-w-screen">
        <div className="relative">
          <h2 className="absolute top-3 left-2 z-50 text-lg px-4 font-bold text-black flex items-center">
            <IconArrowBack
              onClick={() => navigate("/students-schoolallot")}
              className="cursor-pointer hover:text-red-600 mr-2"
            />
            Schools Allotments Details
          </h2>

          <MantineReactTable table={table} />
        </div>
      </div>
    </Layout>
  );
};

export default SchoolAllotView;
