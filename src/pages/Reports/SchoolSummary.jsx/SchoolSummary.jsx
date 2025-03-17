import Layout from "../../../layout/Layout";
import { useState, useEffect } from "react";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import axios from "axios";
import SelectInput from "../../../components/common/SelectInput";
import { useNavigate } from "react-router-dom";
import { SUMMARY_DOWNLOAD, SUMMARY_SOURCE_DROPDOWN } from "../../../api";

function SchoolSummary() {
  const navigate = useNavigate();
  const [individual, setIndividuals] = useState([]);
  const [downloadDonor, setDonorDownload] = useState({
    indicomp_full_name: "",
  });

  // Input change handler for native inputs
  const onInputChange = (e) => {
    console.log(e.target.value);
    const { name, value } = e.target;
    setDonorDownload({
      ...downloadDonor,
      [name]: value,
    });
  };

  const onReportView = (e) => {
    e.preventDefault();
    var v = document.getElementById("dowRecp").checkValidity();
    var v = document.getElementById("dowRecp").reportValidity();
    if (v) {
      localStorage.setItem("schl_sum_viw", downloadDonor.indicomp_full_name);
      navigate("/report/schoolview");
    }
  };

  useEffect(() => {
    var theLoginToken = localStorage.getItem("token");

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };

    fetch(SUMMARY_SOURCE_DROPDOWN, requestOptions)
      .then((response) => response.json())
      .then((data) => setIndividuals(data.schoolallot));
  }, []);
  //DOWNLOAD
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      indicomp_full_name: downloadDonor.indicomp_full_name,
    };
    var v = document.getElementById("dowRecp").checkValidity();
    var v = document.getElementById("dowRecp").reportValidity();

    if (v) {
      axios({
        url: SUMMARY_DOWNLOAD,
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          console.log("data : ", res.data);
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "school_summary.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("School Summary is Downloaded Successfully");
        })
        .catch((err) => {
          toast.error("School Summary is Not Downloaded");
        });
    }
  };

  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500";

  return (
    <Layout>
      <div className="  bg-[#FFFFFF] p-2   rounded-lg">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-green-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row gap-2 items-center  rounded-xl p-2 ">
            {/* <IconInfoCircle className="w-4 h-4" /> */}
            <span>School Summary</span>
          </h2>
        </div>
        <hr />
        <div className="p-4">
          <h3 className="text-red-500 mb-5">
            Please fill all for View report.
          </h3>

          <form id="dowRecp" autoComplete="off">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <SelectInput
                label="Source"
                name="indicomp_full_name"
                value={downloadDonor.indicomp_full_name}
                options={individual.map((item) => ({
                  value: item.id,
                  label: item.indicomp_full_name,
                }))}
                onChange={onInputChange}
                placeholder="Select Donor"
              />
            </div>

            <div className="flex justify-start py-4">
              <button
                className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                onClick={onSubmit}
              >
                {" "}
                Download
              </button>
              <button
                className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
                onClick={onReportView}
              >
                {" "}
                View
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default SchoolSummary;
