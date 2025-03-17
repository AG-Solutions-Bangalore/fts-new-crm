import React, { useState, useEffect } from "react";
import { Button, Card, Spinner } from "@material-tailwind/react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import axios from "axios";
import Layout from "../../layout/Layout"
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import BASE_URL from "../../base/BaseUrl";
import { toast } from "react-toastify";
import { IconArrowBack, IconDownload, IconInfoCircle } from "@tabler/icons-react";
import { OTHER_FAQ, OTHER_FAQ_DOWNLOAD } from "../../api";



function Icon({ id, open }) {
    return (
      <div
        className={`h-5 w-5 transition-transform ${
          id === open ? "rotate-180" : ""
        }`}
      >
        {id === open ? <FaChevronUp /> : <FaChevronDown />}
      </div>
    );
  }

const Faq = () => {
    const [loader, setLoader] = useState(true);
    const [faqsData, setFaqsData] = useState([]);
    const [open, setOpen] = useState(0);
  
    const getData = async () => {
      try {
        const res = await axios.get(`${OTHER_FAQ}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setFaqsData(res.data.faqs);
        setLoader(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoader(false);
      }
    };
  
    useEffect(() => {
      getData();
    }, []);
  
    const handleDownload = async () => {
      try {
        const res = await axios.post(
          `${OTHER_FAQ_DOWNLOAD}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            responseType: "blob",
          }
        );
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "faq_summary.csv");
        document.body.appendChild(link);
        link.click();
        toast.success("FAQ is Downloaded Successfully");
      } catch (error) {
        toast.error("FAQ is Not Downloaded");
        console.error("Download error:", error);
      }
    };
  
    const handleOpen = (value) => setOpen(open === value ? null : value);
  return (
   <Layout>
     <div className="  bg-[#FFFFFF] p-2    rounded-lg  " >
     <div className="sticky top-0 p-2  mb-4 border-b-2 border-green-500 rounded-lg  bg-[#E1F5FA] ">
        <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
          <div className="flex  items-center gap-2">
            <IconInfoCircle className="w-4 h-4" />
            <span>Faq List</span>
          </div>
          <IconDownload
             onClick={handleDownload}
            className="cursor-pointer hover:text-red-600"
          />
        </h2>
      </div>
  
        
        {loader ? (
          <div className="flex justify-center mt-5">
            <Spinner color="blue" className="h-6 w-6" />
          </div>
        ) : (
          faqsData.map((faq, key) => (
            <Card className="mt-4" key={key}>
              <Accordion
                open={open === key}
                icon={<Icon id={key} open={open} />}
                className="mb-5 p-4 border rounded-lg"
              >
                <AccordionHeader
                  onClick={() => handleOpen(key)}
                  className="text-md font-semibold text-blue-500"
                >
                  {faq.header}
                </AccordionHeader>
                <AccordionBody className="text-sm font-normal text-black">
                  {faq.text}
                </AccordionBody>
              </Accordion>
            </Card>
          ))
        )}
      </div>
   </Layout>
  )
}

export default Faq