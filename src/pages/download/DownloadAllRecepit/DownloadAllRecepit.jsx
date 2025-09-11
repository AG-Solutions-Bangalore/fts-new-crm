import Layout from "../../../layout/Layout";
import Moment from "moment";
import { useState, useEffect } from "react";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import axios from "axios";
import SelectInput from "../../../components/common/SelectInput";
import { DOWNLOAD_ALL_RECEIPT, DOWNLOAD_DROPDOWN_CHAPTER, DOWNLOAD_DROPDOWN_DATASOURCE, DOWNLOAD_DROPDOWN_PROMOTER } from "../../../api";

function DowloadAllRecepit() {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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
  const ots_range_from = [
    {
      value: "0",
      label: "All",
    },
    {
      value: "1",
      label: "1",
    },
    {
      value: "6",
      label: "6",
    },
    {
      value: "12",
      label: "12",
    },
    {
      value: "22",
      label: "22",
    },
    {
      value: "32",
      label: "32",
    },
    {
      value: "42",
      label: "42",
    },
    {
      value: "52",
      label: "52",
    },
    {
      value: "62",
      label: "62",
    },
    {
      value: "72",
      label: "72",
    },
    {
      value: "82",
      label: "82",
    },
  ];

  const ots_range_to = [
    {
      value: "5000",
      label: "All",
    },
    {
      value: "5",
      label: "5",
    },
    {
      value: "11",
      label: "11",
    },
    {
      value: "21",
      label: "21",
    },
    {
      value: "31",
      label: "31",
    },
    {
      value: "41",
      label: "41",
    },
    {
      value: "51",
      label: "51",
    },
    {
      value: "61",
      label: "61",
    },
    {
      value: "71",
      label: "71",
    },
    {
      value: "81",
      label: "81",
    },
    {
      value: "50001",
      label: "50001",
    },
  ];

  const amount_range = [
    {
      value: "0-100000000",
      label: "All",
    },
    {
      value: "1-10000",
      label: "1-10000",
    },
    {
      value: "10001-20000",
      label: "10000-20000",
    },
    {
      value: "20001-30000",
      label: "20001-30000",
    },
    {
      value: "30001-50000",
      label: "30001-50000",
    },
    {
      value: "50001-100000",
      label: "50001-100000",
    },
    {
      value: "100001-100000000",
      label: "100001-Above",
    },
  ];

  const donor_type = [
    {
      value: "Member",
      label: "Member",
    },
    {
      value: "Donor",
      label: "Donor",
    },
    {
      value: "Member+Donor",
      label: "Member+Donor",
    },
    {
      value: "None",
      label: "None",
    },
  ];

  // Get the first and last date
  const todayback = Moment().format("YYYY-MM-DD");
  const firstdate = Moment().startOf("month").format("YYYY-MM-DD");

  const [receiptsdwn, setAllReceiptDownload] = useState({
    receipt_from_date: firstdate,
    receipt_to_date: todayback,
    receipt_donation_type: "",
    receipt_exemption_type: "",
    receipt_amount_range: "0-100000000",
    receipt_ots_range_from: "0",
    receipt_ots_range_to: "5000",
    indicomp_donor_type: "",
    indicomp_promoter: "",
    chapter_id: "",
    indicomp_source: "",
  });

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setAllReceiptDownload({
      ...receiptsdwn,
      [name]: value,
    });
  };
  const onNumberInputChange = (e) => {
    const { name, value } = e.target;
   
    if (value === '' || /^[0-9\b]+$/.test(value)) {
      setAllReceiptDownload({
        ...receiptsdwn,
        [name]: value,
      });
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      receipt_from_date: receiptsdwn.receipt_from_date,
      receipt_to_date: receiptsdwn.receipt_to_date,
      receipt_donation_type: receiptsdwn.receipt_donation_type,
      receipt_exemption_type: receiptsdwn.receipt_exemption_type,
      receipt_amount_range: receiptsdwn.receipt_amount_range,
      receipt_ots_range_from: receiptsdwn.receipt_ots_range_from,
      receipt_ots_range_to: receiptsdwn.receipt_ots_range_to,
      indicomp_donor_type: receiptsdwn.indicomp_donor_type,
      indicomp_promoter: receiptsdwn.indicomp_promoter,
      chapter_id: receiptsdwn.chapter_id,
      indicomp_source: receiptsdwn.indicomp_source,
    };
    var v = document.getElementById("dowRecp").checkValidity();
    var v = document.getElementById("dowRecp").reportValidity();
    if (v) {
      setIsButtonDisabled(true);

      axios({
        url: DOWNLOAD_ALL_RECEIPT,
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
          link.setAttribute("download", "all_receipt_list.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Receipt is Downloaded Successfully");
          setIsButtonDisabled(false);
          setAllReceiptDownload({
            receipt_from_date: firstdate,
            receipt_to_date: todayback,
            receipt_donation_type: "",
            receipt_exemption_type: "",
            receipt_amount_range: "0-100000000",
            receipt_ots_range_from: "0",
            receipt_ots_range_to: "5000",
            indicomp_donor_type: "",
            indicomp_promoter: "",
            chapter_id: "",
            indicomp_source: "",
          });
        })
        .catch((err) => {
          toast.error("Receipt is Not Downloaded");
          setIsButtonDisabled(false);
        });
    }
  };

  // Fetch item data
  const [datasource, setDatasource] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [promoter, setPromoters] = useState([]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const fetchDatasource = fetch(
      DOWNLOAD_DROPDOWN_DATASOURCE,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => data.datasource);

    const fetchChapters = fetch(
      DOWNLOAD_DROPDOWN_CHAPTER,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => data.chapters);

    const fetchPromoters = fetch(
      DOWNLOAD_DROPDOWN_PROMOTER,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => data.promoter);

    // Use Promise.all to execute all fetches concurrently
    Promise.all([fetchDatasource, fetchChapters, fetchPromoters])
      .then(([datasourceData, chaptersData, promoterData]) => {
        setDatasource(datasourceData);
        setChapters(chaptersData);
        setPromoters(promoterData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
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
         <div className="flex flex-col  md:flex-row items-center justify-between mb-5"> <h3 className="text-red-500 ">
            Leave blank if you want all records.
          </h3>
          {/* <h3 className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full bg-red-50 text-red-800 shadow-sm ">
          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
  </svg>
          Only last 2 years data available
          </h3> */}
          
         
          </div>

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
                label="Categorys"
                name="receipt_exemption_type"
                value={receiptsdwn.receipt_exemption_type}
                options={exemption}
                onChange={onInputChange}
                placeholder="Select Category"
              />
              <SelectInput
                label="Donor Type"
                name="indicomp_donor_type"
                value={receiptsdwn.indicomp_donor_type}
                options={donor_type}
                onChange={onInputChange}
                placeholder="Select Donor Type"
              />
              <SelectInput
                label="Promoter"
                name="indicomp_promoter"
                value={receiptsdwn.indicomp_promoter}
                options={promoter.map((item) => ({
                  value: item.indicomp_promoter,
                  label: item.indicomp_promoter,
                }))}
                onChange={onInputChange}
                placeholder="Select Promoter"
              />
              {/* <SelectInput
                label="OTS Range From"
                name="receipt_ots_range_from"
                value={receiptsdwn.receipt_ots_range_from}
                options={ots_range_from}
                onChange={onInputChange}
                placeholder="Select OTS Range"
              />
              
              <SelectInput
                label="OTS Range TO"
                name="receipt_ots_range_to"
                value={receiptsdwn.receipt_ots_range_to}
                options={ots_range_to}
                onChange={onInputChange}
                placeholder="Select OTS Range"
              /> */}
<div>
    <FormLabel>OTS Range From</FormLabel>
    <input
      type="number"
      name="receipt_ots_range_from"
      value={receiptsdwn.receipt_ots_range_from}
      onChange={onNumberInputChange}
      className={inputClass}
      placeholder="Enter OTS Range From"
      min="0"
    />
  </div>
  
  <div>
    <FormLabel>OTS Range To</FormLabel>
    <input
      type="number"
      name="receipt_ots_range_to"
      value={receiptsdwn.receipt_ots_range_to}
      onChange={onNumberInputChange}
      className={inputClass}
      placeholder="Enter OTS Range To"
      min="0"
    />
  </div>
              <SelectInput
                label="Amount Range"
                name="receipt_amount_range"
                value={receiptsdwn.receipt_amount_range}
                options={amount_range}
                onChange={onInputChange}
                placeholder="Select Amount"
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
              <SelectInput
                label="Chapter"
                name="chapter_id"
                value={receiptsdwn.chapter_id}
                options={chapters.map((item) => ({
                  value: item.id,
                  label: item.chapter_name,
                }))}
                onChange={onInputChange}
                placeholder="Select Chapter"
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

export default DowloadAllRecepit;
