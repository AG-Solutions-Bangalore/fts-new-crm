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

const SuspenseSummary = (props) => {
  const componentRef = useRef();
  const [donorsummary, setSummary] = useState([]);
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/fetch-receipt-suspense-summary`,
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
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {};

    axios({
      url: BASE_URL + "/api/download-receipt-suspense-summary",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        console.log("data : ", res.data);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "receipt_suspense_count.csv");
        document.body.appendChild(link);
        link.click();
        toast.success("Suspense Count is Downloaded Successfully");
      })
      .catch((err) => {
        toast.error("Suspense Count is Not Downloaded");
      });
  };
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
            title="Suspense Summary"
            match={props.match}
            icon={FaArrowLeft}
            backLink="/report/otg"
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
                    onClick={onSubmit}
                  >
                    <LuDownload className="text-lg" />
                    <span>Download</span>
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
                        <b className="text-lg text-gray-600">
                          SUSPENSE SUMMARY
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

                <div ref={componentRef} className="my-5">
                  <table className="min-w-full border-collapse border border-black">
                    <thead>
                      <tr className="bg-gray-200">
                        {["CHAPTER", "YEAR", "TOTAL"].map((header) => (
                          <th
                            key={header}
                            className="border border-black px-4 py-2 text-center text-sm md:text-base"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {donorsummary.map((dataSumm) => (
                        <tr key={dataSumm.id}>
                          <td className="border border-black px-4 py-2 text-sm md:text-base">
                            {dataSumm.chapter_name}
                          </td>
                          <td className="border border-black px-4 py-2 text-sm md:text-base">
                            {dataSumm.receipt_financial_year}
                          </td>
                          <td className="border border-black px-4 py-2 text-sm md:text-base">
                            {dataSumm.receipt_total_count}
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

export default SuspenseSummary;
