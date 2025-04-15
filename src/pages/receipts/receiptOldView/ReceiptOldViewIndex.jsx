import React from "react";
import { useParams } from "react-router-dom";

import Layout from "../../../layout/Layout";
import ReceiptOldOne from "./ReceiptOldOne";

const ReceiptOldViewIndex = () => {
  const { id } = useParams();
  return (
    <Layout>
      <div className="max-w-screen">
        <ReceiptOldOne />

      </div>
    </Layout>
  );
};

export default ReceiptOldViewIndex;
