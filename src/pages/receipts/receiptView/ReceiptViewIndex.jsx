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
        <ReceiptOne />
{/* 
        <ReceiptTwo />

        <ReceiptThree /> */}
      </div>
    </Layout>
  );
};

export default ReceiptViewIndex;
