import Layout from "../../../layout/Layout";
import Moment from "moment";
import { useState, useEffect } from "react";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import axios from "axios";
import SelectInput from "../../../components/common/SelectInput";
import { DOWNLOAD_RECEIPT, DOWNLOAD_RECEIPT_DROPDOWN_DATASOURCE } from "../../../api";

function DowloadRecpit() {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const exemption = [
    {
      value: "80G",
      label: "80G",
    },
    {
      value: "Non 80G",
      label: "Non 80G",
    },
    {
      value: "FCRA",
      label: "FCRA",
    },
  ];

  const donation_type = [
    {
      value: "One Teacher School",
      label: "One Teacher School",
    },
    {
      value: "General",
      label: "General",
    },
    {
      value: "Membership",
      label: "Membership",
    },
  ];

  // Get the first and last date
  const todayback = Moment().format("YYYY-MM-DD");
  const firstdate = Moment().startOf("month").format("YYYY-MM-DD");

  const [receiptsdwn, setReceiptDownload] = useState({
    receipt_from_date: firstdate,
    receipt_to_date: todayback,
    receipt_donation_type: "",
    receipt_exemption_type: "",
    indicomp_source: "",
  });

  // Input change handler for native inputs
  const onInputChange = (e) => {
    console.log(e.target.value);
    const { name, value } = e.target;
    setReceiptDownload({
      ...receiptsdwn,
      [name]: value,
    });
  };

  const onInputChange1 = (e) => {
    const { name, value } = e.target;

    console.log(value);
    setReceiptDownload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Submit handler for download
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      receipt_from_date: receiptsdwn.receipt_from_date,
      receipt_to_date: receiptsdwn.receipt_to_date,
      receipt_donation_type: receiptsdwn.receipt_donation_type,
      receipt_exemption_type: receiptsdwn.receipt_exemption_type,
      indicomp_source: receiptsdwn.indicomp_source,
    };

    if (document.getElementById("dowRecp").reportValidity()) {
      setIsButtonDisabled(true);

      axios({
        url: DOWNLOAD_RECEIPT,
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "receipt_list.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Receipt is Downloaded Successfully");
          setReceiptDownload({
            receipt_from_date: firstdate,
            receipt_to_date: todayback,
            receipt_donation_type: "",
            receipt_exemption_type: "",
            indicomp_source: "",
          });
        })
        .catch((err) => {
          toast.error("Receipt is Not Downloaded");
          console.error("Download error:", err.response);
        })
        .finally(() => {
          setIsButtonDisabled(false);
        });
    }
  };

  // Fetch item data
  const [datasource, setDatasource] = useState([]);
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    fetch(DOWNLOAD_RECEIPT_DROPDOWN_DATASOURCE, requestOptions)
      .then((response) => response.json())
      .then((data) => setDatasource(data.datasource));
  }, []);

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
            <span>Download Receipts</span>
          </h2>
        </div>
        <hr />
        <div className="p-4">
          <h3 className="text-red-500 mb-5">
            Leave blank if you want all records.
          </h3>

          <form id="dowRecp" autoComplete="off">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <FormLabel required>From Date</FormLabel>
                <input
                  type="date"
                  name="receipt_from_date"
                  value={receiptsdwn.receipt_from_date}
                  onChange={onInputChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <FormLabel required>To Date</FormLabel>
                <input
                  type="date"
                  name="receipt_to_date"
                  value={receiptsdwn.receipt_to_date}
                  onChange={onInputChange}
                  className={inputClass}
                  required
                />
              </div>

              <SelectInput
                label="Purpose"
                name="receipt_donation_type"
                value={receiptsdwn.receipt_donation_type}
                options={donation_type}
                onChange={onInputChange}
                placeholder="Select Purpose"
              />
              <SelectInput
                label="Category"
                name="receipt_exemption_type"
                value={receiptsdwn.receipt_exemption_type}
                options={exemption}
                onChange={onInputChange}
                placeholder="Select Category"
              />
              <SelectInput
                label="Source"
                name="indicomp_source"
                value={receiptsdwn.indicomp_source}
                options={datasource.map((item) => ({
                  value: item.data_source_type,
                  label: item.data_source_type,
                }))}
                onChange={onInputChange}
                placeholder="Select Source"
              />
            </div>

            <div className="flex justify-start py-4">
              <button
                className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md mr-2"
                onClick={onSubmit}
                disabled={isButtonDisabled}
              >
                {" "}
                {isButtonDisabled ? "Downloading..." : "Download"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default DowloadRecpit;
