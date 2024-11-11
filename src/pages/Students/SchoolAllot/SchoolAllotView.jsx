import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";

import MUIDataTable from "mui-datatables";
import { Spinner } from "@material-tailwind/react";
import PageTitle from "../../../components/common/PageTitle";
import { IoMdArrowBack } from "react-icons/io";

const SchoolAllotView = () => {
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
      const id = localStorage.getItem("sclaltid");

      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/fetch-schoolsallotview-by-id/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const res = response.data?.SchoolAlotView;
        if (Array.isArray(res)) {
          const tempRows = res.map((item, index) => [
            index + 1,
            item["school_state"],
            item["district"],
            item["achal"],
            item["cluster"],
            item["sub_cluster"],
            item["village"],
            item["school_code"],
            item["id"],
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
      name: "State",
      label: "State",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "District",
      label: "District",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Achal",
      label: "Achal",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Cluster",
      label: "Cluster",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Sub Cluster",
      label: "Sub Cluster",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Village",
      label: "Village",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "School Code",
      label: "School Code ",
      options: {
        filter: true,
        sort: false,
      },
    },
  ];

  const options = {
    filterType: "textField",
    selectableRows: false,
    elevation: 0,
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
      <PageTitle
        title="Schools Allotments Details"
        icon={IoMdArrowBack}
        backLink={"/students-schoolallot"}
      />
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

export default SchoolAllotView;
