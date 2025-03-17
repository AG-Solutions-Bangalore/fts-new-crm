import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import PageTitleBar from "../../../components/common/PageTitle";
import BASE_URL from "../../../base/BaseUrl";
import { Button, Spinner } from "@material-tailwind/react";
import Layout from "../../../layout/Layout";
import Moment from "moment";
import image1 from "../../../assets/receipt/fts.png";
import image2 from "../../../assets/receipt/top.png";
import image3 from "../../../assets/receipt/ekal.png";
import { FaArrowLeft, FaFilePdf } from "react-icons/fa6";
import { IoIosPrint } from "react-icons/io";
import { LuDownload } from "react-icons/lu";
import { IconArrowBack } from "@tabler/icons-react";
import ReactToPrint from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { SUMMARY_VIEW } from "../../../api";

const printStyles = `
  @media print {




    /* Print content with 20px margin */
    .print-content {
      margin: 40px !important; /* Apply 20px margin to the printed content */

      }



  }
`;
const SchoolSumaryView = (props) => {
  const componentRef = useRef();
  const [SchoolAlotReceipt, setSchoolAlotReceipt] = useState({});
  const [chapter, setChapter] = useState({});
  const [SchoolAlotView, setSchoolAlotView] = useState({});
  const [OTSReceipts, setOTSReceipts] = useState({});
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const id = localStorage.getItem("schl_sum_viw");
      try {
        const res = await axios.get(
          `${SUMMARY_VIEW}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSchoolAlotReceipt(res.data.SchoolAlotReceipt);
        setChapter(res.data.chapter);
        setSchoolAlotView(res.data.SchoolAlotView);
        setOTSReceipts(res.data.OTSReceipts);
      } catch (error) {
        setError("Error fetching promoter summary. Please try again.");
        console.error("Error fetching promoter summary:", error);
      } finally {
        setLoader(false);
      }
    };

    fetchData();
  }, []);
  const handleSavePDF = () => {
    const input = tableRef.current;

    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const margin = 20;

        const availableWidth = pdfWidth - 2 * margin;

        const ratio = Math.min(
          availableWidth / imgWidth,
          pdfHeight / imgHeight
        );

        const imgX = margin;
        const imgY = margin;

        pdf.addImage(
          imgData,
          "PNG",
          imgX,
          imgY,
          imgWidth * ratio,
          imgHeight * ratio
        );

        pdf.save("SCHOOL SUMMARY.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF: ", error);
      });
  };

  const mergeRefs =
    (...refs) =>
    (node) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      });
    };

  useEffect(() => {
    // Add print styles to document head
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = printStyles;
    document.head.appendChild(styleSheet);

    // Cleanup on unmount
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);
  return (
    <Layout>
      {loader && (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      )}
      {!loader && error && (
        <div className="text-red-600 text-center">{error}</div>
      )}
      {!loader && !error && (
        <div className="invoice-wrapper">
          <div className="flex flex-col items-center">
            <div className="w-full mx-auto ">
              <div className="bg-white shadow-md rounded-lg p-6 overflow-x-auto  grid sm:grid-cols-1 1fr">
                <div className="flex items-center space-y-4 self-end md:flex-row justify-between sm:space-y-0 md:space-x-4 px-2  mb-4 border-b-2 border-green-500 rounded-lg  bg-[#E1F5FA]">
                  <PageTitleBar
                    title="School Summary"
                    match={props.match}
                    icon={IconArrowBack}
                    backLink="/report/school"
                  />
                  <div
                    className="flex space-x-8"
                    style={{
                      display:
                        localStorage.getItem("user_type_id") == 4 ? "none" : "",
                    }}
                  >
                    <button
                      variant="text"
                      className="flex items-center space-x-2"
                      onClick={handleSavePDF}
                    >
                      <FaFilePdf className="text-lg" />
                      <span className="text-lg font-semibold  ">PDF</span>
                    </button>
                    <ReactToPrint
                      trigger={() => (
                        <button
                          variant="text"
                          className="flex items-center space-x-2"
                        >
                          <IoIosPrint className="text-lg" />
                          <span className="text-lg font-semibold  ">
                            Print Letter
                          </span>
                        </button>
                      )}
                      content={() => componentRef.current}
                    />
                  </div>
                </div>
                <hr className="mb-6"></hr>
                <div
                  ref={mergeRefs(componentRef, tableRef)}
                  className="print-content"
                >
                  <div className="flex justify-between items-center mb-4 ">
                    <div className="invoice-logo">
                      <img
                        src={image1}
                        alt="session-logo"
                        width="80"
                        height="80"
                      />
                    </div>
                    <div className="address text-center">
                      <img src={image2} alt="session-logo" width="320px" />
                      <h2 className="pt-3">
                        <strong>
                          <b className="text-xl text-[#464D69]">
                            SCHOOL SUMMARY
                          </b>
                        </strong>
                      </h2>
                    </div>
                    <div className="invoice-logo text-right">
                      <img
                        src={image3}
                        alt="session-logo"
                        width="80"
                        height="80"
                      />
                    </div>
                  </div>
                  {/* <div>
                    <div>
                      <label>
                        Donor Id : {SchoolAlotReceipt.indicomp_fts_id}
                      </label>
                    </div>
                  </div>
                  //////{" "}
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
                  ////// */}
                  <div className="flex justify-between mb-6">
                    <div>
                      <p className="font-bold">
                        Donor Id :{" "}
                        <span className="font-normal">
                          {SchoolAlotReceipt.indicomp_fts_id}
                        </span>
                      </p>
                      <p className="font-bold">
                        Donor Name:{" "}
                        <span className="font-normal">
                          {SchoolAlotReceipt?.individual_company
                            ?.indicomp_type !== "Individual"
                            ? SchoolAlotReceipt?.individual_company
                                ?.indicomp_full_name
                            : SchoolAlotReceipt?.individual_company
                                ?.indicomp_full_name}
                        </span>
                      </p>

                      {SchoolAlotReceipt?.individual_company?.indicomp_type ===
                        "Individual" && (
                        <p className="font-bold">
                          Contact Person/Spouse:{" "}
                          <span className="font-normal">
                            {
                              SchoolAlotReceipt?.individual_company
                                ?.indicomp_spouse_name
                            }
                          </span>
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="font-bold">
                        No of Schools:{" "}
                        {OTSReceipts.map((otsreceipt, key) => (
                          <span key={key} className="font-normal">
                            {otsreceipt.receipt_no_of_ots}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                  <div className="my-5 overflow-x-auto mb-14">
                    <table className="min-w-full border-collapse border border-black">
                      <thead>
                        <tr className="bg-gray-200">
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
                              className="border border-black px-4 py-2 text-center text-xs"
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
                              <td className="border border-black px-4 py-2 text-xs">
                                {dataSumm.school_state}
                              </td>
                              <td className="border border-black px-4 py-2 text-xs">
                                {dataSumm.achal}
                              </td>
                              <td className="border border-black px-4 py-2 text-xs">
                                {dataSumm.cluster}
                              </td>
                              <td className="border border-black px-4 py-2 text-xs">
                                {dataSumm.sub_cluster}
                              </td>
                              <td className="border border-black px-4 py-2 text-xs">
                                {dataSumm.village}
                              </td>
                              <td className="border border-black px-4 py-2 text-xs">
                                {dataSumm.teacher}
                              </td>
                              <td className="border border-black px-4 py-2 text-xs">
                                {dataSumm.boys}
                              </td>
                              <td className="border border-black px-4 py-2 text-xs">
                                {dataSumm.girls}
                              </td>
                              <td className="border border-black px-4 py-2 text-xs">
                                {dataSumm.total}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default SchoolSumaryView;
