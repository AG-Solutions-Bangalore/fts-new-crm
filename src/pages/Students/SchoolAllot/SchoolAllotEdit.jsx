import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { Card, Spinner, Button } from "@material-tailwind/react";
import toast from "react-hot-toast";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import { FormLabel } from "@mui/material";

const SchoolAllotEdit = () => {
  const [schoolToAllot, setSchoolToAllot] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);
  const { isPanelUp } = useContext(ContextPanel);
  const [schoolAllot, setSchoolAllot] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]); // Keep track of selected rows
  const navigate = useNavigate();
  const id = localStorage.getItem("sclaltid");
  const year = localStorage.getItem("sclaltyear");

  const [schoolalot, setSchoolalot] = useState({
    schoolalot_financial_year: "",
    schoolalot_from_date: "",
    schoolalot_to_date: "",
    schoolalot_school_id: "",
    rept_fin_year: "",
  });

  useEffect(() => {
    const fetchYearData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/fetch-year`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSchoolalot((prev) => ({
          ...prev,
          schoolalot_financial_year: response.data.year.current_year,
        }));
      } catch (error) {
        console.error("Error fetching year data:", error);
      }
    };

    fetchYearData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/fetch-schoolsallot-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSchoolalot(response.data.individualCompanys);

        const schoolsResponse = await axios.get(
          `${BASE_URL}/api/fetch-school-alloted-list-by-id/${id}/${year}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const schoolsData = schoolsResponse.data.schools || [];
        setSchoolAllot(schoolsData);

        const defaultSelectedRows = schoolsData.reduce((acc, school, index) => {
          if (schoolalot.schoolalot_school_id?.includes(school.school_code)) {
            acc.push(index);
          }
          return acc;
        }, []);
        setSelectedSchoolIds(defaultSelectedRows);
        setSchoolToAllot(schoolsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, year, isPanelUp, schoolalot.schoolalot_financial_year]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const selectedIds = selectedSchoolIds.join(","); // Get selected school IDs
    const data = {
      donor_related_id: id,
      schoolalot_financial_year: schoolalot.schoolalot_financial_year,
      schoolalot_to_date: schoolalot.schoolalot_to_date,
      schoolalot_from_date: schoolalot.schoolalot_from_date,
      schoolalot_school_id: selectedIds,
      rept_fin_year: schoolalot.rept_fin_year,
    };

    try {
      await axios.put(`${BASE_URL}/api/update-schoolsallot/${id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Data updated successfully");
      navigate("/students-schoolallot");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const columns = [
    { accessorKey: "school_state", header: "State" },
    { accessorKey: "district", header: "District" },
    { accessorKey: "achal", header: "Achal" },
    { accessorKey: "cluster", header: "Cluster" },
    { accessorKey: "sub_cluster", header: "Sub Cluster" },
    { accessorKey: "village", header: "Village" },
    { accessorKey: "school_code", header: "School Code" },
  ];
  const onRowSelectionChange = (rows) => {
    // Get all selected row IDs from the `rows` object
    const selectedIds = Object.keys(rows)
      .filter((key) => rows[key] === true) // Only include selected rows (those with value `true`)
      .map((key) => {
        const rowIndex = parseInt(key, 10); // Convert key to number to get correct index
        return schoolToAllot[rowIndex]?.school_code; // Map to school_code of selected rows
      });

    // Update the selected school IDs state
    setSelectedSchoolIds(selectedIds);
    console.log("Selected School IDs:", selectedIds); // For debugging purposes
  };

  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500 cursor-not-allowed";

  // const table = useMantineReactTable({
  // columns={columns}
  // data={schoolToAllot}
  //   enableRowSelection: (row) => row.original.status_label !== "Allotted", // Disable selection for "Allotted" rows
  //   getRowId: (originalRow) => originalRow.school_code,
  //   onRowSelectionChange: setRowSelection,
  //   enableDensityToggle: false,
  //   enableColumnActions: false,
  //   enableFullScreenToggle: false,
  //   enableHiding: false,
  //   state: { rowSelection },
  //   getRowProps: (row) => ({
  //     style: {
  //       cursor:
  //         row.original.status_label === "Allotted" ? "not-allowed" : "pointer",
  //       backgroundColor:
  //         row.original.status_label === "Allotted" ? "#f0f0f0" : "white",
  //     },
  //   }),
  // });

  //   <MantineReactTable
  //   columns={columns}
  //   data={schoolToAllot}
  //   enableDensityToggle={false}
  //   enableColumnActions={false}
  //   enableFullScreenToggle={false}
  //   enableHiding={false}
  //   state={{
  //     rowSelection: selectedSchoolIds.reduce(
  //       (acc, id) => ({ ...acc, [id]: true }),
  //       {}
  //     ),
  //   }}
  //   onRowSelectionChange={onRowSelectionChange}
  //   enableRowSelection
  //   enableFilters
  // />
  return (
    <Layout>
      <div className="sticky top-0 p-2  mb-4 border-b-2 border-green-500 rounded-lg  bg-[#E1F5FA] ">
        <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
          <div className="flex  items-center gap-2">
            <IconInfoCircle className="w-4 h-4" />
            <span>Donor Details</span>
          </div>
          <IconArrowBack
            onClick={() => navigate("/students-schoolallot")}
            className="cursor-pointer hover:text-red-600"
          />
        </h2>
      </div>
      <hr />
      <Card>
        <div className="grid grid-cols md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          <div>
            <FormLabel required>School Allot Year</FormLabel>
            <input
              name="schoolalot_financial_year"
              value={schoolalot.schoolalot_financial_year}
              className={inputClass}
              required
              disabled
            />
          </div>
          <div>
            <FormLabel required>From Date</FormLabel>
            <input
              type="date"
              name="schoolalot_from_date"
              value={schoolalot.schoolalot_from_date}
              className={inputClass}
              required
              disabled
            />
          </div>
          <div>
            <FormLabel required>To Date</FormLabel>
            <input
              type="date"
              name="schoolalot_to_date"
              value={schoolalot.schoolalot_to_date}
              className={inputClass}
              required
              disabled
            />
          </div>
          <div>
            <FormLabel required>Schools Id</FormLabel>
            <input
              name="indicomp_fts_id"
              value={schoolalot.schoolalot_school_id}
              className={inputClass}
              required
              disabled
            />
          </div>
        </div>
        <div className="mt-5">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="h-12 w-12" color="purple" />
            </div>
          ) : (
            // <MantineReactTable table={table} />
            <h1>test</h1>
          )}
        </div>
        <div className="mt-5 flex justify-end p-4">
          <Button onClick={onSubmit} color="purple">
            Update
          </Button>
        </div>
      </Card>
    </Layout>
  );
};

export default SchoolAllotEdit;
