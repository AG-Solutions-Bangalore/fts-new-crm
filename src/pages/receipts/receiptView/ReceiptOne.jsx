import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, Tooltip, Dialog } from "@mui/material";
import { useParams } from "react-router-dom";
import numWords from "num-words";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import { MdHighlightOff } from "react-icons/md";
import Logo1 from "../../../assets/receipt/fts.png";
import Logo2 from "../../../assets/receipt/top.png";
import Logo3 from "../../../assets/receipt/ekal.png";
import moment from "moment";
import { IconDownload, IconMail, IconPrinter, IconReceipt } from "@tabler/icons-react";
const ReceiptOne = () => {
  const componentRef = useRef();
  const componentRefp = useRef();
  const [donor, setDonor] = useState([]);
  const [receipts, setReceipts] = useState({});
  const [chapter, setChapter] = useState({});
  const [authsign, setSign] = useState({});
  const [authsign1, setSign1] = useState({});
  const [theId, setTheId] = useState(0);
  const [loader, setLoader] = useState(true);
  const [country, setCountry] = useState({});
  const [showmodal, setShowmodal] = useState(false);
  const { id } = useParams();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const amountInWords = numWords(receipts.receipt_total_amount);

  const closegroupModal = () => setShowmodal(false);
  const [donor1, setDonor1] = useState({
    indicomp_email: "",
  });

  const openmodal = () => {
    setShowmodal(true);
    localStorage.setItem("ftsid", receipts.indicomp_fts_id + "");
  };

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
    localStorage.setItem("ftsid", receipts.indicomp_fts_id + "");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onInputChange = (e) => {
    setDonor1({
      ...donor1,
      [e.target.name]: e.target.value,
    });
  };

  const today = new Date()
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");

  const fetchDataReceipt = async () => {
    await axios({
      url: `${BASE_URL}/api/fetch-receipt-by-id/${id}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setReceipts(res.data.receipt);
      setChapter(res.data.chapter);
      setSign(res.data.auth_sign);
      setSign1(res.data.auth_sign);
      setCountry(res.data.country);
      setLoader(false);
    });
  };
  useEffect(() => {
    setTheId(id);
    fetchDataReceipt();
  }, []);

  const printReceipt = (e) => {
    e.preventDefault();
    window.open(`${BASE_URL}/api/print-receipt?id=${theId}`, "_blank");
  };

  const sendEmail = (e) => {
    e.preventDefault();
    axios({
      url: `${BASE_URL}/api/send-receipt?id=${theId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("login")}`,
      },
    }).then(() => {
      // Assuming you have a notification system
      alert("Email Sent Successfully");
    });
  };

  const downloadReceipt = async (e) => {
    e.preventDefault();
    await axios({
      url: `${BASE_URL}/api/download-receipts?id=${theId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => {
        toast.success("Receipt Downloaded Successfully");
      })
      .catch(() => {
        toast.error("Receipt Not Downloaded");
      });
  };

  const handleExportWithFunction = () => {
    savePDF(componentRefp.current, {
      paperSize: "auto",
      margin: 40,
      scale: 0.8,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setIsButtonDisabled(true);
    const formData = {
      indicomp_email: donor1.indicomp_email,
    };
    console.log("formdata", formData);
    try {
      const response = await axios.put(
        `${BASE_URL}/api/update-donor-email/${localStorage.getItem("ftsid")}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status == "200") {
        handleClose();
        fetchDataReceipt()
        toast.success("Data Added Successfully");
      } else {
        toast.error("Data  Duplicate Entry");
      }
    } catch (error) {
      console.error("Error updating Data :", error);
      toast.error("Error updating Data ");
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

  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500";
  return (
    <>
      {"2022-04-01" <= receipts.receipt_date && (
        <div className="flex justify-center">
          <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
            {localStorage.getItem("user_type_id") != 4 && (
              <div className="flex justify-end p-4 space-x-4">
                <button className="flex items-center text-blue-600 hover:text-blue-800">
                  <a href={BASE_URL + "/api/download-receipts?id=" + theId}>
                    <span className="mr-2 flex items-center gap-1">
                      <IconDownload className="h-5 w-5 text-black"/>
                        <p>Download</p>
                      </span> 
                  </a>
                </button>

                {receipts?.individual_company?.indicomp_email && (
                  <button
                    onClick={sendEmail}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <span className="mr-2">
                      <IconMail className="h-5 w-5 text-black"/>
                    </span>
                    Email
                    <div className="text-xs ml-1">
                      {`Sent ${receipts.receipt_email_count || 0} times`}
                    </div>
                  </button>
                )}

                {receipts?.individual_company?.indicomp_email === null && (
                  <div>
                    <p className="text-red-500">
                      <span className="mr-2">
                        
                        <IconPrinter className="h-5 w-5 text-black"/>
                        </span> Email not found
                    </p>
                    <button
                      onClick={handleClickOpen}
                      className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md mr-2 mb-2"
                    >
                      Add Email
                    </button>
                  </div>
                )}

                <button
                  onClick={printReceipt}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <span className="mr-2">🖨️</span> Print Receipt
                </button>
              </div>
            )}

            <div className="p-4" ref={componentRefp}>
              <div className="relative">
                <img
                  src={Logo1}
                  alt="water mark"
                  className=" absolute top-24 left-[360px]  opacity-30 "
                />

                <div className="flex justify-between items-center border border-black">
                  <img
                    src={Logo1}
                    alt="FTS logo"
                    className="m-5 ml-12 w-20 h-20"
                  />

                  <div className="text-center">
                    <img
                      src={Logo2}
                      alt="Top banner"
                      className="mx-auto mb-2 w-80"
                    />
                    <h2 className="text-xl font-bold">
                      {chapter.chapter_name}
                    </h2>
                  </div>

                  <img
                    src={Logo3}
                    alt="Ekal logo"
                    className="m-5 mr-12 w-20 h-20"
                  />
                </div>

                <div className="text-center flex justify-center items-center border-x border-b border-black -mt-9  p-5">
                  <p className="text-[11px]">
                    {`${chapter.chapter_address}, ${chapter.chapter_city} - ${chapter.chapter_pin}, ${chapter.chapter_state}`}
                  </p>
                  <p className="text-[11px]">
                    {`Email: ${chapter.chapter_email} | ${chapter.chapter_website} | Ph: ${chapter.chapter_phone} | Mob: ${chapter.chapter_whatsapp}`}
                  </p>
                </div>

                <div className="text-center border-x -mt-6 border-black p-1">
                  <p className="text-xs">
                    Head Office: Harish Mukherjee Road, 
                    Kolkata-26. Web: www.ftsindia.com Ph: 033 - 2454
                    4510/11/12/13 PAN: AAAAF0290L
                  </p>
                </div>

                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border-l border-black p-2">
                        Received with thanks from :
                      </td>
                      <td className="border-l  border-black p-2">
                        Receipt No.
                      </td>
                      <td className="p-2">:</td>
                      <td className="border-r border-black p-2">
                        <span className="font-bold">
                          {receipts.receipt_ref_no}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="border-l border-black p-2" rowSpan="2">
                        {Object.keys(receipts).length !== 0 && (
                          <div className="-mt-6 ml-6  font-bold">
                            <p className="text-sm leading-tight">
                              {receipts.individual_company.indicomp_type !==
                                "Individual" && "M/s"}
                              {receipts.individual_company.indicomp_type ===
                                "Individual" &&
                                receipts.individual_company.title}{" "}
                              {receipts.individual_company.indicomp_full_name}
                            </p>

                            {receipts.individual_company.hasOwnProperty(
                              "indicomp_off_branch_address"
                            ) && (
                              <div>
                                <p className="text-sm leading-tight">
                                  {
                                    receipts.individual_company
                                      .indicomp_off_branch_address
                                  }
                                </p>
                                <p className="text-sm leading-tight">
                                  {
                                    receipts.individual_company
                                      .indicomp_off_branch_area
                                  }
                                </p>
                                <p className="text-sm leading-tight">
                                  {
                                    receipts.individual_company
                                      .indicomp_off_branch_ladmark
                                  }
                                </p>
                                <p className="text-sm leading-tight">
                                  {
                                    receipts.individual_company
                                      .indicomp_off_branch_city
                                  }
                                  -{" "}
                                  {
                                    receipts.individual_company
                                      .indicomp_off_branch_pin_code
                                  }
                                  ,
                                  {
                                    receipts.individual_company
                                      .indicomp_off_branch_state
                                  }
                                </p>
                              </div>
                            )}

                            {receipts.individual_company.hasOwnProperty(
                              "indicomp_res_reg_address"
                            ) && (
                              <div>
                                <p className="text-sm leading-tight">
                                  {
                                    receipts.individual_company
                                      .indicomp_res_reg_address
                                  }
                                </p>
                                <p className="text-sm leading-tight">
                                  {
                                    receipts.individual_company
                                      .indicomp_res_reg_area
                                  }
                                </p>
                                <p className="text-sm leading-tight">
                                  {
                                    receipts.individual_company
                                      .indicomp_res_reg_ladmark
                                  }
                                </p>
                                <p className="text-sm leading-tight">
                                  {
                                    receipts.individual_company
                                      .indicomp_res_reg_city
                                  }
                                  -{" "}
                                  {
                                    receipts.individual_company
                                      .indicomp_res_reg_pin_code
                                  }
                                  ,
                                  {
                                    receipts.individual_company
                                      .indicomp_res_reg_state
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="border-l border-t border-black p-2">
                        Date
                      </td>
                      <td className="p-2 border-t border-black">:</td>
                      <td className="border-r border-t border-black p-2">
                        <span className="font-bold">
                          {moment(receipts.receipt_date).format("DD-MM-YYYY")}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="border-l border-t border-black p-2">
                        On account of
                      </td>
                      <td className="p-2 border-t border-black">:</td>
                      <td className="border-r border-t border-black p-2">
                        <span className="font-bold">
                          {receipts.receipt_donation_type}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="border-l border-black p-2">
                        <div className="flex items-center">
                          <span>
                            {country.map(
                              (coustate, key) =>
                                coustate.state_country === "India" && "PAN No :"
                            )}
                          </span>
                          <span className="font-bold ml-2">
                            {Object.keys(receipts).length !== 0 &&
                              country.map(
                                (coustate1, key) =>
                                  coustate1.state_country === "India" && (
                                    <span key={key}>
                                      {
                                        receipts.individual_company
                                          .indicomp_pan_no
                                      }
                                    </span>
                                  )
                              )}
                          </span>
                        </div>
                      </td>

                      <td className="border-l border-t border-black p-2">
                        Pay Mode
                      </td>
                      <td className="p-2  border-t border-black">:</td>
                      <td className="border-r border-t border-black p-2">
                        <span className="font-bold">
                          {receipts.receipt_tran_pay_mode}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="border-l border-t border-b border-black p-2">
                        Amount in words :
                        <span className="font-bold capitalize">
                          {amountInWords} Only
                        </span>
                      </td>
                      <td className="border-l border-b border-t border-black p-2">
                        Amount
                      </td>
                      <td className="p-2 border-b border-t border-black">:</td>
                      <td className="border-r border-b border-t border-black p-2">
                        Rs.{" "}
                        <span className="font-bold ">
                          {receipts.receipt_total_amount}
                        </span>{" "}
                        /-
                      </td>
                    </tr>

                    <tr>
                      <td
                        className="border-l border-b border-r border-black p-2"
                        colSpan="4"
                      >
                        Reference :
                        <span className="font-bold text-sm">
                          {receipts.receipt_tran_pay_details}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td
                        className="border-l border-b border-black p-2"
                        colSpan="1"
                      >
                        {receipts.receipt_exemption_type === "80G" && (
                          <div className="text-sm">
                            {receipts.receipt_date > "2021-05-27" ? (
                              <>
                                Donation is exempt U/Sec.80G of the
                                <br />
                                Income Tax Act 1961 vide Order No.
                                AAAAF0290LF20214 Dt. 28-05-2021.
                              </>
                            ) : (
                              <>
                                This donation is eligible for deduction U/S
                                80(G) of the
                                <br />
                                Income Tax Act 1961 vide order
                                NO:DIT(E)/3260/8E/73/89-90 Dt. 13-12-2011.
                              </>
                            )}
                          </div>
                        )}
                      </td>
                      <td
                        className="border-b border-r border-black p-2 text-right text-sm"
                        colSpan="3"
                      >
                        For Friends of Tribals Society
                        <br />
                        <br />
                        {authsign.length > 0 && (
                          <div className="signature-section">
                            {/* Signature row */}
                            <div className="flex flex-col items-end">
                              {authsign.map((sig, key) => (
                                <div key={key} className="text-center">
                                  {sig.signature_image && (
                                    <img
                                      src={sig.signature_image}
                                      alt={`${sig.indicomp_full_name}'s signature`}
                                      className="h-12 mb-1"
                                    />
                                  )}
                                  <span className="font-semibold">
                                    {sig.indicomp_full_name}
                                  </span>
                                  {sig.designation && (
                                    <div className="text-sm text-gray-600">
                                      {sig.designation}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Optional: Add authorized signatory text */}
                            <div className="text-sm text-gray-500 mt-2">
                              Authorized Signatory
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      <Dialog
        open={open}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <form onSubmit={onSubmit} autoComplete="off">
          <Card className="p-6 space-y-1 w-[300px]">
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-slate-800 text-xl font-semibold">
                  Donor Email
                </h1>
                <div className="flex">
                  <Tooltip title="Close">
                    <button
                      className="ml-3 pl-2 hover:bg-gray-200 rounded-full"
                      onClick={handleClose}
                    >
                      <MdHighlightOff />
                    </button>
                  </Tooltip>
                </div>
              </div>

              <div className="mt-2">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-2">
                  <div>
                    <FormLabel required>Email</FormLabel>
                    <input
                      type="text"
                      name="indicomp_email"
                      value={donor1.indicomp_email}
                      onChange={(e) => onInputChange(e)}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
                <div className="mt-5 flex justify-center">
                  <button
                    disabled={isButtonDisabled}
                    type="submit"
                    className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md mr-2 mb-2"
                  >
                    {isButtonDisabled ? "Submiting..." : "Submit"}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Dialog>
    </>
  );
};

export default ReceiptOne;
