import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button, Spinner } from "@material-tailwind/react";
import Moment from "moment";
import PageTitleBar from "../../../../components/common/PageTitle";
import image1 from "../../../../assets/receipt/fts.png";
import image2 from "../../../../assets/receipt/top.png";
import image3 from "../../../../assets/receipt/ekal.png";
import Layout from "../../../../layout/Layout";
import BASE_URL from "../../../../base/BaseUrl";
import { FaArrowLeft } from "react-icons/fa6";
import { IoIosPrint } from "react-icons/io";
import { LuDownload } from "react-icons/lu";

const NopanView = (props) => {
  const componentRef = useRef();
  const [donorSummary, setDonorSummary] = useState([]);

  const [loader, setLoader] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let data = {
      receipt_from_date: localStorage.getItem("receipt_from_date"),
      receipt_to_date: localStorage.getItem("receipt_to_date"),
      receiptyear: localStorage.getItem("receiptyear"),
    };

    axios({
      url: BASE_URL + "/api/fetch-donor-receipt-by-year-no-pan",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setDonorSummary(res.data.receipt);
      setLoader(false);
    });
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
            title="Receipt Document"
            icon={FaArrowLeft}
            match={props.match}
            backLink="/report/otg"
          />
          <div className="flex flex-col items-center">
            <div className="w-full mx-auto">
              <div className="bg-white shadow-md rounded-lg p-6 overflow-x-auto grid sm:grid-cols-1 1fr">
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
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="invoice-logo">
                    <img src={image1} alt="logo" width="80" height="80" />
                  </div>
                  <div className="text-center">
                    <img src={image2} alt="header-logo" width="320px" />
                    <h2 className="pt-3 font-bold text-lg text-gray-600">
                      FORM No. 10BD
                    </h2>
                  </div>
                  <div className="invoice-logo text-right">
                    <img src={image3} alt="logo" width="80" height="80" />
                  </div>
                </div>

                {/* Table */}
                <div ref={componentRef} className="my-5">
                  <table className="min-w-full border-collapse border border-black">
                    <thead>
                      <tr className="bg-gray-200">
                        {[
                          "Unique Identification Number of the donor	",
                          "ID code",
                          "Section code",
                          "Name of donor",
                          "Address of donor",
                          "Donation Type",
                          "Mode of receipt",
                          "Amount of donation (Indian rupees)",
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
                      {donorSummary.map((dataSumm) => (
                        <tr key={dataSumm.id}>
                          <td className="border border-black px-4 py-2 text-xs">
                            {dataSumm.indicomp_pan_no}
                          </td>
                          <td className="border border-black px-4 py-2 text-xs">
                            1
                          </td>
                          <td className="border border-black px-4 py-2 text-xs">
                            Section 80G
                          </td>
                          <td className="border border-black px-4 py-2 text-xs">
                            {dataSumm.indicomp_type !== "Individual" && (
                              <>M/s {dataSumm.indicomp_full_name} </>
                            )}
                            {dataSumm.indicomp_type === "Individual" && (
                              <>
                                {dataSumm.title} {dataSumm.indicomp_full_name}
                              </>
                            )}
                          </td>

                          <td className="border border-black text-center text-xs">
                            {dataSumm.indicomp_corr_preffer == "Residence" && (
                              <>
                                {dataSumm.indicomp_res_reg_address}
                                {" ,"}
                                {dataSumm.indicomp_res_reg_area}
                                {" ,"}
                                {dataSumm.indicomp_res_reg_ladmark}
                                {" ,"}
                                {dataSumm.indicomp_res_reg_city}
                                {" - "}
                                {dataSumm.indicomp_res_reg_pin_code}
                                {" ,"}
                                {dataSumm.indicomp_res_reg_state}
                              </>
                            )}
                            {dataSumm.indicomp_corr_preffer == "Registered" && (
                              <>
                                {dataSumm.indicomp_res_reg_address}
                                {" ,"}
                                {dataSumm.indicomp_res_reg_area}
                                {" ,"}
                                {dataSumm.indicomp_res_reg_ladmark}
                                {" ,"}
                                {dataSumm.indicomp_res_reg_city}
                                {" - "}
                                {dataSumm.indicomp_res_reg_pin_code}
                                {" ,"}
                                {dataSumm.indicomp_res_reg_state}
                              </>
                            )}{" "}
                            {dataSumm.indicomp_corr_preffer == "Office" && (
                              <>
                                {dataSumm.indicomp_off_branch_address}
                                {" ,"}
                                {dataSumm.indicomp_off_branch_area}
                                {" ,"}
                                {dataSumm.indicomp_off_branch_ladmark}
                                {" ,"}
                                {dataSumm.indicomp_off_branch_city}
                                {" - "}
                                {dataSumm.indicomp_off_branch_pin_code}
                                {" ,"}
                                {dataSumm.indicomp_off_branch_state}
                              </>
                            )}
                            {dataSumm.indicomp_corr_preffer ==
                              "Branch Office" && (
                              <>
                                {dataSumm.indicomp_off_branch_address}
                                {" ,"}
                                {dataSumm.indicomp_off_branch_area}
                                {" ,"}
                                {dataSumm.indicomp_off_branch_ladmark}
                                {" ,"}
                                {dataSumm.indicomp_off_branch_city}
                                {" - "}
                                {dataSumm.indicomp_off_branch_pin_code}
                                {" ,"}
                                {dataSumm.indicomp_off_branch_state}
                              </>
                            )}
                          </td>
                          <td className="border border-black text-center text-xs">
                            {dataSumm.receipt_donation_type}
                          </td>
                          <td className="border border-black text-center text-xs">
                            {dataSumm.receipt_tran_pay_mode}
                          </td>
                          <td className="border border-black text-center text-xs">
                            {dataSumm.receipt_total_amount}
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

export default NopanView;
