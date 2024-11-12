import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table"; // Import the MantineReactTable
import schoolalotcurrentfromdate from "./Date/FromDate";
import schoolalotcurrenttodate from "./Date/ToDate";
import { Card, Button } from "@material-tailwind/react";
import PageTitle from "../../../components/common/PageTitle";
import toast from "react-hot-toast";
import { IoMdArrowBack } from "react-icons/io";
import { IconBox, IconCheckbox } from "@tabler/icons-react";
import { IconSquare } from "@tabler/icons-react";

const DonorDetails = () => {
  const [schoolToAllot, setSchoolToAllot] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const id = new URL(window.location.href).searchParams.get("id");
  const year = new URL(window.location.href).searchParams.get("year");
  const fyear = new URL(window.location.href).searchParams.get("fyear");
  const [schoolAllot, setSchoolAllot] = useState([]);

  const fromdate = schoolalotcurrentfromdate.toString();
  const todate = schoolalotcurrenttodate.toString();
  const [rowSelection, setRowSelection] = useState({});

  const [userdata, setUserdata] = useState("");

  const [schoolalot, setSchoolalot] = useState({
    indicomp_fts_id: "",
    schoolalot_financial_year: year,
    schoolalot_to_date: todate,
    schoolalot_from_date: fromdate,
    schoolalot_school_id: "",
    rept_fin_year: fyear,
  });

  useEffect(() => {
    axios({
      url: BASE_URL + "/api/fetch-schoolsallotdonor-by-id/" + id,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setUserdata(res.data.SchoolAlotDonor);
    });
  }, []);

  useEffect(() => {
    const fetchApprovedRData = async () => {
      if (schoolalot.schoolalot_financial_year) {
        setLoading(true);
        try {
          const response = await axios.get(
            `${BASE_URL}/api/fetch-school-alloted-list/${year}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const res = response.data?.schools;
          setSchoolAllot(res);
          // if (Array.isArray(res)) {
          //   const tempRows = res.map((item, index) => [
          //     item["school_state"],
          //     item["district"],
          //     item["achal"],
          //     item["cluster"],
          //     item["sub_cluster"],
          //     item["village"],
          //     item["school_code"],
          //     item["status_label"],
          //   ]);
          //   setSchoolToAllot(tempRows);
          // }
        } catch (error) {
          console.error("Error fetching approved list request data", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchApprovedRData();
  }, [isPanelUp, navigate, schoolalot.schoolalot_financial_year]);

  const onSubmit = async (e) => {
    e.preventDefault();
    var schoolIdsSelected = selectedRows.join(",")

    let data = {
      indicomp_fts_id: userdata.indicomp_fts_id,
      schoolalot_financial_year: year,
      schoolalot_to_date: schoolalot.schoolalot_to_date,
      schoolalot_from_date: schoolalot.schoolalot_from_date,
      schoolalot_school_id: schoolIdsSelected,
      rept_fin_year: fyear,
    };

    try {
      await axios.post(`${BASE_URL}/api/create-school-alot`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Data Inserted Successfully");
      navigate("/students-schoolallot");
    } catch (error) {
      console.error("Error submitting data:", error);
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
    { accessorKey: "status_label", header: "Status" },
  ];




  useEffect(() => {
    console.info("row selected breo", { rowSelection });
    const selectedKeys = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    localStorage.setItem("schooltoallot", selectedKeys.join(","));
    setSelectedRows(selectedKeys); 
    
  }, [rowSelection]);

  const table = useMantineReactTable({
    columns,
    data: schoolAllot,
    enableRowSelection: true,
    getRowId: (originalRow) => originalRow.school_code,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
  });

  const InfoField = ({ label, value, icon }) => (
    <div className="relative">
      <label className=" text-sm font-semibold text-black mb-1 flex items-center gap-2">
        {icon && <span className="text-gray-500">{icon}</span>}
        {label}
      </label>
      <div className="w-full px-3 py-2 text-xs border rounded-lg border-green-500 bg-white hover:bg-gray-50 transition-colors">
        {value || "N/A"}
      </div>
    </div>
  );

  return (
    <Layout>
      <PageTitle
        title="Donor Details"
        icon={IoMdArrowBack}
        backLink={"/students-to-allot"}
      />
      <Card>
        <div className="grid grid-cols md:grid-cols-3 gap-4 p-4">
          <InfoField
            label="School Allot Year"
            value={schoolalot.schoolalot_financial_year}
          />
          <InfoField
            label="From Date"
            value={schoolalot.schoolalot_from_date}
          />
          <InfoField label="To Date" value={schoolalot.schoolalot_to_date} />
        </div>
        <div className="mt-5">
          <>
            <MantineReactTable table={table} />
          </>
        </div>
        <div className="mt-5 flex justify-end p-4">
          <Button onClick={onSubmit} color="purple">
            Submit
          </Button>
        </div>
      </Card>
    </Layout>
  );
};

export default DonorDetails;
