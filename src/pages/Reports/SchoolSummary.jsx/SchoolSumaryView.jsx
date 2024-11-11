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
import { IoIosPrint } from "react-icons/io";
import { LuDownload } from "react-icons/lu";

const SchoolSumaryView = (props) => {
  const componentRef = useRef();
  const [SchoolAlotReceipt, setSchoolAlotReceipt] = useState({});
  const [chapter, setChapter] = useState({});
  const [SchoolAlotView, setSchoolAlotView] = useState({});
  const [OTSReceipts, setOTSReceipts] = useState({});
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const id = localStorage.getItem("schl_sum_viw");
      try {
        const res = await axios.get(
          `${BASE_URL}/api/fetch-schoolsallot-receipt-by-id/${id}`,
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
                <div className="flex items-center space-y-4 self-end md:flex-row md:justify-between sm:space-y-0 md:space-x-4">
                  <PageTitleBar
                    title="School Summary"
                    match={props.match}
                    icon={FaArrowLeft}
                    backLink="/report/school"
                  />
                  <div
                    className="flex"
                    style={{
                      display:
                        localStorage.getItem("user_type_id") == 4 ? "none" : "",
                    }}
                  >
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
                        <b className="text-lg text-gray-600">SCHOOL SUMMARY</b>
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
      )}
    </Layout>
  );
};

export default SchoolSumaryView;
