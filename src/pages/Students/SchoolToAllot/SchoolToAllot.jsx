import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { MdConfirmationNumber } from "react-icons/md";
import { Spinner } from "@material-tailwind/react";
import PageTitle from "../../../components/common/PageTitle";
import { MantineReactTable } from "mantine-react-table";

const SchoolToAllot = () => {
  const [schoolToAllot, setSchoolToAllot] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApprovedRData = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/fetch-ots`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const res = response.data?.schoolots;
        if (Array.isArray(res)) {
          const tempRows = res.map((item, index) => ({
            donorName: item["individual_company"]["indicomp_full_name"],
            type: item["individual_company"]["indicomp_type"],
            mobile: item["individual_company"]["indicomp_mobile_phone"],
            email: item["individual_company"]["indicomp_email"],
            allotmentYear: item["schoolalot_year"],
            otsReceived: item["receipt_no_of_ots"] + " Schools",
            allotmentAction:
              item["individual_company"]["indicomp_status"] +
              "#" +
              item["individual_company"]["id"] +
              "&" +
              item["schoolalot_year"] +
              "$" +
              item["receipt_financial_year"],
          }));
          console.log(tempRows);
          setSchoolToAllot(tempRows);
        }
      } catch (error) {
        console.error("Error fetching approved list request data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedRData();
  }, [isPanelUp, navigate]);

  const columns = [
    {
      header: "#",
      Cell: ({ row }) => <span>{row.index + 1}</span>, // Show the row index here
    },
    { accessorKey: "donorName", header: "Donor Name" },
    { accessorKey: "type", header: "Type" },
    { accessorKey: "mobile", header: "Mobile" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "allotmentYear", header: "Allotment Year" },
    { accessorKey: "otsReceived", header: "OTS Received" },
    ...(localStorage.getItem("id") == 1
      ? [
          {
            accessorKey: "allotmentAction",
            header: "Allotment",
            Cell: ({ row }) => {
              const value = row.getValue("allotmentAction");
              const newValue = value.substring(
                value.indexOf("#") + 1,
                value.lastIndexOf("&")
              );
              const newYear = value.substring(
                value.indexOf("&") + 1,
                value.lastIndexOf("$")
              );
              const fYear = value.substring(value.indexOf("$") + 1);

              return (
                <div>
                  {value.startsWith("1") && (
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/students-addschoolalot?id=${newValue}&year=${newYear}&fyear=${fYear}`}
                      >
                        <MdConfirmationNumber
                          title="Allotment"
                          className="h-5 w-5 cursor-pointer text-blue-500"
                        />
                      </Link>
                    </div>
                  )}

                  {value.startsWith("0") && (
                    <div className="flex items-center space-x-2">
                      <Link>
                        <MdConfirmationNumber
                          title="Current Year"
                          className="h-5 w-5 cursor-pointer text-blue-500"
                        />
                      </Link>
                    </div>
                  )}
                </div>
              );
            },
          },
        ]
      : []),
  ];

  return (
    <Layout>
      <div className="flex  bg-white p-4 mb-4 rounded-lg shadow-md">
        <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-xl md:text-2xl sm:text-sm text-center md:text-left">
          School To Allot
        </h1>
      </div>
      <div className="mt-5">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : (
          <div className="w-full">
            <MantineReactTable
              columns={columns}
              data={schoolToAllot}
              enableDensityToggle={false}
              enableColumnActions={false}
              enableFullScreenToggle={false}
              initialState={{
                columnVisibility: { index: false },
              }}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SchoolToAllot;
