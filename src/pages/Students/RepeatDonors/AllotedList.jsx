import React, { useContext, useEffect, useMemo, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";

import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconEdit } from "@tabler/icons-react";
import { toast } from "react-toastify";

const AllotedList = () => {
  const [schoolAllot, setSchoolAllot] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp ,currentYear} = useContext(ContextPanel);
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  


  // Fetch school allotment data
  const fetchSchoolAllotData = async () => {
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/fetch-school-allot-repeat/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchoolAllot(response.data?.schoolAllot || []);
    } catch (error) {
      console.error("Error fetching school allot data:", error);
    } finally {
      setLoading(false);
    }
  };
  const updateNext = async (e, allotId) => {
    e.preventDefault();
    console.log("current year",currentYear)
    if (!currentYear) {
      toast.error("Current year is required for updating.");
      return;
    }
    try {
      const response = await axios.put(
        `${BASE_URL}/api/update-schoolsallot-repeat/${allotId}`,
        { schoolalot_financial_year: currentYear },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Donor allotment updated successfully.");
      navigate("/home");
    } catch (error) {
      console.error("Error updating allotment:", error);
    }
  };

  useEffect(() => {
    fetchSchoolAllotData();
  }, [id]);
 
  const columns = useMemo(() => [
    { accessorKey: "indicomp_full_name", header: "Donor Name", size: 50 },
    { accessorKey: "schoolalot_year", header: "School Allot Year", size: 50 },
    { accessorKey: "schoolalot_from_date", header: "From Date", size: 50 },
    { accessorKey: "schoolalot_to_date", header: "To Date", size: 50 },
    { accessorKey: "receipt_no_of_ots", header: "OTS Received", size: 50 },
    { accessorKey: "no_of_schools_allotted", header: "Schools Allotted", size: 50 },
    {
      accessorKey: "pending",
      header: "Pending",
      size: 50,
      Cell: ({ row }) => row.original.receipt_no_of_ots - row.original.no_of_schools_allotted,
    },
    {
      id: "id",
      header: userId === "1" ? "Action" : "",
      size: 50,
      Cell: ({ row }) => (
        userId === "1" && (
          <IconEdit
            className="h-5 w-5 text-blue-500 cursor-pointer"
            title="Update Next"
            onClick={(e) => updateNext(e, row.original.id)}
          />
        )
      ),
    },
  ], [currentYear, userId]);

  const table = useMantineReactTable({
    columns,
    data: schoolAllot || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    mantineTableContainerProps: { sx: { maxHeight: "400px" } },
  });


  return (
    <Layout>
    
      <div className="max-w-screen">
          <div className=" flex justify-between gap-2 bg-white p-4 mb-4 rounded-lg shadow-md">
            <h1 className="border-b-2  font-[400] border-dashed border-orange-800">
            Schools Allotted List(Repeat Donor)
            </h1>
           
          </div>
          <div className=" shadow-md">
            <MantineReactTable table={table} />
          </div>
        </div>
    </Layout>
  );
};

export default AllotedList;
