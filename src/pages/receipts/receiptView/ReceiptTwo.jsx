import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
import { toast } from "react-toastify";
import numWords from "num-words";
import moment from "moment";
import ReactToPrint from "react-to-print";
import { IoIosPrint } from "react-icons/io";

const ReceiptTwo = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const componentRef = useRef();
  const [viewerId, setID] = useState(0);
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [viewerChapterIds, setViewerChapterIds] = useState([]);
  const [schoolIds, setSchoolIds] = useState("");
  const [chapters, setChapters] = useState([]);
  const [currentViewerChapterIds, setCurrentViewerChapterIds] = useState([]);

  const [states, setStates] = useState([]);

  const [receipts, setReceipts] = useState({});
  const [chapter, setChapter] = useState({});
  const [authsign, setSign] = useState({});
  const amountInWords = numWords(receipts.receipt_total_amount);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("id");
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/fetch-receipt-by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setReceipts(res.data.receipt);
        setSign(res.data.auth_sign);
        setChapter(res.data.chapter);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/fetch-states`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setStates(res.data?.states);
      });
  }, []);

  return (
    <div className=" flex justify-center">
      <div className="p-6 mt-5 bg-white shadow-md rounded-lg md:w-[86%]">
        <div className="p-2 flex justify-end ">
          <ReactToPrint
            trigger={() => (
              <button className="flex items-center space-x-2 ">
                <IoIosPrint className="text-lg" />
                <span>Print Letter</span>
              </button>
            )}
            content={() => componentRef.current}
          />
        </div>
        <hr className="border-b border-blue-gray-400" />
        <div ref={componentRef} className="p-10" style={{ margin: "5px" }}>
          <div
            className="flex justify-between"
            style={{
              marginTop: "3.5cm",
              fontSize: "21px",
            }}
          >
            <div className="text-[#464D69] md:text-xl text-sm">
              <label className="!my-4">
                Date: {moment(receipts.receipt_date).format("DD-MM-YYYY")}
              </label>

              {Object.keys(receipts).length !== 0 && (
                <div className="mt-2 ">
                  {receipts.receipt_donation_type !== "Membership" &&
                    receipts.individual_company.indicomp_type !==
                      "Individual" && (
                      <p className="mb-0 text-xl">
                        {receipts.individual_company.title}{" "}
                        {receipts.individual_company.indicomp_com_contact_name}
                      </p>
                    )}

                  {receipts.individual_company.indicomp_type !==
                    "Individual" && (
                    <p className="mb-0 text-xl">
                      M/s {receipts.individual_company.indicomp_full_name}
                    </p>
                  )}

                  {receipts.individual_company.indicomp_type ===
                    "Individual" && (
                    <p className="mb-0 text-xl">
                      {receipts.individual_company.title}{" "}
                      {receipts.individual_company.indicomp_full_name}
                    </p>
                  )}

                  {receipts.individual_company.indicomp_off_branch_address && (
                    <div>
                      <p className="mb-0 text-xl">
                        {
                          receipts.individual_company
                            .indicomp_off_branch_address
                        }
                      </p>
                      <p className="mb-0 text-xl">
                        {receipts.individual_company.indicomp_off_branch_area}
                      </p>
                      <p className="mb-0 text-xl">
                        {
                          receipts.individual_company
                            .indicomp_off_branch_ladmark
                        }
                      </p>
                      <p className="mb-0 text-xl">
                        {receipts.individual_company.indicomp_off_branch_city} -{" "}
                        {
                          receipts.individual_company
                            .indicomp_off_branch_pin_code
                        }
                        ,{receipts.individual_company.indicomp_off_branch_state}
                      </p>
                    </div>
                  )}

                  {receipts.individual_company.indicomp_res_reg_address && (
                    <div>
                      <p className="mb-0 text-xl">
                        {receipts.individual_company.indicomp_res_reg_address}
                      </p>
                      <p className="mb-0 text-xl">
                        {receipts.individual_company.indicomp_res_reg_area}
                      </p>
                      <p className="mb-0 text-xl">
                        {receipts.individual_company.indicomp_res_reg_ladmark}
                      </p>
                      <p className="mb-0 text-xl">
                        {receipts.individual_company.indicomp_res_reg_city} -{" "}
                        {receipts.individual_company.indicomp_res_reg_pin_code},
                        {receipts.individual_company.indicomp_res_reg_state}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <label className="block mt-2">
                {receipts.individual_company?.indicomp_gender === "Female" &&
                  "Respected Madam,"}
                {receipts.individual_company?.indicomp_gender === "Male" &&
                  "Respected Sir,"}
                {receipts.individual_company?.indicomp_gender === null &&
                  "Respected Sir,"}
              </label>

              {receipts.receipt_donation_type === "One Teacher School" && (
                <div className="mt-3 ">
                  <label className="block my-2 text-center font-semibold">
                    Sub: Adoption of One Teacher School
                  </label>
                  <label className="block my-2 text-justify leading-snug">
                    We acknowledge with thanks the receipt of Rs.
                    {receipts.receipt_total_amount}/- Rupees {amountInWords}{" "}
                    Only via{" "}
                    {receipts.receipt_tran_pay_mode === "Cash"
                      ? "Cash"
                      : receipts.receipt_tran_pay_details}
                    for your contribution and adoption of{" "}
                    {receipts.receipt_no_of_ots} OTS.
                  </label>
                </div>
              )}

              {receipts.receipt_donation_type === "General" && (
                <div className="mt-2">
                  <label className="block my-2 text-justify leading-snug">
                    We thankfully acknowledge the receipt of Rs.
                    {receipts.receipt_total_amount}/- via your{" "}
                    {receipts.receipt_tran_pay_mode === "Cash"
                      ? "Cash"
                      : receipts.receipt_tran_pay_details}{" "}
                    being Donation for Education.
                  </label>
                </div>
              )}

              {receipts.receipt_donation_type === "Membership" && (
                <div>
                  <label className="block my-2 text-justify leading-snug">
                    We acknowledge with thanks receipt of your membership
                    subscription for the Year. Our receipt for the same is
                    enclosed herewith.
                  </label>
                </div>
              )}

              {receipts.receipt_donation_type !== "Membership" && (
                <div>
                  <label className="block">Thanking you once again</label>
                  <label className="block">Yours faithfully,</label>
                  <label className="block">For Friends of Tribal Society</label>
                  <br />
                  <label className="block">
                    {authsign.length > 0 &&
                      authsign.map((sig, key) => (
                        <span key={key}>{sig.indicomp_full_name}</span>
                      ))}
                  </label>
                  <label className="block">{chapter.auth_sign}</label>
                  <label className="block mb-5">Encl: As stated above</label>
                </div>
              )}

              {receipts.receipt_donation_type === "Membership" && (
                <div>
                  <label className="block">With Best regards</label>
                  <label className="block">Yours sincerely</label>
                  <br />
                  <label className="block">
                    {authsign.length > 0 &&
                      authsign.map((sig, key) => (
                        <span key={key}>{sig.indicomp_full_name}</span>
                      ))}
                  </label>
                  <label className="block">{chapter.auth_sign}</label>
                  <label className="block mb-5">Encl: As stated above</label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptTwo;
