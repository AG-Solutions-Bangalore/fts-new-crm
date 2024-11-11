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
import { FaArrowLeft } from "react-icons/fa6";
import { NumericFormat } from "react-number-format";
import { IoIosPrint } from "react-icons/io";
import { LuDownload } from "react-icons/lu";

const PaymentView = (props) => {
  const componentRef = useRef();
  const [donorsummary, setSummary] = useState([]);
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const receiptFromDate = localStorage.getItem("receipt_from_date_pay");
      const receiptToDate = localStorage.getItem("receipt_to_date_pay");
      try {
        const response = await axios.get(
          `${BASE_URL}/api/fetch-teacher-payment-summary-by-date/${receiptFromDate}/${receiptToDate}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSummary(response.data.ots_expensive);
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
      {!loader && !error && (
        <div className="invoice-wrapper">
          <PageTitleBar
            title="Payment Summary"
            match={props.match}
            icon={FaArrowLeft}
            backLink="/report/payment"
          />
          <div className="flex flex-col items-center">
            <div className="w-full mx-auto ">
              <div className="bg-white shadow-md rounded-lg p-6 overflow-x-auto  grid sm:grid-cols-1 1fr">
                <div className="flex items-center space-y-4 self-end md:flex-row md:justify-end md:space-y-0 md:space-x-4">
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
                        <b className="text-lg text-gray-600">PAYMENT SUMMARY</b>
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

                <div ref={componentRef} className="my-5">
                  <table className="min-w-full border-collapse border border-black">
                    <thead>
                      <tr className="bg-gray-200">
                        {["Anchal	", "Purposes	", "Amount", "Total"].map(
                          (header) => (
                            <th
                              key={header}
                              className="border border-black px-4 py-2 text-center text-sm md:text-base"
                            >
                              {header}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {donorsummary.map((dataSumm) => (
                        <tr key={dataSumm.id}>
                          <td className="border border-black px-4 py-2 text-sm md:text-base">
                            {dataSumm.expenses_anchal}
                          </td>
                          <td className="border border-black px-4 py-2 text-sm md:text-base">
                            {dataSumm.expenses_purposes}
                          </td>
                          <td className="border border-black px-4 py-2 text-sm md:text-base">
                            {dataSumm.total_amount}
                          </td>{" "}
                          <td className="border border-black px-4 py-2 text-sm md:text-base">
                            <NumericFormat
                              thousandSeparator={true}
                              thousandsGroupStyle="lakh"
                              displayType={"text"}
                              prefix={"₹ "}
                              value={dataSumm.total_amount}
                            />
                            <NumericFormat
                              thousandSeparator={true}
                              thousandsGroupStyle="lakh"
                              displayType={"text"}
                              prefix={"₹ "}
                              value={
                                dataSumm.total_amount /
                                dataSumm.school.total_count
                              }
                            />
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
      )}
    </Layout>
  );
};

export default PaymentView;
