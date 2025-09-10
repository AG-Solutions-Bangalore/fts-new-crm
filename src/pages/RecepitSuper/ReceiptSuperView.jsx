import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import numWords from "num-words";
import axios from "axios";
import { toast } from "react-toastify";
import Logo1 from "../../assets/receipt/fts_log.png";
import Logo2 from "../../assets/receipt/top.png";
import Logo3 from "../../assets/receipt/ekal.png";
import moment from "moment";
import {
  IconFileTypePdf,
} from "@tabler/icons-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { IconArrowBack } from "@tabler/icons-react";
import tallyImg from "../../assets/tally.svg"
import BASE_URL from "../../base/BaseUrl";
import { IconX } from "@tabler/icons-react";




const ReceiptSuperView = ({id, isDialog = false, onClose}) => {
     const tableRef = useRef(null);
      
    
      const [receipts, setReceipts] = useState({});
      const [chapter, setChapter] = useState({});
      const [authsign, setSign] = useState({});
      const [authsign1, setSign1] = useState({});
      const [theId, setTheId] = useState(0);
      const [loader, setLoader] = useState(true);
      const [country, setCountry] = useState({});

    
  
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
   
     useEffect(() => {
        const fetchData = async () => {
          try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${BASE_URL}/api/fetch-receipt-by-id/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            setReceipts(response.data.receipt);
          setChapter(response.data.chapter);
          setSign(response.data.auth_sign);
          setSign1(response.data.auth_sign);
          setCountry(response.data.country);
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
           
          });
      };
      useEffect(() => {
        setTheId(id);
        FetchRecepitYear();
      }, []);

      
      useEffect(() => {
        let timer;
        if (isDialog && !loader) {
         
          const downloadAndClose = async () => {
            try {
              await handleSavePDF();
              setTimeout(() => {
                onClose();
              }, 100);
            } catch (error) {
              console.error("Error during PDF generation:", error);
              onClose();
            }
          };
          
         
          timer = setTimeout(downloadAndClose, 500);
        }
        
        return () => {
          if (timer) clearTimeout(timer);
        };
      }, [isDialog, loader, onClose]);
   
      const tallyReceipt = receipts?.tally_status;
    
    
      
  return (
    <>

       <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 mb-4 rounded-lg shadow-md gap-2">
         <h1 className="border-b-2 font-normal border-dashed border-orange-800 flex items-center">
              {isDialog ? (
                        <IconX
                          onClick={onClose}
                          className="cursor-pointer hover:text-red-600 mr-2"
                        />
                      ) : (
                        <IconArrowBack
                          onClick={() => navigate("/recepit-sup")}
                          className="cursor-pointer hover:text-red-600 mr-2"
                        />
                      )}
           <p className="flex flex-row items-center gap-2"> <span>Receipt View </span>{tallyReceipt == 'True' ? <>  <img src={tallyImg} alt="tallyImg" /> </> : ""}</p>
           </h1>
           
           {recepitcontrol.download_open === "Yes" && !isDialog && (
             <>
               {/* {localStorage.getItem("user_type_id") != 4 && (  */}
                 <div className="flex flex-wrap justify-end gap-2 sm:gap-4">
                 <button
                   className="flex flex-col items-center text-blue-600 hover:text-blue-800 text-xs"
                   onClick={handleSavePDF}
                 >
                   <IconFileTypePdf className="h-5 w-5 text-black" />
                   <span>Pdf</span>
                 </button>
   
               
   
                
   
                
   
                
               </div>
               {/* )} */}
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
       
           
          
         </div>
       
       </>
  )
}

export default ReceiptSuperView