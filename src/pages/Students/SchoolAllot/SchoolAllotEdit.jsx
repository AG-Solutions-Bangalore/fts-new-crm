import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import MUIDataTable from "mui-datatables";
import { Card, Input, Spinner, Button } from "@material-tailwind/react";
import PageTitle from "../../../components/common/PageTitle";
import toast from "react-hot-toast";
import { IoMdArrowBack } from "react-icons/io";

const SchoolAllotEdit = () => {
  const [schoolToAllot, setSchoolToAllot] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);
  const { isPanelUp } = useContext(ContextPanel);
  const [schoolAllot, setSchoolAllot] = useState([]);
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

        // Set initial selected rows based on schoolalot_school_id
        const defaultSelectedRows = schoolsData.reduce((acc, school, index) => {
          if (schoolalot.schoolalot_school_id?.includes(school.school_code)) {
            acc.push(index);
          }
          return acc;
        }, []);
        setSelectedSchoolIds(defaultSelectedRows);
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
  }, [id, year, isPanelUp, schoolalot.schoolalot_financial_year]);

  const onSubmit = async (e) => {
    e.preventDefault();

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
    filter: true,
    search: true,
    print: false,
    viewColumns: false,
    download: false,
    selectableRows: true,
    responsive: "standard",
    rowsSelected: selectedSchoolIds,
    // selectableRows: "multiple",
    selectToolbarPlacement: "above",
    isRowSelectable: (dataIndex) =>
      schoolAllot[dataIndex]?.status_label !== "Allotted",
    selectableRowsOnClick: true,
    onRowSelectionChange: (currentRowSelected, allRowsSelected) => {
      const tempValue = allRowsSelected.map((row) => row.dataIndex);
      const newIds = tempValue.map((index) => schoolAllot[index]?.school_code);

      // Convert array to a comma-separated string and store in localStorage
      const selectedIdsString = newIds.join(",");
      setSelectedSchoolIds(tempValue); // to trigger UI selection
      localStorage.setItem("selectedSchoolIds", selectedIdsString);

      console.log("Selected School IDs (string):", selectedIdsString);
    },
    customToolbarSelect: () => null,
  };

  return (
    <Layout>
      <PageTitle
        title="Donor Details"
        icon={IoMdArrowBack}
        backLink={"/students-schoolallot"}
      />
      <Card>
        <div className="grid grid-cols md:grid-cols-3 gap-4 p-4">
          <Input
            label="School Allot Year"
            name="schoolalot_financial_year"
            value={schoolalot.schoolalot_financial_year}
            disabled
            labelProps={{
              className: "!text-gray-500",
            }}
          />
          <Input
            label="From Date"
            name="schoolalot_from_date"
            type="date"
            disabled
            value={schoolalot.schoolalot_from_date}
            labelProps={{
              className: "!text-gray-500",
            }}
          />
          <Input
            label="To Date"
            name="schoolalot_to_date"
            type="date"
            disabled
            value={schoolalot.schoolalot_to_date}
            labelProps={{
              className: "!text-gray-500",
            }}
          />
          <Input
            label="Schools Id"
            name="indicomp_fts_id"
            disabled
            value={schoolalot.schoolalot_school_id}
            labelProps={{
              className: "!text-gray-500",
            }}
          />
        </div>
        <div className="mt-5">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="h-12 w-12" color="purple" />
            </div>
          ) : (
            <MUIDataTable
              data={schoolToAllot}
              columns={columns}
              options={options}
            />
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
