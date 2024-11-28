import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { Card, Button } from "@material-tailwind/react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import { toast } from "react-toastify";
import MUIDataTable from "mui-datatables";

const SchoolAllotEdit = () => {
  const year = localStorage.getItem("sclaltyear");
  const [schoolToAllot, setSchoolToAllot] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);

  const [schoolAllot, setSchoolAllot] = useState([]);
  const navigate = useNavigate();

  // const id = localStorage.getItem("sclaltid");
  const { id } = useParams();

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
        localStorage.setItem(
          "selectedSchoolIds",
          response.data.individualCompanys.schoolalot_school_id
        );

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

        // Retrieve saved selected school IDs from localStorage
        const savedSchoolIds =
          localStorage.getItem("selectedSchoolIds")?.split(",") || [];

        // Map the saved school IDs to the corresponding rows
        const defaultSelectedRows = schoolsData.reduce((acc, school, index) => {
          if (savedSchoolIds.includes(school.school_code)) {
            acc.push(index);
          }
          return acc;
        }, []);

        setSelectedSchoolIds(defaultSelectedRows); // Update state
        setSchoolToAllot(
          schoolsData.map((item) => [
            item.school_state,
            item.district,
            item.achal,
            item.cluster,
            item.sub_cluster,
            item.village,
            item.school_code,
          ])
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, year]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const selectedIds = localStorage.getItem("selectedSchoolIds") || "";
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
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { name: "State", label: "State" },
    { name: "District", label: "District" },
    { name: "Achal", label: "Achal" },
    { name: "Cluster", label: "Cluster" },
    { name: "Sub Cluster", label: "Sub Cluster" },
    { name: "Village", label: "Village" },
    { name: "School Code", label: "School Code" },
  ];

  const options = {
    filterType: "checkbox",
    search: true,
    print: false,
    viewColumns: false,
    download: false,
    selectableRows: true,
    responsive: "standard",
    filter: false,
    rowsSelected: selectedSchoolIds,
    selectToolbarPlacement: "above",
    isRowSelectable: (dataIndex) =>
      schoolAllot[dataIndex]?.status_label !== "Allotted",
    selectableRowsOnClick: true,
    onRowSelectionChange: (currentRowSelected, allRowsSelected) => {
      const tempValue = allRowsSelected.map((row) => row.dataIndex);
      const newIds = tempValue.map((index) => schoolAllot[index]?.school_code);

      const selectedIdsString = newIds.join(",");
      setSelectedSchoolIds(tempValue);
      localStorage.setItem("selectedSchoolIds", selectedIdsString);

      console.log("Selected School IDs (string):", selectedIdsString);
    },
    customToolbarSelect: () => null,
  };

  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500 cursor-not-allowed";

  return (
    <Layout>
      <div className="sticky top-0 p-2 mb-4 border-b-2 border-green-500 rounded-lg bg-[#E1F5FA]">
        <h2 className="px-5 text-[black] text-lg flex flex-row justify-between items-center rounded-xl p-2">
          <div className="flex items-center gap-2">
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
          {/* <MantineReactTable table={table} /> */}
          <MUIDataTable
            title="School List"
            data={schoolToAllot}
            columns={columns}
            options={options}
          />
        </div>
        <div className="mt-5 flex justify-start p-4">
          <button
            onClick={onSubmit}
            disabled={loading}
            className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
          >
            {loading ? "Updating.." : "Update"}
          </button>
        </div>
      </Card>
    </Layout>
  );
};

export default SchoolAllotEdit;
