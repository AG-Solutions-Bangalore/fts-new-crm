import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { MdConfirmationNumber } from "react-icons/md";
import moment from "moment";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconEdit, IconEye } from "@tabler/icons-react";
import { Tooltip } from "@mui/material";
const SchoolAllot = () => {
  const [schoolAllot, setSchoolAllot] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchApprovedRData = async () => {
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(`${BASE_URL}/api/fetch-school-allot`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = response.data?.schoolAllot;

      setSchoolAllot(res);
    } catch (error) {
      console.error("Error fetching approved list request data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (token) {
      fetchApprovedRData();
    }
  }, []);

  const columns = [
    { accessorKey: "indicomp_full_name", header: "Donor Name", size: 50 },
    {
      accessorKey: "schoolalot_financial_year",
      header: "School Allot Year",
      size: 50,
    },
    {
      accessorKey: "schoolalot_from_date",
      header: "From Date",
      size: 50,
      Cell: ({ row }) => {
        const formattedDate = moment(row.original.schoolalot_from_date).format(
          "DD-MM-YYYY"
        );
        return <span>{formattedDate}</span>;
      },
    },
    {
      accessorKey: "schoolalot_to_date",
      header: "To Date",
      size: 50,
      Cell: ({ row }) => {
        const formattedDate = moment(row.original.schoolalot_to_date).format(
          "DD-MM-YYYY"
        );
        return <span>{formattedDate}</span>;
      },
    },
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
      Cell: ({ row }) => {
        const pending =
          row.original.receipt_no_of_ots - row.original.no_of_schools_allotted;
        return <span>{pending}</span>;
      },
    },
    ...(localStorage.getItem("id") == 1
      ? [
          {
            enableColumnFilter: false,

            accessorKey: "Action",
            header: "Action",
            size: 50,
            Cell: ({ row }) => {
              const newValue = row.original.id;

              const newYear = row.original.schoolalot_financial_year;

              const handleedit = () => {
                // navigate("/students-allotedit");
                // console.log("this");
                navigate(`/students-allotedit/${newValue}`);
                // localStorage.setItem("sclaltid", newValue);
                localStorage.setItem("sclaltyear", newYear);
              };

              const handleview = () => {
                navigate("/students-allotview");
                localStorage.setItem("sclaltid", newValue);
              };

              const handleletter = () => {
                navigate("/students-allotletter");
                localStorage.setItem("sclaltid", newValue);
              };
              return (
                <div className="flex flex-row gap-1">
                  <div onClick={handleedit}>
                    <div
                      style={{
                        display: localStorage.getItem("id") == 1 ? "" : "none",
                      }}
                    >
                      <Tooltip title="Edit" arrow>
                        <IconEdit className="h-5 w-5 cursor-pointer text-blue-500" />
                      </Tooltip>
                    </div>
                  </div>
                  <div onClick={handleview}>
                    <Link
                      style={{
                        display: localStorage.getItem("id") == 1 ? "" : "none",
                      }}
                    >
                      <Tooltip title="View" arrow>
                        <IconEye className="h-5 w-5 cursor-pointer text-blue-500" />
                      </Tooltip>
                    </Link>
                  </div>
                  <div onClick={handleletter}>
                    <Link
                      style={{
                        display: localStorage.getItem("id") == 1 ? "" : "none",
                      }}
                    >
                      <Tooltip title="Allotment" arrow>
                        <MdConfirmationNumber className="h-5 w-5 cursor-pointer text-blue-500" />
                      </Tooltip>
                    </Link>
                  </div>
                </div>
              );
            },
          },
        ]
      : []),
  ];

  const table = useMantineReactTable({
    columns,
    data: schoolAllot,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableFullScreenToggle: false,
    enableHiding: false,
  });
  return (
    <Layout>
      <div className=" flex justify-between gap-2 bg-white p-4 mb-4 rounded-lg shadow-md">
        <h1 className="border-b-2  font-[400] border-dashed border-orange-800">
          Schools Allotments List
        </h1>
      </div>
      <div className="mt-5">
        <MantineReactTable table={table} />
      </div>
    </Layout>
  );
};

export default SchoolAllot;
