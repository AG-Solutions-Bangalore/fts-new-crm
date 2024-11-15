import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import { Button } from "@material-tailwind/react";
import moment from "moment";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import { decryptId } from "../../utils/encyrption/Encyrption";

const pay_mode = [
  {
    value: "Cash",
    label: "Cash",
  },
  {
    value: "Cheque",
    label: "Cheque",
  },
  {
    value: "Transfer",
    label: "Transfer",
  },
  {
    value: "Others",
    label: "Others",
  },
];

const pay_mode_2 = [
  {
    value: "Cheque",
    label: "Cheque",
  },
  {
    value: "Transfer",
    label: "Transfer",
  },
  {
    value: "Others",
    label: "Others",
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
const donation_type_2 = [
  {
    value: "One Teacher School",
    label: "One Teacher School",
  },
  {
    value: "General",
    label: "General",
  },
];

const member_date = [
  {
    value: "2022",
    label: "2022",
  },
  {
    value: "2023",
    label: "2023",
  },
  {
    value: "2024",
    label: "2024",
  },
  {
    value: "2025",
    label: "2025",
  },
  {
    value: "2026",
    label: "2026",
  },
];

const school_year = [
  {
    value: "2020-21",
    label: "2020-21",
  },
  {
    value: "2021-22",
    label: "2021-22",
  },
  {
    value: "2022-23",
    label: "2022-23",
  },
  {
    value: "2023-24",
    label: "2023-24",
  },
  {
    value: "2024-25",
    label: "2024-25",
  },
  {
    value: "2025-26",
    label: "2025-26",
  },
];

const ReceiptEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const decryptedId = useMemo(() => decryptId(id), [id]);
  useEffect(() => {
    if (!decryptedId) {
      toast.error("Invalid receipt ID");
      navigate("/receipt-list");
    }
  }, [decryptedId, navigate]);

  const [userdata, setUserdata] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loader, setLoader] = useState(true);
  const [donor, setDonor] = useState({
    receipt_date: "",
    receipt_old_no: "",
    schoolalot_year: "",
    receipt_exemption_type: "",
    receipt_total_amount: "",
    receipt_realization_date: "",
    receipt_donation_type: "",
    receipt_tran_pay_mode: "",
    receipt_tran_pay_details: "",
    receipt_remarks: "",
    receipt_reason: "",
    receipt_email_count: "",
    receipt_created_at: "",
    receipt_created_by: "",
    receipt_update_at: "",
    receipt_update_by: "",
    donor_promoter: "",
    donor_source: "",
    individual_company: {
      indicomp_full_name: "",
      indicomp_pan_no: "",
      indicomp_fts_id: "",
      m_ship_vailidity: "",
      receipt_no_of_ots: "",
    },
  });

  const validateOnlyDigits = (inputtxt) => /^\d*$/.test(inputtxt); // Simplified validation

  const onInputChange = (e) => {
    const { name, value } = e.target;
    const digitFields = ["receipt_no_of_ots", "receipt_total_amount"];

    if (digitFields.includes(name)) {
      if (validateOnlyDigits(value)) {
        setDonor((prevChapter) => ({
          ...prevChapter,
          [name]: value,
        }));
      }
    } else {
      setDonor((prevChapter) => ({
        ...prevChapter,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/fetch-donor-by-id/${decryptedId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setUserdata(res.data.individualCompany);
        setLoader(false);
      });
  }, []);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/fetch-receipt-by-id/${decryptedId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setDonor(res.data.receipt);
        setLoader(false);
      });
  }, []);

  const [datasource, setDatasource] = useState([]);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/fetch-datasource`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setDatasource(res.data.datasource);
      });
  }, []);

  const pan = userdata.indicomp_pan_no == "" ? "NA" : userdata.indicomp_pan_no;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setIsButtonDisabled(true);
    const formData = {
      schoolalot_year: donor.schoolalot_year,
      receipt_total_amount: donor.receipt_total_amount,
      receipt_realization_date: donor.receipt_realization_date,
      receipt_donation_type: donor.receipt_donation_type,
      receipt_tran_pay_mode: donor.receipt_tran_pay_mode,
      receipt_tran_pay_details: donor.receipt_tran_pay_details,
      receipt_remarks: donor.receipt_remarks,
      receipt_reason: donor.receipt_reason,
      receipt_update_at: donor.receipt_update_at,
      m_ship_vailidity: donor.m_ship_vailidity,
      receipt_no_of_ots: donor.receipt_no_of_ots,
      donor_promoter: donor.donor_promoter,
      donor_source: donor.donor_source,
    };
    try {
      const response = await axios.put(
        `${BASE_URL}/api/update-receipt/${decryptedId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status == "200") {
        toast.success("Receipt Updated Successfully");
        navigate("/receipt-list");
      } else {
        if (response.status == "401") {
          toast.error("Receipt Duplicate Entry");
        } else if (response.status == "402") {
          toast.error("Receipt Duplicate Entry");
        } else {
          toast.error("An unknown error occurred");
        }
      }
    } catch (error) {
      console.error("Error updating Receipt:", error);
      toast.error("Error  updating Receipt");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const inputClassSelect =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-green-500";
  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500";
  return (
    <Layout>
      <div className=" bg-[#FFFFFF] p-2  rounded-lg  ">
        <div className="sticky top-0 p-2   border-b-2 border-green-500 rounded-t-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Edit Receipt</span>
            </div>
            <IconArrowBack
              onClick={() => navigate("/receipt-list")}
              className="cursor-pointer hover:text-red-600"
            />
          </h2>
        </div>
        <div className="p-4 bg-red-50 rounded-b-xl">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-black">
                {donor.individual_company.indicomp_full_name}
              </h3>
              <p className="text-xs text-gray-600">
                FTS Id: {donor.individual_company.indicomp_fts_id}
              </p>

              <p className="text-xs text-black">
                Receipt Ref : {donor.receipt_ref_no}
              </p>
            </div>
            <div className="space-y-1 relative">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-black">
                  {moment(donor.receipt_date).format("DD-MM-YYYY")}
                </h3>
                <p className=" absolute -mt-8 text-xs text-gray-600">
                  {donor.receipt_financial_year}
                </p>
              </div>
              <p className="text-xs text-green-600">Pan : {pan}</p>
              <p className="text-xs text-black">
                Exemption Type : {donor.receipt_exemption_type}
              </p>
            </div>
          </div>
        </div>
        <hr />
        <form
          onSubmit={handleSubmit}
          id="addIndiv"
          className="w-full max-w-7xl  rounded-lg mx-auto p-6 space-y-8 "
        >
          <div>
            <h2 className=" px-5 text-[black] text-sm mb-2 flex flex-row gap-2 items-center  rounded-xl p-4 bg-[#E1F5FA]">
              <IconInfoCircle className="w-4 h-4" />
              <span>Receipt Details</span>
            </h2>
            <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <FormLabel required>Total Amount</FormLabel>
                <input
                  type="text"
                  maxLength={8}
                  name="receipt_total_amount"
                  value={donor.receipt_total_amount}
                  onChange={(e) => onInputChange(e)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <FormLabel required>Transaction Type</FormLabel>
                <select
                  name="receipt_tran_pay_mode"
                  value={donor.receipt_tran_pay_mode}
                  onChange={(e) => onInputChange(e)}
                  required
                  className={inputClassSelect}
                >
                  <option value="">Select Transaction Type</option>
                  {donor.receipt_exemption_type == "80G" &&
                  donor.receipt_total_amount > 2000
                    ? pay_mode_2.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))
                    : pay_mode.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                </select>
                <p className="text-gray-600 text-xs px-2 pt-1">
                  Please select your Transaction Type
                </p>
              </div>
              <div>
                <FormLabel required>Purpose</FormLabel>
                <select
                  name="receipt_donation_type"
                  value={donor.receipt_donation_type}
                  onChange={(e) => onInputChange(e)}
                  required
                  className={inputClassSelect}
                >
                  <option value="">Select Transaction Type</option>
                  {donor.receipt_exemption_type == "80G"
                    ? donation_type_2.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))
                    : donation_type.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                </select>
                <p className="text-gray-600 text-xs px-2 pt-1">
                  Please select your Donation Type
                </p>
              </div>

              <div>
                <FormLabel>Realization Date</FormLabel>
                <input
                  type="date"
                  name="receipt_realization_date"
                  value={donor.receipt_realization_date}
                  onChange={(e) => onInputChange(e)}
                  className={inputClass}
                />
                {donor.receipt_realization_date > new Date() ? (
                  <span class="dateerror">Invalid Date </span>
                ) : (
                  ""
                )}
              </div>

              {donor.receipt_donation_type == "Membership" ? (
                <div>
                  <FormLabel>Membership End Date</FormLabel>
                  <select
                    name="m_ship_vailidity"
                    value={donor.m_ship_vailidity}
                    onChange={(e) => onInputChange(e)}
                    className={inputClassSelect}
                  >
                    <option value="">Select Membership End Date</option>
                    {member_date.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-gray-600 text-xs px-2 pt-1">
                    Membership End Date
                  </p>
                </div>
              ) : (
                ""
              )}
              {donor.receipt_donation_type == "General" ? (
                <div>
                  <FormLabel>Source</FormLabel>
                  <select
                    name="donor_source"
                    value={donor.donor_source}
                    onChange={(e) => onInputChange(e)}
                    className={inputClassSelect}
                  >
                    <option value="">Select Source</option>
                    {datasource.map((source) => (
                      <option key={source.id} value={source.data_source_type}>
                        {source.data_source_type}
                      </option>
                    ))}
                  </select>
                  <p className="text-gray-600 text-xs px-2 pt-1">Source</p>
                </div>
              ) : (
                ""
              )}
              {donor.receipt_donation_type == "One Teacher School" ? (
                <div>
                  <FormLabel>No of Schools</FormLabel>
                  <input
                    type="text"
                    maxLength={3}
                    name="receipt_no_of_ots"
                    value={donor.receipt_no_of_ots}
                    onChange={(e) => onInputChange(e)}
                    className={inputClass}
                  />
                </div>
              ) : (
                ""
              )}
              {donor.receipt_donation_type == "One Teacher School" ? (
                <div>
                  <FormLabel>School Allottment Year</FormLabel>
                  <select
                    name="schoolalot_year"
                    value={donor.schoolalot_year}
                    onChange={(e) => onInputChange(e)}
                    className={inputClassSelect}
                  >
                    <option value="">Select Allotment year</option>
                    {school_year.map((source) => (
                      <option key={source.value} value={source.value}>
                        {source.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-gray-600 text-xs px-2 pt-1">
                    School Allottment Year
                  </p>
                </div>
              ) : (
                ""
              )}

              <div>
                <FormLabel>Transaction Pay Details</FormLabel>
                <textarea
                  type="text"
                  name="receipt_tran_pay_details"
                  value={donor.receipt_tran_pay_details}
                  onChange={(e) => onInputChange(e)}
                  className={inputClass}
                />
                <p className="text-gray-600 text-xs px-2 pt-1">
                  Cheque No / Bank Name / UTR / Any Other Details
                </p>
              </div>

              <div>
                <FormLabel>Remarks</FormLabel>
                <textarea
                  type="text"
                  name="receipt_remarks"
                  value={donor.receipt_remarks}
                  onChange={(e) => onInputChange(e)}
                  className={inputClass}
                />
              </div>
              <div>
                <FormLabel required>Reason</FormLabel>
                <textarea
                  type="text"
                  name="receipt_reason"
                  value={donor.receipt_reason}
                  required
                  onChange={(e) => onInputChange(e)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
          {/* Form Actions */}
          <div className="flex gap-4 justify-start">
            <Button
              type="submit"
              className="bg-[#269fbd] hover:bg-green-700"
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? "Submitting..." : "Submit"}
            </Button>
            {/* <Button
            onClick={() => onClose()}
            type="button"
            className="bg-blue-500 hover:bg-green-700"
          >
            Back
          </Button> */}
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ReceiptEdit;
