import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, Tooltip, Dialog } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import numWords from "num-words";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import { MdHighlightOff } from "react-icons/md";
import Logo1 from "../../../assets/receipt/fts_log.png";
import Logo2 from "../../../assets/receipt/top.png";
import Logo3 from "../../../assets/receipt/ekal.png";
import moment from "moment";
import {
  IconFileTypePdf,
  IconMail,
  IconPrinter,
} from "@tabler/icons-react";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { IconArrowBack } from "@tabler/icons-react";

import { CgTally } from "react-icons/cg";
import { fetchReceiptOneSendMail, fetchReceiptViewById, RECEIPT_VIEW_SEND_EMAIL, RECEIPT_VIEW_SUMBIT } from "../../../api";

const ReceiptOne = () => {
  const tableRef = useRef(null);
    const containerRef = useRef();

  const [receipts, setReceipts] = useState({});
  const [chapter, setChapter] = useState({});
  const [authsign, setSign] = useState({});
  const [authsign1, setSign1] = useState({});
  const [theId, setTheId] = useState(0);
  const [loader, setLoader] = useState(true);
  const [country, setCountry] = useState({});
  const { id } = useParams();
  // const decryptedId = decryptId(id);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const amountInWords = numWords(receipts.receipt_total_amount);
 
  const navigate = useNavigate();


  const handleSavePDF = () => {
    const input = tableRef.current;
  
    if (input) {
      const originalStyle = input.style.cssText;
  
      
      input.style.width = "210mm";
      input.style.minWidth = "210mm";
      input.style.margin = "2mm"; 
      input.style.padding = "2mm"; 
      input.style.boxSizing = "border-box";
      input.style.position = "absolute";
      input.style.left = "0";
      input.style.top = "0";
  
      const clone = input.cloneNode(true);
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.top = "0";
      clone.style.visibility = "visible";
      document.body.appendChild(clone);
  
      html2canvas(clone, {
        scale: 2,
        width: 210 * 3.78,
        windowWidth: 210 * 3.78,
        scrollX: 0,
        scrollY: 0,
        imageTimeout: 0,
        useCORS: true,
        logging: false,
        backgroundColor: "#FFFFFF",
      })
        .then((canvas) => {
          document.body.removeChild(clone);
          input.style.cssText = originalStyle;
  
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
          });
  
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
  
         
          const margin = 2; 
  
          const imgWidth = pdfWidth - 2 * margin;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
          pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
          pdf.save("Receipt.pdf");
        })
        .catch((error) => {
          console.error("Error generating PDF: ", error);
          document.body.removeChild(clone);
          input.style.cssText = originalStyle;
        });
    }
  };


  const [donor1, setDonor1] = useState({
    indicomp_email: "",
  });

  

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



   const handlPrintPdf = useReactToPrint({
     content: () => containerRef.current,
     documentTitle: "letter-view",
     pageStyle: `
         @page {
         size: auto;
         margin: 1mm;
         
       }
       @media print {
         body {
           border: 0px solid #000;
           margin: 2mm;
           padding: 2mm;
           min-height: 100vh;
         }
         .print-hide {
           display: none;
         }
        
       
      
       .page-break {
         page-break-before: always;
   
            
       }
 
       }
       `,
   });
   const handlReceiptPdf = useReactToPrint({
     content: () => tableRef.current,
     documentTitle: "receipt-view",
     pageStyle: `
         @page {
         size: auto;
      margin: 2mm;
  
         
       }
         
       @media print {
         body {
           border: 0px solid #000;
           margin: 2mm;
           padding: 2mm;
           min-height: 100vh;
         }
         .print-hide {
           display: none;
         }
        
       
      
       .page-break {
         page-break-before: always;
   
            
       }
 
       }
       `,
   });
 useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchReceiptViewById(id);
        setReceipts(data.receipt);
      setChapter(data.chapter);
      setSign(data.auth_sign);
      setSign1(data.auth_sign);
      setCountry(data.country);
      setLoader(false);
      } catch (error) {
        toast.error("Failed to fetch viewer details");
      }
    };
    
    fetchData();
  }, [id]);
  const [recepitcontrol, setRecepitControl] = useState({});
  const FetchRecepitYear = () => {
    axios
      .get(`${BASE_URL}/api/fetch-receipt-control`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setRecepitControl(res.data.receipt_control);
        // console.log("data", res.data.receipt_control);
      });
  };
  useEffect(() => {
    setTheId(id);
    FetchRecepitYear();
  }, []);

  // const sendEmail = (e) => {
  //   e.preventDefault();
  //   axios({
  //     url: `${RECEIPT_VIEW_SEND_EMAIL}${theId}`,
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   }).then(() => {
  //     // Assuming you have a notification system
  //     alert("Email Sent Successfully");
  //   });
  // };
  
  const sendEmail = async (e) => {
      e.preventDefault();
      try {
        const response = await fetchReceiptOneSendMail(theId);
  
        if (response.data.code === 200) {
          toast.success(response.data.msg);
        } else {
          toast.error(response.data.msg);
        }
      } catch (error) {
        toast.error(error.response?.data?.msg || "Network error occurred.");
      }
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
    // console.log("formdata", formData);
    try {
      const response = await axios.put(
        `${RECEIPT_VIEW_SUMBIT}/${localStorage.getItem("ftsid")}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status == "200") {
        handleClose();
        fetchDataReceipt();
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
  const tallyReceipt = receipts?.tally_status;
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
    <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 mb-4 rounded-lg shadow-md gap-2">
      <h1 className="border-b-2 font-normal border-dashed border-orange-800 flex items-center">
          <IconArrowBack
            onClick={() => navigate("/receipt-list")}
            className="cursor-pointer hover:text-red-600 mr-2"
          />
        <p className="flex flex-row items-center gap-2"> <span>Receipt View </span>{tallyReceipt == 'True' ? <>  <CgTally className="w-4 h-4" /> </> : ""}</p>
        </h1>
        
        {recepitcontrol.download_open === "Yes" && (
          <>
            {localStorage.getItem("user_type_id") != 4 && (
              <div className="flex flex-wrap justify-end gap-2 sm:gap-4">
              <button
                className="flex flex-col items-center text-blue-600 hover:text-blue-800 text-xs"
                onClick={handleSavePDF}
              >
                <IconFileTypePdf className="h-5 w-5 text-black" />
                <span>Pdf</span>
              </button>

              {receipts?.individual_company?.indicomp_email && (
                <button
                  className="flex flex-col items-center text-blue-600 hover:text-blue-800 text-xs"
                  onClick={sendEmail}
                >
                  <IconMail className="h-5 w-5 text-black" />
                  <span>Sent {receipts.receipt_email_count || 0} times</span>
                </button>
              )}

              <button
                className="flex flex-col items-center text-blue-600 hover:text-blue-800 text-xs"
                onClick={handlReceiptPdf}
              >
                <IconPrinter className="h-5 w-5 text-black" />
                <span>Receipt</span>
              </button>

              <button
                className="flex flex-col items-center text-blue-600 hover:text-blue-800 text-xs"
                onClick={handlPrintPdf}
              >
                <IconPrinter className="h-5 w-5 text-black" />
                <span> Letter</span>
              </button>

              {receipts?.individual_company?.indicomp_email === null && (
                <div className="flex flex-col items-center">
                  <div className="flex items-center text-blue-600 hover:text-blue-800">
                    <IconPrinter className="h-5 w-5 text-black" />
                    <span className="text-red-500 text-xs ml-1">
                      Email not found
                    </span>
                  </div>
                  <button
                    onClick={handleClickOpen}
                    className="text-xs font-normal cursor-pointer hover:animate-pulse text-white bg-blue-600 hover:bg-green-700 px-2 py-1 rounded shadow"
                  >
                    Add Email
                  </button>
                </div>
              )}
            </div>
            )}
          </>
        )}
      </div>
      <div className="overflow-x-auto  grid md:grid-cols-1 1fr">
        {"2022-04-01" <= receipts.receipt_date && (
       <div className="flex justify-center">
                   <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
                     <div ref={tableRef}>
                       <div className="relative  ">
                         <img
                           src={Logo1}
                           alt="water mark"
                           className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 w-auto h-56"
                         />
       
                         <div className="flex justify-between items-center border-t border-r border-l border-black">
                           <img
                             src={Logo1}
                             alt="FTS logo"
                             className="m-3 ml-12 w-auto h-16 "
                           />
       
                           <div className="  flex-1 text-center mr-24  ">
                             <img
                               src={Logo2}
                               alt="Top banner"
                               className="mx-auto mb-0 w-80  "
                             />
                             <h2 className="text-xl font-bold mt-1 ">
                               {chapter.chapter_name}
                             </h2>
                           </div>
       
                           <img
                             src={Logo3}
                             alt="Ekal logo"
                             className="m-3 mr-12 w-16  h-16  "
                           />
                         </div>
       
                         <div className="text-center border-x border-b border-black p-1   h-14">
                           <p className="text-sm font-semibold mx-auto max-w-[90%] ">
                             {`${chapter?.chapter_address || ""}, ${
                               chapter?.chapter_city || ""
                             } - ${chapter?.chapter_pin || ""}, ${
                               chapter?.chapter_state || ""
                             } 
           ${chapter?.chapter_email ? `Email: ${chapter.chapter_email} |` : ""} 
           ${chapter?.chapter_website ? `${chapter.chapter_website} |` : ""} 
           ${chapter?.chapter_phone ? `Ph: ${chapter.chapter_phone} |` : ""} 
           ${chapter?.chapter_whatsapp ? `Mob: ${chapter.chapter_whatsapp}` : ""}`}
                           </p>
                         </div>
       
                         <div className="text-center border-x h-7 border-black p-1">
                           <p className="text-[11px] font-medium mx-auto ">
                             Head Office: Ekal Bhawan, 123/A, Harish Mukherjee Road, Kolkata-26. Web:
                             www.ftsindia.com Ph: 033 - 2454 4510/11/12/13 PAN:
                             AAAAF0290L
                           </p>
                         </div>
       
                         <table className="w-full border-t border-black border-collapse text-[12px]">
                           <tbody>
                             <tr>
                               <td className="border-l border-black p-1">
                                 Received with thanks from :
                               </td>
                               <td className="border-l  border-black p-1">
                                 Receipt No.
                               </td>
                               <td className="p-2">:</td>
                               <td className="border-r border-black p-1">
                                 <span className="font-bold">
                                   {receipts.receipt_ref_no}
                                 </span>
                               </td>
                             </tr>
       
                             <tr>
                               <td className="border-l border-black " rowSpan="2">
                                 {Object.keys(receipts).length !== 0 && (
                                   <div className=" ml-6  font-bold">
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
                               <td className="border-l border-t border-black p-1">
                                 Date
                               </td>
                               <td className="p-1 border-t border-black">:</td>
                               <td className="border-r border-t border-black p-1">
                                 <span className="font-bold">
                                   {moment(receipts.receipt_date).format("DD-MM-YYYY")}
                                 </span>
                               </td>
                             </tr>
       
                             <tr>
                               <td className="border-l border-t border-black p-1">
                                 On account of
                               </td>
                               <td className="p-1 border-t border-black">:</td>
                               <td className="border-r border-t border-black p-1">
                                 <span className="font-bold">
                                   {receipts.receipt_donation_type}
                                 </span>
                               </td>
                             </tr>
       
                             <tr>
                               <td className="border-l border-black p-1">
                                 <div className="flex items-center">
                                   <span>
                                     {country.map(
                                       (coustate, key) =>
                                         coustate.state_country === "India" &&
                                         "PAN No :"
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
       
                               <td className="border-l border-t border-black p-1">
                                 Pay Mode
                               </td>
                               <td className="p-1  border-t border-black">:</td>
                               <td className="border-r border-t border-black p-1">
                                 <span className="font-bold">
                                   {receipts.receipt_tran_pay_mode}
                                 </span>
                               </td>
                             </tr>
       
                             <tr>
                               <td className="border-l border-t border-b border-black p-1">
                                 Amount in words :
                                 <span className="font-bold capitalize">
                                   {amountInWords} Only
                                 </span>
                               </td>
                               <td className="border-l border-b border-t border-black p-1">
                                 Amount
                               </td>
                               <td className="p-1 border-b border-t border-black">
                                 :
                               </td>
                               <td className="border-r border-b border-t border-black p-1">
                                 Rs.{" "}
                                 <span className="font-bold ">
                                   {receipts.receipt_total_amount}
                                 </span>{" "}
                                 /-
                               </td>
                             </tr>
       
                             <tr>
                               <td
                                 className="border-l border-b border-r border-black p-1"
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
                                 className="border-l border-b border-black p-1"
                                 colSpan="1"
                               >
                                 {receipts.receipt_exemption_type === "80G" && (
                                   <div className="text-[12px]">
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
                                 className="border-b border-r border-black p-1 text-right text-[12px]"
                                 colSpan="3"
                               >
                                 For Friends of Tribals Society
                                 <br />
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
                                     <div className="text-sm text-gray-500 mt-0">
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
        {/* //////////////second */}
        <div className=" flex justify-center">
                 <div className="p-6 mt-5 bg-white shadow-md rounded-lg md:w-[86%]">
                   {/* <hr className="border-b border-blue-gray-400" /> */}
                   <div ref={containerRef} className="">
                     <div className="flex justify-between p-6 mt-44">
                       <div className="text-[#464D69] md:text-xl text-sm">
                         <p className=" font-serif text-[20px]">
                           Date: {moment(receipts.receipt_date).format("DD-MM-YYYY")}
                         </p>
       
                         {Object.keys(receipts).length !== 0 && (
                           <div className="mt-2 ">
                             {receipts.receipt_donation_type !== "Membership" &&
                               receipts.individual_company.indicomp_type !==
                                 "Individual" && (
                                 <p className=" font-serif text-[18px]">
                                   {receipts.individual_company.title}{" "}
                                   {
                                     receipts.individual_company
                                       .indicomp_com_contact_name
                                   }
                                 </p>
                               )}
       
                             {receipts.individual_company.indicomp_type !==
                               "Individual" && (
                               <p className=" font-serif text-[18px]">
                                 M/s {receipts.individual_company.indicomp_full_name}
                               </p>
                             )}
       
                             {receipts.individual_company.indicomp_type ===
                               "Individual" && (
                               <p className=" font-serif text-[18px]">
                                 {receipts.individual_company.title}{" "}
                                 {receipts.individual_company.indicomp_full_name}
                               </p>
                             )}
       
                             {receipts.individual_company
                               .indicomp_off_branch_address && (
                               <div>
                                 <p className=" font-serif text-[18px]">
                                   {
                                     receipts.individual_company
                                       .indicomp_off_branch_address
                                   }
                                 </p>
                                 <p className=" font-serif text-[18px]">
                                   {
                                     receipts.individual_company
                                       .indicomp_off_branch_area
                                   }
                                 </p>
                                 <p className="mb-0 text-xl">
                                   {
                                     receipts.individual_company
                                       .indicomp_off_branch_ladmark
                                   }
                                 </p>
                                 <p className=" font-serif text-[18px]">
                                   {
                                     receipts.individual_company
                                       .indicomp_off_branch_city
                                   }{" "}
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
       
                             {receipts.individual_company.indicomp_res_reg_address && (
                               <div>
                                 <p className=" font-serif text-[18px]">
                                   {
                                     receipts.individual_company
                                       .indicomp_res_reg_address
                                   }
                                 </p>
                                 <p className=" font-serif text-[18px]">
                                   {receipts.individual_company.indicomp_res_reg_area}
                                 </p>
                                 <p className=" font-serif text-[18px]">
                                   {
                                     receipts.individual_company
                                       .indicomp_res_reg_ladmark
                                   }
                                 </p>
                                 <p className=" font-serif text-[18px]">
                                   {receipts.individual_company.indicomp_res_reg_city}{" "}
                                   -{" "}
                                   {
                                     receipts.individual_company
                                       .indicomp_res_reg_pin_code
                                   }
                                   ,
                                   {receipts.individual_company.indicomp_res_reg_state}
                                 </p>
                               </div>
                             )}
                           </div>
                         )}
       
                         <p className=" my-6 font-serif text-[18px] text-justify ">
                           {receipts.individual_company?.indicomp_gender ===
                             "Female" && "Respected Madam,"}
                           {receipts.individual_company?.indicomp_gender === "Male" &&
                             "Respected Sir,"}
                           {receipts.individual_company?.indicomp_gender === null &&
                             "Respected Sir,"}
                         </p>
       
                         {receipts.receipt_donation_type === "One Teacher School" && (
                           <div className="mt-2 text-justify">
                             <p className=" font-serif text-[18px] flex justify-center my-6">
                               Sub: Adoption of One Teacher School
                             </p>
                             <p className=" font-serif text-[18px] text-justify leading-[1.2rem]">
                               We acknowledge with thanks the receipt of Rs.
                               {receipts.receipt_total_amount}/- Rupees {amountInWords}{" "}
                               Only via{" "}
                               {receipts.receipt_tran_pay_mode == "Cash" && (
                                 <>
                                   {" "}
                                   Cash for your contribution and adoption of{" "}
                                   {receipts.receipt_no_of_ots} OTS.
                                 </>
                               )}
                               {receipts.receipt_tran_pay_mode != "Cash" && (
                                 <>
                                   {" "}
                                   {receipts.receipt_tran_pay_details} being for your
                                   contribution and adoption of{" "}
                                   {receipts.receipt_no_of_ots} OTS.
                                 </>
                               )}
                             </p>
       
                             <p className="my-4 font-serif text-[18px] text-justify leading-[1.2rem]">
                               We convey our sincere thanks and gratitude for your kind
                               support towards the need of our tribals and also the
                               efforts being made by our Society for achieving
                               comprehensive development of our tribals brethren
                               particularly the literacy of their children and health &
                               economic welfare.
                             </p>
                             <p className=" font-serif text-[18px] text-justify leading-[1.2rem]">
                               We would like to state that our efforts are not only for
                               mitigating the hardship and problems of our tribals but
                               we are also trying to inculcate national character among
                               them.
                             </p>
                             <p className="my-4 font-serif text-[18px] text-justify leading-[1.2rem]">
                               We are pleased to enclose herewith our money receipt no.{" "}
                               {receipts.receipt_ref_no} dated{" "}
                               {moment(receipts.receipt_date).format("DD-MM-YYYY")} for
                               the said amount together with a certificate U/sec. 80(G)
                               of the I.T.Act. 1961.
                             </p>
                           </div>
                         )}
       
                         {receipts.receipt_donation_type === "General" && (
                           <div className="mt-2">
                             <p className=" font-serif text-[18px] text-justify my-5 leading-[1.2rem]">
                               We thankfully acknowledge the receipt of Rs.
                               {receipts.receipt_total_amount}/- via your{" "}
                               {receipts.receipt_tran_pay_mode === "Cash"
                                 ? "Cash"
                                 : receipts.receipt_tran_pay_details}{" "}
                               being Donation for Education.
                             </p>
       
                             <p className=" font-serif text-[18px] text-justify leading-[1.2rem]">
                               We are pleased to enclose herewith our money receipt no.{" "}
                               {receipts.receipt_ref_no} dated{" "}
                               {moment(receipts.receipt_date).format("DD-MM-YYYY")} for
                               the said amount.
                             </p>
                           </div>
                         )}
       
                         {receipts.receipt_donation_type === "Membership" && (
                           <div>
                             <p className=" font-serif text-[18px] text-justify my-5 leading-[1.2rem]">
                               We acknowledge with thanks receipt of your membership
                               subscription for the Year. Our receipt for the same is
                               enclosed herewith.
                             </p>
                           </div>
                         )}
       
                         {receipts.receipt_donation_type !== "Membership" && (
                           <div>
                             <p className="my-3 font-serif text-[18px]">
                               Thanking you once again
                             </p>
                             <p className=" font-serif text-[18px]">
                               Yours faithfully,{" "}
                             </p>
                             <p className="my-3 font-serif text-[18px] ">
                               For Friends of Tribals Society
                             </p>
                             <p className=" font-serif text-[18px] mt-10">
                               {authsign.length > 0 &&
                                 authsign.map((sig, key) => (
                                   <span key={key}>{sig.indicomp_full_name}</span>
                                 ))}
                             </p>
                             <p className=" font-serif text-[18px]">
                               {chapter.auth_sign}{" "}
                             </p>
                             <p className="my-2 font-serif text-[18px]">
                               Encl: As stated above
                             </p>
                           </div>
                         )}
       
                         {receipts.receipt_donation_type === "Membership" && (
                           <div>
                             <p className=" font-serif text-[18px] text-justify my-5">
                               With Best regards{" "}
                             </p>
                             <p className=" font-serif text-[18px] text-justify my-5">
                               Yours sincerely{" "}
                             </p>
       
                             <p className=" font-serif text-[18px] text-justify my-5">
                               {authsign.length > 0 &&
                                 authsign.map((sig, key) => (
                                   <span key={key}>{sig.indicomp_full_name}</span>
                                 ))}
                             </p>
                             <p className=" font-serif text-[18px] text-justify my-5">
                               {chapter.auth_sign}{" "}
                             </p>
                             <p className=" font-serif text-[18px] text-justify my-5">
                               Encl: As stated above
                             </p>
                           </div>
                         )}
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
       
      </div>
    </>
  );
};

export default ReceiptOne;
