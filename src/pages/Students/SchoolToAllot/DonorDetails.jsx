import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import MUIDataTable from "mui-datatables";
import toast from "react-hot-toast";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import { FormLabel } from "@mui/material";

const DonorDetails = () => {
  const [schoolToAllot, setSchoolToAllot] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);
  const { isPanelUp } = useContext(ContextPanel);
  const [schoolAllot, setSchoolAllot] = useState([]);
  const navigate = useNavigate();
  const id = localStorage.getItem("idstl");
  const year = localStorage.getItem("yearstl");
  const fyear = localStorage.getItem("fyearstl");
  console.log(year);
  // Get the first and last date
  const [dateschool, setDateschool] = useState({});

  const [schoolalot, setSchoolalot] = useState({
    indicomp_fts_id: "",
    schoolalot_financial_year: year,
    schoolalot_to_date: "",
    schoolalot_from_date: "",
    schoolalot_school_id: "",
    rept_fin_year: fyear,
  });
  console.log("date", schoolalot);
  const [userdata, setUserdata] = useState("");
  const FetchSchool = () => {
    axios({
      url: BASE_URL + "/api/fetch-schoolsallotdonor-by-id/" + id,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      console.log("editdon", res.data);
      setUserdata(res.data.SchoolAlotDonor);
    });
  };

  const FetchDate = () => {
    axios({
      url: `${BASE_URL}/api/fetch-school-allot-year-by-year/${schoolalot.schoolalot_financial_year}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        console.log("editdon", res.data.schoolallotyear);
        setDateschool(res.data.schoolallotyear);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  useEffect(() => {
    FetchSchool();
    FetchDate();
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

          if (Array.isArray(res)) {
            const tempRows = res.map((item, index) => [
              item["school_state"],
              item["district"],
              item["achal"],
              item["cluster"],
              item["sub_cluster"],
              item["village"],
              item["school_code"],
              item["status_label"],
            ]);
            setSchoolToAllot(tempRows);
          }
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
    var schoolIdsSelected = localStorage.getItem("selectedSchoolIds");

    let data = {
      indicomp_fts_id: userdata.indicomp_fts_id,
      schoolalot_financial_year: year,
      schoolalot_to_date: dateschool.school_allot_to,
      schoolalot_from_date: dateschool.school_allot_from,
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
    {
      name: "State",
      label: "State",
    },
    { name: "District", label: "District" },
    { name: "Achal", label: "Achal" },
    { name: "Cluster", label: "Cluster" },
    { name: "Sub Cluster", label: "Sub Cluster" },
    { name: "Village", label: "Village" },
    { name: "School Code", label: "School Code" },
    { name: "Status", label: "Status" },
  ];

  const options = {
    // filterType: "textField",

    filter: true,
    search: true,
    print: false,
    viewColumns: false,
    download: false,
    selectableRows: "multiple",
    selectToolbarPlacement: "above",
    responsive: "standard",
    isRowSelectable: (dataIndex) => {
      return schoolAllot[dataIndex]?.status_label !== "Allotted";
    },
    selectableRowsOnClick: true,
    onRowsSelect: (currentRowSelected, allRowsSelected) => {
      const selectedIds = allRowsSelected
        .map((row) => schoolAllot[row.dataIndex]?.school_code)
        .join(",");

      setSelectedSchoolIds(selectedIds);
      localStorage.setItem("selectedSchoolIds", selectedIds);

      console.log("Selected School IDs (string):", selectedIds);
    },
    customToolbarSelect: () => null,
  };

  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500 cursor-not-allowed";
  return (
    <Layout>
      <div className="  bg-[#FFFFFF] p-2   ">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-green-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Donor Details</span>
            </div>
            <IconArrowBack
              onClick={() => {
                navigate("/students-to-allot");
              }}
              className="cursor-pointer hover:text-red-600"
            />
          </h2>
        </div>
        <hr />
        <div>
          <div className="grid grid-cols md:grid-cols-3 gap-4 p-4">
            <div>
              <FormLabel>
                School Allot Year<span className="text-red-600">*</span>
              </FormLabel>
              <input
                // type="date"
                label="School Allot Year"
                value={schoolalot.schoolalot_financial_year}
                className={inputClass}
                required
                disabled
              />
            </div>
            <div>
              <FormLabel>
                From Date<span className="text-red-600">*</span>
              </FormLabel>
              <input
                type="date"
                value={dateschool.school_allot_from}
                className={inputClass}
                required
                disabled
              />
            </div>
            <div>
              <FormLabel>
                To Date<span className="text-red-600">*</span>
              </FormLabel>
              <input
                type="date"
                value={dateschool.school_allot_to}
                className={inputClass}
                required
                disabled
              />
            </div>
          </div>
          <div className="mt-5">
            <MUIDataTable
              title="School List"
              data={schoolToAllot}
              columns={columns}
              options={options}
            />
          </div>
          <div className="mt-5 flex justify-end p-4">
            <button
              onClick={onSubmit}
              className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DonorDetails;
