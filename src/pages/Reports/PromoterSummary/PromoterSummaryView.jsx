import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import PageTitle from "../../../components/common/PageTitle";
import BASE_URL from "../../../base/BaseUrl";
import { Button, Spinner } from "@material-tailwind/react";
import Layout from "../../../layout/Layout";
import Moment from "moment";
import image1 from "../../../assets/receipt/fts.png";
import image2 from "../../../assets/receipt/top.png";
import image3 from "../../../assets/receipt/ekal.png";
import { FaArrowLeft } from "react-icons/fa6";
import CustomPivotTable from "./CustomPivotTable";
import { IoIosPrint } from "react-icons/io";
import { LuDownload } from "react-icons/lu";

const PromoterSummaryView = (props) => {
  const [donorsummary, setSummary] = useState([]);
  const [receiptsummary, setReceiptSummary] = useState({});
  const [receiptsummaryfooterOTS, setReceiptSummaryFooterOTS] = useState([]);
  const [receiptsummaryfootertotal, setReceiptSummaryFooterTotal] = useState(
    []
  );
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const receiptFromDate = localStorage.getItem("receipt_from_date_prm");
      const receiptToDate = localStorage.getItem("receipt_to_date_prm");
      const indicompFullName = localStorage.getItem("indicomp_full_name_prm");
      try {
        const response = await axios.get(
          `${BASE_URL}/api/fetch-promotersummary-by-id/${indicompFullName}/${receiptFromDate}/${receiptToDate}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSummary(response.data.receipt);
        setReceiptSummary(response.data.receipt_total);
        setReceiptSummaryFooterOTS(response.data.receipt_grand_total_ots);
        setReceiptSummaryFooterTotal(response.data.receipt_grand_total_amount);
      } catch (error) {
        setError("Error fetching promoter summary. Please try again.");
        console.error("Error fetching promoter summary:", error);
      } finally {
        setLoader(false);
      }
    };

    fetchData();
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
      {/* <div>
        <ReactToPrint
          trigger={() => (
            <Button className="flex items-center border  border-blue-500 hover:border-green-500 hover:animate-pulse p-2 rounded-lg">
              Print
            </Button>
          )}
          content={() => componentRef.current}
        />
      </div> */}
      {!loader && !error && (
        <div className="invoice-wrapper">
          {/* <Button onClick={handleExportWithFunction}>PDF</Button> */}

          <div ref={printRef} className="flex flex-col items-center">
            <div className="w-full mx-auto ">
              <div className="bg-white shadow-md rounded-lg p-6 overflow-x-auto  grid sm:grid-cols-1 1fr ">
                <div className="flex items-center space-y-4 self-end md:flex-row md:justify-between sm:space-y-0 md:space-x-4">
                  <PageTitle
                    title="Promoter Summary"
                    match={props.match}
                    icon={FaArrowLeft}
                    backLink="/report/promoter"
                  />

                  <div className="flex ">
                    <Button
                      variant="text"
                      className="flex items-center space-x-2"
                    >
                      <LuDownload className="text-lg" />
                      <span>PDF</span>
                    </Button>

                    <Button
                      variant="text"
                      className="flex items-center space-x-2"
                    >
                      <IoIosPrint className="text-lg" />
                      <span>Print Letter</span>
                    </Button>
                  </div>
                </div>

                <hr className="mb-6"></hr>
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
                        <b className="text-lg text-gray-600">
                          PROMOTER SUMMARY
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
                          "Promoter",
                          "Donor Name",
                          "Contact",
                          "Mobile",
                          "Receipt No",
                          "Receipt Date",
                          "Year",
                          "Donation Type",
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
                            {dataSumm.indicomp_promoter}
                          </td>
                          <td className="border border-black px-4 py-2 text-xs">
                            {dataSumm.indicomp_full_name}
                          </td>
                          <td className="border border-black px-4 py-2 text-xs">
                            {dataSumm.indicomp_com_contact_name}
                          </td>
                          <td className="border border-black px-4 py-2 text-xs">
                            {dataSumm.indicomp_mobile_phone}
                          </td>
                          <td className="border border-black text-center text-xs">
                            {dataSumm.receipt_no}
                          </td>
                          <td className="border border-black text-center text-xs">
                            {Moment(dataSumm.receipt_date).format("DD-MM-YYYY")}
                          </td>
                          <td className="border border-black text-center text-xs">
                            {dataSumm.receipt_financial_year}
                          </td>
                          <td className="border border-black text-center text-xs">
                            {dataSumm.receipt_donation_type}
                          </td>
                          <td className="border border-black text-center text-xs">
                            {dataSumm.receipt_no_of_ots}
                          </td>
                          <td className="border border-black text-right px-4 text-xs">
                            {dataSumm.receipt_total_amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td
                          colSpan={8}
                          className="border border-black text-center font-bold text-xs"
                        >
                          Total
                        </td>
                        {receiptsummaryfooterOTS.map((footv, key) => (
                          <td className="border border-black text-center text-xs font-bold">
                            {footv.total_no_of_ots}
                          </td>
                        ))}

                        {receiptsummaryfootertotal.map((foota, key) => (
                          <td className="border border-black text-right px-4 text-xs font-bold">
                            {foota.total_grand_amount}{" "}
                          </td>
                        ))}
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div>
                  <div className="flex justify-center mb-4 mt-4">
                    <b className="text-lg text-gray-600 ">TOTAL</b>{" "}
                  </div>
                  <CustomPivotTable data={donorsummary} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default PromoterSummaryView;
