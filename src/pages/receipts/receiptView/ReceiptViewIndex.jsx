import React from "react";
import { useParams } from "react-router-dom";
import ReceiptOne from "./ReceiptOne";
import ReceiptTwo from "./ReceiptTwo";
import ReceiptThree from "./ReceiptThree";
import Layout from "../../../layout/Layout";

const ReceiptViewIndex = () => {
  const { id } = useParams();
  return (
    <Layout>
      <div className="max-w-screen">
        <div className=" flex justify-between gap-2 bg-white p-4 mb-4 rounded-lg shadow-md">
          <h1 className="border-b-2  font-[400] border-dashed border-orange-800">
            Receipt View
          </h1>
        </div>

        <ReceiptOne />
    
        <ReceiptTwo />

        <ReceiptThree />
      </div>
    </Layout>
  );
};

export default ReceiptViewIndex;
