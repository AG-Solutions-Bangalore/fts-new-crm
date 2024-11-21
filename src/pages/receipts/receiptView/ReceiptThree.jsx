import axios from 'axios';
import numWords from 'num-words';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import BASE_URL from '../../../base/BaseUrl';
import moment from 'moment';
import Logo1 from '../../../assets/receipt/fts.png'
import Logo2 from '../../../assets/receipt/top.png'
import Logo3 from '../../../assets/receipt/ekal.png'
import ReactToPrint from 'react-to-print';
import { IoIosPrint } from 'react-icons/io';

const ReceiptThree = () => {
    const navigate = useNavigate();

    const { id } = useParams();
    const componentRef = useRef();
  
  
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
    <div>
        <ReactToPrint
                      trigger={() => (
                        <button
                     
                          className="flex items-center space-x-2 hover:text-red-400"
                        >
                          <IoIosPrint className="text-lg" />
                          <span>Print Letter</span>
                        </button>
                      )}
                      content={() => componentRef.current}
                    />
        </div>
        <hr className="border-b border-blue-gray-400" />
      <div ref={componentRef} className="p-2"
     
       style={{ margin: "5px" }}>
        <div className="flex justify-between items-center ">
          {/* Left Logo */}
          <div className="invoice-logo md:ml-12 md:mt-5">
            <img
              src={Logo1}
              alt="session-logo"
              className="w-20 h-20"
            />
          </div>

          {/* Center Address */}
          <div className="text-center">
            <img
              src={Logo2}
              alt="session-logo"
              className="md:w-80 mx-auto my-2"
            />
            <h2 className="font-bold text-xl">{chapter.chapter_name}</h2>
          </div>

          {/* Right Logo */}
          <div className="invoice-logo md:mr-12 mt-5">
            <img
              src={Logo3}
              alt="session-logo"
              className="w-20 h-20"
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="text-justify md:mx-20 mt-[10px] ">
          <div className="md:text-xs text-[9px] space-y-1">
            <p>
              {chapter.chapter_address}, {chapter.chapter_city} -{" "}
              {chapter.chapter_pin}, {chapter.chapter_state}
            </p>
            <p>
              Email: {chapter.chapter_email} | {chapter.chapter_website} |
              Ph: {chapter.chapter_phone} | Mob:{" "}
              {chapter.chapter_whatsapp}
            </p>
            <p className="md:text-xs text-[9px]">
              Head Office: Ekal Bhawan, 123/A, Harish Mukherjee Road,
              Kolkata-26. Web: www.ftsindia.com Ph: 033-2454 4510/11/12/13
              PAN: AAAAF0290L
            </p>
          </div>
        </div>

        {/* Date and Recipient Details */}
        <div className="flex justify-between md:mx-20 md:text-xl text-sm my-4 text-[#464D69]">
          <div>
            <p className="mb-2">
              Date: {moment(receipts.receipt_date).format("DD-MM-YYYY")}
            </p>
            {/* Conditional Details */}
            {Object.keys(receipts).length !== 0 && (
              <>
                {receipts.receipt_donation_type !== "Membership" &&
                  receipts.individual_company.indicomp_type !==
                    "Individual" && (
                    <p className="mb-2">
                      {receipts.individual_company.title}{" "}
                      {
                        receipts.individual_company
                          .indicomp_com_contact_name
                      }
                    </p>
                  )}
                {receipts.individual_company.indicomp_type !==
                "Individual" ? (
                  <p className="mb-2 text-[#464D69] text-xl">
                    M/s {receipts.individual_company.indicomp_full_name}
                  </p>
                ) : (
                  <p className="mb-2">
                    {receipts.individual_company.title}{" "}
                    {receipts.individual_company.indicomp_full_name}
                  </p>
                )}

                {/* Address Information */}
                {receipts.individual_company
                  .indicomp_off_branch_address && (
                  <div className="space-y-1 text-[#464D69] text-xl">
                    <p>
                      {
                        receipts.individual_company
                          .indicomp_off_branch_address
                      }
                    </p>
                    <p>
                      {
                        receipts.individual_company
                          .indicomp_off_branch_area
                      }
                    </p>
                    <p>
                      {
                        receipts.individual_company
                          .indicomp_off_branch_ladmark
                      }
                    </p>
                    <p>
                      {
                        receipts.individual_company
                          .indicomp_off_branch_city
                      }{" "}
                      -{" "}
                      {
                        receipts.individual_company
                          .indicomp_off_branch_pin_code
                      }
                      ,{" "}
                      {
                        receipts.individual_company
                          .indicomp_off_branch_state
                      }
                    </p>
                  </div>
                )}
                {receipts.individual_company.indicomp_res_reg_address && (
                  <div className="space-y-1 text-[#464D69] text-xl">
                    <p>
                      {
                        receipts.individual_company
                          .indicomp_res_reg_address
                      }
                    </p>
                    <p>
                      {receipts.individual_company.indicomp_res_reg_area}
                    </p>
                    <p>
                      {
                        receipts.individual_company
                          .indicomp_res_reg_ladmark
                      }
                    </p>
                    <p>
                      {receipts.individual_company.indicomp_res_reg_city}{" "}
                      -{" "}
                      {
                        receipts.individual_company
                          .indicomp_res_reg_pin_code
                      }
                      ,{" "}
                      {receipts.individual_company.indicomp_res_reg_state}
                    </p>
                  </div>
                )}
              </>
            )}

            <p className="my-2 text-xl text-[#464D69]">
              {receipts.individual_company?.indicomp_gender === "Female"
                ? "Respected Madam,"
                : receipts.individual_company?.indicomp_gender === "Male"
                ? "Respected Sir,"
                : "Respected Sir,"}
            </p>
          </div>
        </div>

        {/* Donation Types */}
        <div className="space-y-4 md:mx-20  md:text-xl text-sm text-[#464D69]">
          {receipts.receipt_donation_type === "One Teacher School" && (
            <>
              <p className="text-center my-4 font-semibold">
                Sub: Adoption of One Teacher School
              </p>
              <p>
                We acknowledge with thanks the receipt of Rs.
                {receipts.receipt_total_amount}/- Rupees {amountInWords}{" "}
                Only vide{" "}
                {receipts.receipt_tran_pay_mode === "Cash"
                  ? "Cash"
                  : receipts.receipt_tran_pay_details}{" "}
                being for your contribution and adoption of{" "}
                {receipts.receipt_no_of_ots} OTS.
              </p>
              <p>
                We convey our sincere thanks and gratitude for your kind
                support towards the need of our tribals and also the
                efforts being made by our Society for achieving
                comprehensive development of our tribal brethren
                particularly the literacy of their children and health &
                economic welfare.
              </p>
            </>
          )}
           <div className="flex  md:text-xl text-sm my-4 text-[#464D69]">
          {receipts.receipt_donation_type === "General" && (
            <>
              <p>
                We thankfully acknowledge the receipt of Rs.
                {receipts.receipt_total_amount}/- vide your{" "}
                {receipts.receipt_tran_pay_mode === "Cash"
                  ? "Cash"
                  : receipts.receipt_tran_pay_details}{" "}
                being Donation for Education.
              </p>
            </>
          )}
          {receipts.receipt_donation_type === "Membership" && (
            <>
              <p>
                We acknowledge with thanks receipt of your membership
                subscription for the Year. Our receipt for the same is
                enclosed herewith.
              </p>
            </>
          )}
          </div>

          {/* Closing */}
          <div className="text-justify md:text-xl text-sm text-[#464D69] mt-8">
            {receipts.receipt_donation_type !== "Membership" ? (
              <>
                <p>Thanking you once again</p>
                <p>Yours faithfully,</p>
                <p>For Friends of Tribal Society</p>
                {authsign.length > 0 &&
                  authsign.map((sig, key) => (
                    <p key={key}>{sig.indicomp_full_name}</p>
                  ))}
                <p>{chapter.auth_sign}</p>
                <p>Encl: As stated above</p>
              </>
            ) : (
              <>
                <p>With Best regards</p>
                <p>Yours sincerely</p>
                {authsign.length > 0 &&
                  authsign.map((sig, key) => (
                    <p key={key}>{sig.indicomp_full_name}</p>
                  ))}
                <p>{chapter.auth_sign}</p>
                <p>Encl: As stated above</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default ReceiptThree