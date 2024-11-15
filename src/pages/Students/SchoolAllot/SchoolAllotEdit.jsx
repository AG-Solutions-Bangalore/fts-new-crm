import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { Card, Input, Spinner, Button } from "@material-tailwind/react";
import PageTitle from "../../../components/common/PageTitle";
import toast from "react-hot-toast";
import { IoMdArrowBack } from "react-icons/io";
import { MantineReactTable } from "mantine-react-table";

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

        // Sync initial selected schools with the school allotment data
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
    { accessorKey: "school_state", header: "State" },
    { accessorKey: "district", header: "District" },
    { accessorKey: "achal", header: "Achal" },
    { accessorKey: "cluster", header: "Cluster" },
    { accessorKey: "sub_cluster", header: "Sub Cluster" },
    { accessorKey: "village", header: "Village" },
    { accessorKey: "school_code", header: "School Code" },
  ];

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
            <MantineReactTable
              columns={columns}
              data={schoolToAllot}
              enableDensityToggle={false}
              enableColumnActions={false}
              enableFullScreenToggle={false}
              enableHiding={false}
              state={{
                rowSelection: selectedSchoolIds.reduce(
                  (acc, id) => ({ ...acc, [id]: true }),
                  {}
                ),
              }}
              onRowSelectionChange={(newRowSelection) => {
                const selectedIds = Object.keys(newRowSelection).filter(
                  (key) => newRowSelection[key]
                ); 

                setSelectedSchoolIds(selectedIds);
                localStorage.setItem(
                  "selectedSchoolIds",
                  selectedIds.join(",")
                );

                console.log("Selected School IDs:", selectedIds);
              }}
              enableRowSelection
              enableFilters
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
