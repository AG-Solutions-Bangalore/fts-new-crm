import React, { useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import Layout from "../../../layout/Layout";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { ContextPanel } from "../../../utils/ContextPanel";
import BASE_URL from "../../../base/BaseUrl";

const SchoolAllotView = () => {
  const [schoolAllot, setSchoolAllot] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const id = localStorage.getItem("sclaltid");
  useEffect(() => {
    const fetchApprovedRData = async () => {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }
      

      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/fetch-schoolsallotview-by-id/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSchoolAllot(response.data?.SchoolAlotView)
        
      } catch (error) {
        console.error("Error fetching approved list request data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedRData();
  }, []);


  const columns = [
    { accessorKey: "school_state", header: "State",size:50, },
    { accessorKey: "district", header: "District",size:50, },
    { accessorKey: "achal", header: "Achal",size:50, },
    { accessorKey: "cluster", header: "Cluster",size:50, },
    { accessorKey: "sub_cluster", header: "Sub Cluster",size:50, },
    { accessorKey: "village", header: "Village",size:50, },
    { accessorKey: "school_code", header: "School Code",size:50, },
  ];

  const table = useMantineReactTable({
    columns,
    data: schoolAllot || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableStickyHeader:true,
    enableStickyFooter:true,
    mantineTableContainerProps: { sx: { maxHeight: '400px' } },

    initialState:{ columnVisibility: { address: false } },
    
  });

 

  return (
    <Layout>
      <div className="max-w-screen">
      <div className=" flex justify-between gap-2 bg-white p-4 mb-4 rounded-lg shadow-md">
            <h1 className="border-b-2  font-[400] border-dashed border-orange-800">
            Schools Allotments Details
            </h1>
          
          </div>
          <div className=" shadow-md">
            <MantineReactTable table={table} />
          </div>
      </div>
    
    </Layout>
  );
};

export default SchoolAllotView;
