import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { MdConfirmationNumber, MdEdit } from "react-icons/md";
import moment from "moment";
import { Spinner } from "@material-tailwind/react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconEdit, IconEye } from "@tabler/icons-react";
import { Tooltip } from "@mui/material";
const SchoolAllot = () => {
  const [schoolAllot, setSchoolAllot] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApprovedRData = async () => {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }

      setLoading(true);

      try {
        const token = localStorage.getItem("token");
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

    fetchApprovedRData();
  }, [isPanelUp, navigate]);

  const columns = [
    { accessorKey: "indicomp_full_name", header: "Donor Name" },
    { accessorKey: "schoolalot_financial_year", header: "School Allot Year" },
    {
      accessorKey: "schoolalot_from_date",
      header: "From Date",
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
      Cell: ({ row }) => {
        const formattedDate = moment(row.original.schoolalot_to_date).format(
          "DD-MM-YYYY"
        );
        return <span>{formattedDate}</span>;
      },
    },
    { accessorKey: "receipt_no_of_ots", header: "OTS Received" },
    { accessorKey: "no_of_schools_allotted", header: "Schools Allotted" },
    {
      accessorKey: "pending",
      header: "Pending",
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
            Cell: ({ row }) => {
              const newValue = row.original.id;

              const newYear = row.original.schoolalot_financial_year.substring(
                row.original.schoolalot_financial_year.indexOf("#") + 1
              );
              const handleedit = () => {
                navigate("/students-allotedit");
                console.log("this");
                localStorage.setItem("sclaltid", newValue);
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
                <div>
                  <div onClick={handleedit}>
                    <Link
                      style={{
                        display: localStorage.getItem("id") == 1 ? "" : "none",
                      }}
                    >
                      <Tooltip title="Edit" arrow>
                        <IconEdit className="h-5 w-5 cursor-pointer text-blue-500" />
                      </Tooltip>
                    </Link>
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
      <div className="flex  bg-white p-4 mb-4 rounded-lg shadow-md">
        <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-xl md:text-2xl sm:text-sm text-center md:text-left">
          Schools Allotments List
        </h1>
      </div>
      <div className="mt-5">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : (
          <MantineReactTable table={table} />
        )}
      </div>
    </Layout>
  );
};

export default SchoolAllot;
