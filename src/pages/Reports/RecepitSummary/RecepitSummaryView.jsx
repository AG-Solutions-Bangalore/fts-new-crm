import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import PageTitleBar from "../../../components/common/PageTitle";
import BASE_URL from "../../../base/BaseUrl";
import { Button, Spinner } from "@material-tailwind/react";
import Layout from "../../../layout/Layout";
import image1 from "../../../assets/receipt/fts.png";
import image2 from "../../../assets/receipt/top.png";
import image3 from "../../../assets/receipt/ekal.png";
import { NumericFormat } from "react-number-format";
import { FaArrowLeft, FaFilePdf } from "react-icons/fa6";
import { IoIosPrint } from "react-icons/io";
import { LuDownload } from "react-icons/lu";
import { IconArrowBack } from "@tabler/icons-react";
import ReactToPrint from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const printStyles = `
  @media print {




    /* Print content with 20px margin */
    .print-content {
      margin: 40px !important; /* Apply 20px margin to the printed content */

      }



  }
`;
const RecepitSummaryView = (props) => {
  const componentRef = useRef();
  const [donorsummary, setSummary] = useState([]);
  const [receiptsummary, setReceiptSummary] = useState({});
  const [grandtotal, setGrandtotal] = useState({});

  const [grandots, setGrandots] = useState([]);
  const [receiptTotalOTS, setReceiptTotalOTS] = useState([]);

  const [totalsummarygeneral, setTotalGeneral] = useState({});

  const [receiptTotalMembership, setReceiptTotalMembership] = useState([]);
  const [receiptsummaryfootertotal, setReceiptSummaryFooterTotal] = useState(
    []
  );
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const receiptFromDate = localStorage.getItem("receipt_from_date_recp");
      const receiptToDate = localStorage.getItem("receipt_to_date_recp");
      try {
        const response = await axios.get(
          `${BASE_URL}/api/fetch-receiptsummary-by-id/${receiptFromDate}/${receiptToDate}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSummary(response.data.receipt);
        setReceiptSummary(response.data.receiptTotal);
        setGrandots(response.data.receipt_grand_total_ots);
        setTotalGeneral(response.data.recveiptTotalGeneral);
        setReceiptSummaryFooterTotal(response.data.receipt_grand_total_amount);
        setReceiptTotalOTS(response.data.receiptTotalOTS);
        setReceiptTotalMembership(response.data.receiptTotalMembership);
        setGrandtotal(response.data.receipt_grand_total_count);
        console.log(response.data.receipt_grand_total_count);
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

        pdf.save("Recepit Summary.pdf");
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
                    title="Recepit Summary"
                    icon={IconArrowBack}
                    match={props.match}
                    backLink="/report/recepit"
                  />
                  <div className="flex space-x-8 ">
                    <button
                      variant="text"
                      className="flex items-center space-x-2"
                      onClick={handleSavePDF}
                    >
                      <FaFilePdf className="text-lg" />
                      <span className="text-lg font-semibold">PDF</span>
                    </button>
                    <ReactToPrint
                      trigger={() => (
                        <button
                          variant="text"
                          className="flex items-center space-x-2"
                        >
                          <IoIosPrint className="text-lg" />
                          <span className="text-lg font-semibold">
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
                            RECEPIT SUMMARY
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

                  <div className="my-5">
                    <table className="min-w-full border-collapse border border-black">
                      <thead>
                        <tr className="bg-gray-200">
                          {[
                            "Month",
                            "Recepit Type",
                            "No of Recpits",
                            "No of OTS",
                            "Amount",
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
                        {donorsummary.map((dataSumm) => (
                          <tr key={dataSumm.id}>
                            <td className="border border-black px-4 py-2 text-xs">
                              {dataSumm.month_year}
                            </td>
                            <td className="border border-black px-4 py-2 text-xs">
                              {dataSumm.receipt_donation_type}
                            </td>
                            <td className="border border-black px-4 py-2 text-xs text-center">
                              {dataSumm.total_count}
                            </td>
                            <td className="border border-black px-4 py-2 text-xs text-center">
                              {dataSumm.total_ots}
                            </td>

                            <td className="border border-black text-right px-4 text-xs ">
                              <NumericFormat
                                value={dataSumm.total_amount}
                                displayType={"text"}
                                thousandSeparator={true}
                                thousandsGroupStyle="lakh"
                                prefix={"₹"}
                                decimalScale={0}
                                fixedDecimalScale={true}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td
                            colSpan={2}
                            className="border border-black text-center font-bold text-xs"
                          >
                            Total
                          </td>
                          {grandtotal.map((grandcount, key) => (
                            <td className="border border-black px-4 py-2 text-xs font-bold text-center">
                              {grandcount.total_grand_count}
                            </td>
                          ))}
                          {grandots.map((footv, key) => (
                            <td className="border border-black px-4 py-2 text-xs font-bold text-center">
                              {footv.total_no_of_ots}
                            </td>
                          ))}

                          {receiptsummaryfootertotal.map((foota, key) => (
                            <td className="border border-black text-right px-4  py-2 text-xs font-bold">
                              <NumericFormat
                                value={foota.total_grand_amount}
                                displayType={"text"}
                                thousandSeparator={true}
                                thousandsGroupStyle="lakh"
                                prefix={"₹"}
                                decimalScale={0}
                                fixedDecimalScale={true}
                              />
                            </td>
                          ))}
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div className="grid grid-cols-4 my-7">
                    <div className="col-xl-3 flex items-center flex-col mb-4 md:mb-0">
                      <b className="items-center text-center">
                        One Teacher School
                      </b>
                      {receiptTotalOTS.map((grandcount, key) => (
                        <NumericFormat
                          thousandSeparator={true}
                          thousandsGroupStyle="lakh"
                          displayType={"text"}
                          prefix={"₹ "}
                          value={grandcount.total_ots_donation}
                          className="mt-2"
                        />
                      ))}
                    </div>

                    <div className="col-xl-3 flex items-center flex-col mb-4 md:mb-0">
                      <b className="items-center text-center">
                        Membership Fees
                      </b>
                      {receiptTotalMembership.map((grandcount, key) => (
                        <NumericFormat
                          thousandSeparator={true}
                          thousandsGroupStyle="lakh"
                          displayType={"text"}
                          prefix={"₹ "}
                          value={grandcount.total_membership_donation}
                          className="mt-2"
                        />
                      ))}
                    </div>

                    <div className="col-xl-3 flex items-center flex-col mb-4 md:mb-0">
                      <b className="items-center text-center">Gn. Donation</b>
                      {totalsummarygeneral.map((grandcount, key) => (
                        <NumericFormat
                          thousandSeparator={true}
                          thousandsGroupStyle="lakh"
                          displayType={"text"}
                          prefix={"₹ "}
                          value={grandcount.total_general_donation}
                          className="mt-2"
                        />
                      ))}
                    </div>

                    <div className="col-xl-3 flex items-center flex-col mb-4 md:mb-0">
                      <b className="items-center text-center">Total</b>
                      {receiptsummary.map((grandcount, key) => (
                        <NumericFormat
                          thousandSeparator={true}
                          thousandsGroupStyle="lakh"
                          displayType={"text"}
                          prefix={"₹ "}
                          value={grandcount.total_donation}
                          className="mt-2"
                        />
                      ))}
                    </div>
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

export default RecepitSummaryView;
