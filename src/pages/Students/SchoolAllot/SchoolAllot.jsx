import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { MdConfirmationNumber, MdEdit } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import MUIDataTable from "mui-datatables";
import moment from "moment";
import { Spinner } from "@material-tailwind/react";
import PageTitle from "../../../components/common/PageTitle";
import { FaArrowLeft } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";

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
        if (Array.isArray(res)) {
          const tempRows = res.map((item, index) => [
            index + 1,
            item["indicomp_full_name"],
            item["schoolalot_financial_year"],
            moment(item["schoolalot_from_date"]).format("DD-MM-YYYY"),
            moment(item["schoolalot_to_date"]).format("DD-MM-YYYY"),

            item["receipt_no_of_ots"],

            item["no_of_schools_allotted"],
            item["receipt_no_of_ots"] - item["no_of_schools_allotted"],
            item["id"] + "#" + item["schoolalot_financial_year"],
          ]);
          setSchoolAllot(tempRows);
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
      name: "School Allot Year",
      label: "School Allot Year",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "From Date",
      label: "From Date",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "To Date",
      label: "To Date",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "OTS Received",
      label: "OTS Received",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Schools Allotted",
      label: "Schools Allotted",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Pending",
      label: "Pending ",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: localStorage.getItem("id") == 1 ? "Action" : "",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => {
          const newValue = value.substring(0, value.indexOf("#"));
          const newYear = value.substring(value.indexOf("#") + 1);
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
                  <MdEdit
                    title="edit"
                    className="h-5 w-5 cursor-pointer text-blue-500"
                  />{" "}
                </Link>
              </div>
              <div onClick={handleview}>
                <Link
                  style={{
                    display: localStorage.getItem("id") == 1 ? "" : "none",
                  }}
                >
                  <IoEyeOutline
                    title="view"
                    className="h-5 w-5 cursor-pointer text-blue-500"
                  />{" "}
                </Link>
              </div>
              <div onClick={handleletter}>
                <Link
                  style={{
                    display: localStorage.getItem("id") == 1 ? "" : "none",
                  }}
                >
                  <MdConfirmationNumber
                    title="Allotment"
                    className="h-5 w-5 cursor-pointer text-blue-500"
                  />
                </Link>
              </div>
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
      <PageTitle title="Schools Allotments List" />
      <div className="mt-5">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner className="h-12 w-12" color="purple" />
          </div>
        ) : (
          <MUIDataTable
            data={schoolAllot ? schoolAllot : []}
            columns={columns}
            options={options}
          />
        )}
      </div>
    </Layout>
  );
};

export default SchoolAllot;
