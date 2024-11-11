import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { MdConfirmationNumber, MdEdit } from "react-icons/md";
import MUIDataTable from "mui-datatables";
import { Spinner } from "@material-tailwind/react";
import PageTitle from "../../../components/common/PageTitle";

const RepeatDonors = () => {
  const [schoolToAllot, setSchoolToAllot] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const [check, setCheck] = useState(false);
  //fetchyear
  const [currentYear, setCurrentYear] = useState("");

  useEffect(() => {
    const fetchYearData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/fetch-year`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setCurrentYear(response.data.year.current_year);
        console.log("Current Year:", response.data.year.current_year);
      } catch (error) {
        console.error("Error fetching year data:", error);
      }
    };

    fetchYearData();
  }, []);

  useEffect(() => {
    const fetchApprovedRData = async () => {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }

      setLoading(true);
      if (currentYear) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${BASE_URL}/api/fetch-receipt-duplicate/${currentYear}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const res = response.data?.receipts;
          if (Array.isArray(res)) {
            const tempRows = res.map((item, index) => [
              index + 1,
              item["individual_company"]["indicomp_full_name"],
              item["individual_company"]["indicomp_type"],
              item["individual_company"]["indicomp_mobile_phone"],
              item["individual_company"]["indicomp_email"],
              item["individual_company"]["indicomp_fts_id"],
            ]);
            setSchoolToAllot(tempRows);
          }
        } catch (error) {
          console.error("Error fetching approved list request data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.warn("Current year is not set, skipping fetchApprovedRData");
        setLoading(false);
      }
    };

    fetchApprovedRData();
  }, [isPanelUp, navigate, currentYear]);

  const columns = [
    {
      name: "#",
      label: "#",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "Donor Name",
      label: "Donor Name",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Type",
      label: "Type",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Mobile",
      label: "Mobile",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Email",
      label: "Email",
      options: {
        filter: true,
        sort: false,
      },
    },

    {
      name: localStorage.getItem("id") == 1 ? "Alloted List" : "",

      options: {
        filter: false,
        sort: false,
        customBodyRender: (id) => {
          const handleedit = () => {
            navigate("/students/report-donor-allotlist");
            localStorage.setItem("ralr", id);
          };
          return (
            <div className="flex items-center space-x-2">
              <Link
                style={{
                  display: localStorage.getItem("id") == 1 ? "" : "none",
                }}
              >
                <MdConfirmationNumber
                  title="Alloted List"
                  className="h-5 w-5 cursor-pointer text-blue-500"
                />
              </Link>
            </div>
          );
        },
      },
    },
  ];

  const options = {
    selectableRows: "none",
    elevation: 0,
    filterType: "textField",
    selectableRows: false,
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    setRowProps: (rowData) => {
      return {
        style: {
          borderBottom: "10px solid #f1f7f9",
        },
      };
    },
  };

  return (
    <Layout>
      <PageTitle title="Repeat Donors" />
      <div className="mt-5">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner className="h-12 w-12" color="purple" />
          </div>
        ) : (
          <MUIDataTable
            title="Repeat School To Allot"
            data={schoolToAllot ? schoolToAllot : []}
            columns={columns}
            options={options}
          />
        )}
      </div>
    </Layout>
  );
};

export default RepeatDonors;
