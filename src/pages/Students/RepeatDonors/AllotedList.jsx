import React, { useContext, useEffect, useMemo, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";

import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconArrowBack, IconEdit } from "@tabler/icons-react";
import { toast } from "react-toastify";
import { decryptId } from "../../../utils/encyrption/Encyrption";
import { fetchRepeatDonorEditList, REAPEAT_DONOR_Edit_UPDATE_NEXT } from "../../../api";

const AllotedList = () => {
  const [schoolAllot, setSchoolAllot] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentYear = localStorage.getItem("currentYear")
  const navigate = useNavigate();
  const { id } = useParams();
  // const decryptedId = decryptId(id);

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  // Fetch school allotment data
  // const fetchSchoolAllotData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       `${BASE_URL}/api/fetch-school-allot-repeat/${decryptedId}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     setSchoolAllot(response.data?.schoolAllot || []);
  //   } catch (error) {
  //     console.error("Error fetching school allot data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
   useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await fetchRepeatDonorEditList(id);
          setSchoolAllot(data?.schoolAllot || []);
        } catch (error) {
          toast.error("Failed to fetch school allot details");
        }
      };
      
      fetchData();
    }, [id]);
  const updateNext = async (e, allotId) => {
    e.preventDefault();
    // console.log("current year", currentYear);
    if (!currentYear) {
      toast.error("Current year is required for updating.");
      return;
    }
    try {
      const res = await axios.put(
        `${REAPEAT_DONOR_Edit_UPDATE_NEXT}/${allotId}`,
        { schoolalot_financial_year: currentYear },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.code === 200) {
        toast.success(res.data.msg);
        toast.success("Donor allotment updated successfully.");
        navigate("/home");
      } else if (res.data.code === 400) {
        toast.error(res.data.msg);
      } else {
        toast.error("Unexcepted Error");
      }
    } catch (error) {
      console.error("Error updating allotment:", error);
    }
  };

 
  const columns = useMemo(
    () => [
      { accessorKey: "indicomp_full_name", header: "Donor Name", size: 50 },
      { accessorKey: "schoolalot_year", header: "School Allot Year", size: 50 },
      { accessorKey: "schoolalot_from_date", header: "From Date", size: 50 },
      { accessorKey: "schoolalot_to_date", header: "To Date", size: 50 },
      { accessorKey: "receipt_no_of_ots", header: "OTS Received", size: 50 },
      {
        accessorKey: "no_of_schools_allotted",
        header: "Schools Allotted",
        size: 50,
      },
      {
        accessorKey: "pending",
        header: "Pending",
        size: 50,
        Cell: ({ row }) =>
          row.original.receipt_no_of_ots - row.original.no_of_schools_allotted,
      },
      {
        id: "id",
        header: userId === "1" ? "Action" : "",
        size: 50,
        Cell: ({ row }) =>
          userId === "1" && (
            <IconEdit
              className="h-5 w-5 text-blue-500 cursor-pointer"
              title="Update Next"
              onClick={(e) => updateNext(e, row.original.id)}
            />
          ),
      },
    ],
    [currentYear, userId]
  );

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
        <div className="relative">
          <h2 className="absolute top-3 left-2 z-50 text-lg px-4 font-bold text-black flex items-center">
            <IconArrowBack
              onClick={() => navigate("/students-report-donor")}
              className="cursor-pointer hover:text-red-600 mr-2"
            />
            Schools Allotted List(Repeat Donor)
          </h2>
          <MantineReactTable table={table} />
        </div>
      </div>
    </Layout>
  );
};

export default AllotedList;
