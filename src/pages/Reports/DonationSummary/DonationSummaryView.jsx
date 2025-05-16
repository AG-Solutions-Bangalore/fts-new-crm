import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import PageTitleBar from "../../../components/common/PageTitle";
import BASE_URL from "../../../base/BaseUrl";
import { Button, Spinner } from "@material-tailwind/react";
import Layout from "../../../layout/Layout";
import image1 from "../../../assets/receipt/fts.png";
import image2 from "../../../assets/receipt/top.png";
import image3 from "../../../assets/receipt/ekal.png";
import { FaArrowLeft, FaFilePdf } from "react-icons/fa6";
import CustomPivotTable from "./CustomPivotTable";
import { IoIosPrint } from "react-icons/io";
import { LuDownload } from "react-icons/lu";
import { IconArrowBack } from "@tabler/icons-react";
import ReactToPrint from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { DONATION_SUMMARY_VIEW } from "../../../api";

const printStyles = `
  @media print {




    /* Print content with 20px margin */
    .print-content {
      margin: 40px !important; /* Apply 20px margin to the printed content */

      }



  }
`;
const DonationSummaryView = (props) => {
  const [donorsummary, setSummary] = useState([]);
  const [receiptsummary, setReceiptSummary] = useState({});
  const componentRef = useRef();
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const from_date = localStorage.getItem("receipt_from_date");
    const to_date = localStorage.getItem("receipt_to_date");

    // console.log(from_date, to_date);

    const fetchData = async () => {
      if (!from_date || !to_date) {
        console.error("Promoter or date parameters are missing.");
        return;
      }

      try {
        const response = await axios.get(
          `${DONATION_SUMMARY_VIEW}/${from_date}/${to_date}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSummary(response.data.receipt);
      } catch (error) {
        setError("Error fetching promoter summary. Please try again.");
        console.error("Error fetching promoter summary:", error);
      } finally {
        setLoader(false);
      }
    };

    fetchData();
  }, []);
  const dataSourceSettings = {
    columns: [{ name: "receipt_donation_type", caption: "Donation Type" }],
    dataSource: receiptsummary,
    expandAll: true,
    filters: [],
    rows: [{ name: "receipt_financial_year" }],
    values: [{ name: "total_amount", caption: "Amount" }],
    showCaption: false,
  };
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

        pdf.save("Donation Summary.pdf");
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
                    title="Donation Summary"
                    match={props.match}
                    icon={IconArrowBack}
                    backLink="/report/donation"
                  />
                  <div className="flex space-x-8 ">
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
                            DONATION SUMMARY
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

                  <div>
                    <CustomPivotTable data={donorsummary} />
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

export default DonationSummaryView;
