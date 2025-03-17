import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import Logo1 from "../../../assets/receipt/fts.png";
import Logo2 from "../../../assets/receipt/top.png";
import Logo3 from "../../../assets/receipt/ekal.png";
import Layout from "../../../layout/Layout";
import { FaArrowLeft } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { IoIosPrint } from "react-icons/io";
import { Button } from "@mui/material";
import ReactToPrint from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { SCHOOL_ALLOT_LETTER } from "../../../api";
import { IconArrowBack } from "@tabler/icons-react";

const SchoolAllotLetter = () => {
  const navigate = useNavigate();
  const componentRef = useRef();

  const [SchoolAlotReceipt, setSchoolAlotReceipt] = useState({});
  const [chapter, setChapter] = useState({});
  const [SchoolAlotView, setSchoolAlotView] = useState([]);
  const [OTSReceipts, setOTSReceipts] = useState([]);
  const isLoggedIn = localStorage.getItem("sclaltid");
  const today = new Date().toLocaleDateString("en-GB");

  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get(`${SCHOOL_ALLOT_LETTER}/${isLoggedIn}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setSchoolAlotReceipt(res.data.SchoolAlotReceipt);
          setChapter(res.data.chapter);
          setSchoolAlotView(res.data.SchoolAlotView);
          setOTSReceipts(res.data.OTSReceipts);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [isLoggedIn]);

  const handleSavePDF = () => {
    const input = componentRef.current;
    html2canvas(input, {
      scale: 2, // Increase scale for better resolution
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: -window.scrollY,
      height: input.scrollHeight, // Capture the full height of the content
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        // A4 dimensions
        const pdfWidth = 210; // Width of A4 in mm
        const pdfHeight = 297; // Height of A4 in mm

        // Calculate image dimensions while maintaining aspect ratio
        const imgWidth = pdfWidth - 20; // Leave 10mm margin on each side
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add first page
        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight, "", "FAST");

        // If content is taller than one page, add additional pages
        if (imgHeight > pdfHeight) {
          const totalPages = Math.ceil(imgHeight / pdfHeight);
          for (let page = 1; page < totalPages; page++) {
            pdf.addPage();
            pdf.addImage(
              imgData,
              "PNG",
              10,
              -page * pdfHeight + 10,
              imgWidth,
              imgHeight,
              "",
              "FAST"
            );
          }
        }

        pdf.save("allotment-letter.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  };

  const printStyles = `
  @page {
    size: A4;
    margin: 10mm 5mm;
  }
  @media print {
    body {
      margin: 0;
      padding: 0;
    }
    .print-container {
      width: 100%;
      margin: 0;
      padding: 5mm;
      box-sizing: border-box;
    }
    .page-break {
      page-break-before: always;
      margin-top: 10mm;
    }
  }
`;

  return (
    <Layout>
      <div className="invoice-wrapper overflow-x-auto grid md:grid-cols-1 1fr">
        <div className=" flex justify-between gap-2 bg-white p-4 mb-4 rounded-lg shadow-md">
          
          <h1 className=" border-b-2 flex flex-row items-center   font-[400] border-dashed border-orange-800">
                      <IconArrowBack
                        onClick={() => navigate("/students-schoolallot")}
                        className="cursor-pointer hover:text-red-600 mr-2"
                      />
                      Allotment Letter
                    </h1>
        </div>
        <div className="flex flex-col items-center">
          <div className="sm:w-[90%] md:w-[90%] lg:w-[70%] mx-auto ">
            <div className="bg-white shadow-md rounded-lg px-16 pb-16 pt-6 ">
              <div className="flex flex-row justify-end items-center sm:space-x-4 space-y-2 sm:space-y-0 mb-2">
                <button
                  onClick={handleSavePDF}
                  variant="text"
                  className="flex items-center space-x-2"
                >
                  <LuDownload className="text-lg" />
                  <span>PDF</span>
                </button>
                <ReactToPrint
                  trigger={() => (
                    <button
                      variant="text"
                      className="flex items-center space-x-2"
                    >
                      <IoIosPrint className="text-lg" />
                      <span>Print Letter</span>
                    </button>
                  )}
                  content={() => componentRef.current}
                  pageStyle={printStyles}
                />
              </div>

              <hr className="mb-6" />
              <div ref={componentRef} className="print-container">
                <div className="flex justify-between items-center mb-4 ">
                  <div className="invoice-logo">
                    <img
                      src={Logo1}
                      alt="session-logo"
                      width="80"
                      height="80"
                    />
                  </div>

                  <div className="invoice-logo text-right">
                    <img
                      src={Logo3}
                      alt="session-logo"
                      width="80"
                      height="80"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex my-4 text-lg">Date: {today}</label>
                  <label className="flex my-4 text-lg">To,</label>

                  {Object.keys(SchoolAlotReceipt).length !== 0 && (
                    <div className="text-lg">
                      {SchoolAlotReceipt.individual_company.indicomp_type !==
                        "Individual" && (
                        <p>
                          {SchoolAlotReceipt.individual_company.title}{" "}
                          {
                            SchoolAlotReceipt.individual_company
                              .indicomp_full_name
                          }
                        </p>
                      )}
                      {SchoolAlotReceipt.individual_company.indicomp_type ===
                        "Individual" && (
                        <p>
                          {SchoolAlotReceipt.individual_company.title}{" "}
                          {
                            SchoolAlotReceipt.individual_company
                              .indicomp_full_name
                          }
                        </p>
                      )}
                      {SchoolAlotReceipt.individual_company.hasOwnProperty(
                        "indicomp_off_branch_address"
                      ) && (
                        <div className="text-lg">
                          <p>
                            {
                              SchoolAlotReceipt.individual_company
                                .indicomp_off_branch_address
                            }
                          </p>
                          <p>
                            {
                              SchoolAlotReceipt.individual_company
                                .indicomp_off_branch_area
                            }
                          </p>
                          <p>
                            {
                              SchoolAlotReceipt.individual_company
                                .indicomp_off_branch_ladmark
                            }
                          </p>
                          <p>
                            {
                              SchoolAlotReceipt.individual_company
                                .indicomp_off_branch_city
                            }{" "}
                            -{" "}
                            {
                              SchoolAlotReceipt.individual_company
                                .indicomp_off_branch_pin_code
                            }
                            ,
                            {
                              SchoolAlotReceipt.individual_company
                                .indicomp_off_branch_state
                            }
                          </p>
                        </div>
                      )}
                      {SchoolAlotReceipt.individual_company.hasOwnProperty(
                        "indicomp_res_reg_address"
                      ) && (
                        <div className="text-lg">
                          <p>
                            {
                              SchoolAlotReceipt.individual_company
                                .indicomp_res_reg_address
                            }
                          </p>
                          <p>
                            {
                              SchoolAlotReceipt.individual_company
                                .indicomp_res_reg_area
                            }
                          </p>
                          <p>
                            {
                              SchoolAlotReceipt.individual_company
                                .indicomp_res_reg_ladmark
                            }
                          </p>
                          <p>
                            {
                              SchoolAlotReceipt.individual_company
                                .indicomp_res_reg_city
                            }{" "}
                            -{" "}
                            {
                              SchoolAlotReceipt.individual_company
                                .indicomp_res_reg_pin_code
                            }
                            ,
                            {
                              SchoolAlotReceipt.individual_company
                                .indicomp_res_reg_state
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <label className="flex my-4  text-lg">
                    {SchoolAlotReceipt?.individual_company?.indicomp_gender ===
                      "Female" && <>Respected Madam,</>}
                    {SchoolAlotReceipt?.individual_company?.indicomp_gender ===
                      "Male" && <>Respected Sir,</>}
                    {SchoolAlotReceipt?.individual_company?.indicomp_gender ==
                      null && <>Respected Sir,</>}
                  </label>

                  <div className="text-lg">
                    <div className=" mb-5 text-justify">
                      <label>
                        <b>
                          “Giving is not just about making donation, it’s about
                          making a difference”
                        </b>
                        <span>
                          {" "}
                          , we are able to bring about this difference only
                          because of the support of our kind donors. Your
                          support to FTS gives wings to the dreams of the little
                          children studying in Ekal Vidyalaya. We express our
                          sincere thanks and gratitude to you for adopting
                          <b>" One Teacher School " (OTS)</b> and thus helping
                          us in providing light of education to the weaker
                          sections of the society.
                        </span>
                      </label>
                    </div>
                    <div className="my-4 text-justify">
                      {" "}
                      <label>
                        Please find enclosed herewith details of the Ekal
                        Vidyalaya running with your assistance. You may also
                        view the details through our website: www.ekal.org.
                        Please click on <b>INSIGHTS</b> and enter your user ID{" "}
                        <b>
                          {SchoolAlotReceipt?.individual_company
                            ?.indicomp_fts_code || ""}
                        </b>{" "}
                        and Password{" "}
                        <b>
                          {SchoolAlotReceipt?.individual_company
                            ?.indicomp_password || ""}
                        </b>
                        .
                      </label>
                    </div>

                    <label className="flex my-4">
                      Please find enclosed herewith:
                    </label>

                    <label className="flex my-4">
                      • List of your adopted schools
                    </label>
                    <label className="flex my-4">
                      We hope to get your continued patronage for serving the
                      society.
                    </label>
                  </div>
                  <div className="text-lg">
                    <label className="flex my-4">
                      Thanking you once again!!
                    </label>
                    <label className="flex my-4">With Regards,</label>
                  </div>
                  <div className="my-2 mb-3 text-justify  text-lg">
                    <label className="flex my-4">Niraj Harodia</label>
                    <label className="flex my-4">(Secretary)</label>
                  </div>
                </div>

                <div>
                  <div className="invoice-logo">
                    <div className="flex justify-center">
                      <img
                        src={Logo2}
                        alt="session-logo"
                        width="300"
                        height="300"
                        className="mb-2"
                      />
                    </div>
                  </div>
                  <div className="text-center text-sm">
                    <label>
                      <small>
                        Head Office: Ekal Bhawan, 123/A, Harish Mukherjee Road,
                        Kolkata-26. Web: www.ftsindia.com Ph: 033 - 2454
                        4510/11/12/13 PAN: AAAAF0290L
                      </small>
                    </label>
                  </div>
                </div>
                {/* page break from here  */}

                <div className="page-break">
                  <div className="flex justify-between items-center mb-4  mt-12">
                    <div className="invoice-logo">
                      <img
                        src={Logo1}
                        alt="session-logo"
                        width="80"
                        height="80"
                      />
                    </div>

                    <div className="invoice-logo text-right">
                      <img
                        src={Logo3}
                        alt="session-logo"
                        width="80"
                        height="80"
                      />
                    </div>
                  </div>

                  <div>
                    <div>
                      <label>
                        Donor Id : {SchoolAlotReceipt.indicomp_fts_id}
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      {SchoolAlotReceipt?.individual_company?.indicomp_type !==
                        "Individual" && (
                        <label>
                          Donor Name :{" "}
                          {
                            SchoolAlotReceipt?.individual_company
                              ?.indicomp_full_name
                          }
                        </label>
                      )}

                      {SchoolAlotReceipt?.individual_company?.indicomp_type ===
                        "Individual" && (
                        <label>
                          Donor Name :{" "}
                          {
                            SchoolAlotReceipt?.individual_company
                              ?.indicomp_full_name
                          }
                        </label>
                      )}
                    </div>
                    <div>
                      <label>
                        No of Schools :
                        {OTSReceipts.map((otsreceipt, key) => (
                          <> {otsreceipt.receipt_no_of_ots}</>
                        ))}
                      </label>
                    </div>
                  </div>
                  <div className="my-5 overflow-x-auto mb-14">
                    <table className="min-w-full border-collapse border border-black">
                      <thead>
                        <tr className="bg-gray-200 ">
                          {[
                            "STATE",
                            "ANCHAL  CLUSTER",
                            "STATE",
                            "SUB CLUSTER",
                            "VILLAGE",
                            "TEACHER",
                            "BOYS",
                            "GIRLS  ",
                            "TOTAL",
                          ].map((header) => (
                            <th
                              key={header}
                              className="border border-black px-1 py-1 text-center text-[10px]"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(SchoolAlotView) &&
                          SchoolAlotView.map((dataSumm) => (
                            <tr key={dataSumm.id}>
                              <td className="border border-black px-2 py-2 text-xs">
                                {dataSumm.school_state}
                              </td>
                              <td className="border border-black px-2 py-2 text-xs">
                                {dataSumm.achal}
                              </td>
                              <td className="border border-black px-2 py-2 text-xs">
                                {dataSumm.cluster}
                              </td>
                              <td className="border border-black px-2 py-2 text-xs">
                                {dataSumm.sub_cluster}
                              </td>
                              <td className="border border-black px-2 py-2 text-xs">
                                {dataSumm.village}
                              </td>
                              <td className="border border-black px-2 py-2 text-xs">
                                {dataSumm.teacher}
                              </td>
                              <td className="border border-black px-2 py-2 text-xs">
                                {dataSumm.boys}
                              </td>
                              <td className="border border-black px-2 py-2 text-xs">
                                {dataSumm.girls}
                              </td>
                              <td className="border border-black px-2 py-2 text-xs">
                                {dataSumm.total}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <div className="invoice-logo">
                      <div className="flex justify-center">
                        <img
                          src={Logo2}
                          alt="session-logo"
                          width="300"
                          height="300"
                          className="mb-4"
                        />
                      </div>
                    </div>
                    <div className="text-center text-sm">
                      <label>
                        <small>
                          Head Office: Ekal Bhawan, 123/A, Harish Mukherjee
                          Road, Kolkata-26. Web: www.ftsindia.com Ph: 033 - 2454
                          4510/11/12/13 PAN: AAAAF0290L
                        </small>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SchoolAllotLetter;
