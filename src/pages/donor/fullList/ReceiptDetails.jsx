import React from "react";
import { IconInfoCircle, IconSquareRoundedX } from "@tabler/icons-react";
import DonoationDetailsList from "./ReceiptDetailsTable/DonoationDetailsList";
import MembershipDetails from "./ReceiptDetailsTable/MembershipDetails";
import FamilyDetails from "./ReceiptDetailsTable/FamilyDetails";
import CompanyDetailsList from "./ReceiptDetailsTable/CompanyDetailsList";

const ReceiptDetails = ({ viewerId, onClose }) => {
  return (
    <div className=" bg-[#FFFFFF] p-2  w-[50rem]  overflow-y-auto custom-scroll-add">
      <div className=" top-0 p-2  mb-4 border-b-2 border-green-500 rounded-lg  bg-[#E1F5FA] ">
        <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
          <div className="flex  items-center gap-2">
            <IconInfoCircle className="w-4 h-4" />
            <span>Receipt & Family Details</span>
          </div>
          <IconSquareRoundedX
            onClick={() => onClose()}
            className="cursor-pointer hover:text-red-600"
          />
        </h2>
      </div>
      <hr />
      <div className="p-4">
        <div className="space-y-2">
          <div className="flex gap-4 flex-col justify-center">
            <DonoationDetailsList viewerId={viewerId} />
            <MembershipDetails viewerId={viewerId} />
            <FamilyDetails viewerId={viewerId} />
            <CompanyDetailsList viewerId={viewerId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDetails;
