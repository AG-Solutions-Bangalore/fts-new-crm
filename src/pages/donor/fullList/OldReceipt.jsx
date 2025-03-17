import {
  IconArrowBack,
  IconEdit,
  IconEye,
  IconInfoCircle,
} from "@tabler/icons-react";
import axios from "axios";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../../base/BaseUrl";
import moment from "moment";
import { encryptId } from "../../../components/common/EncryptionDecryption";
import { DONOR_VIEW_OLD_RECEIPT_LIST, navigateToViewReceiptFromOldReceipt } from "../../../api";

const OldReceipt = ({ viewerId, onClose }) => {
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchReceiptData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${DONOR_VIEW_OLD_RECEIPT_LIST}/${viewerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReceiptData(response.data?.receipts);
    } catch (error) {
      console.error("Error fetching receipt list data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (viewerId) {
      fetchReceiptData();
    }
  }, [viewerId]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "receipt_no",
        header: "Receipt No",
        size: 50,
      },
      {
        accessorKey: "individual_company.indicomp_full_name",
        header: "Full Name",
        size: 100,
        Cell: ({ row }) => {
          const fullName = row.original.individual_company.indicomp_full_name;
          return fullName || "N/A";
        },
      },
      {
        accessorKey: "receipt_date",
        header: "Date",
        size: 50,
        Cell: ({ row }) => {
          const date = row.original.receipt_date;

          return <>{date ? moment.utc(date).format("DD-MM-YYYY") : "N/A"}</>;
        },
      },
      {
        accessorKey: "receipt_exemption_type",
        header: "Exemption Type",
        size: 50,
      },
      {
        accessorKey: "receipt_donation_type",
        header: "Donation Type",
        size: 50,
      },
      {
        accessorKey: "receipt_total_amount",
        header: "Amount",
        size: 50,
      },

      {
        id: "id",
        header: "Action",
        size: 50,
        Cell: ({ row }) => {
          const id = row.original.id;

          return (
            <div className="flex gap-2">
              <div
                title="Receipt View"
                // onClick={() => {
                //   const encryptedId = encryptId(id);
                //   navigate(`/view-receipts/${encodeURIComponent(encryptedId)}`);
                // }}
                   onClick={() => {
                    navigateToViewReceiptFromOldReceipt(navigate,id)
                                            }}
                // onClick={() => navigate(`/view-receipts/${id}`)}
                className="flex items-center space-x-2"
              >
                <IconEye
                  title="View"
                  className="h-5 w-5  text-blue-500 cursor-pointer"
                />
              </div>
              {/* <div
                  title='Receipt Edit'
                  onClick={()=>navigate(`/receipt-edit/${id}`)}
                    className="flex items-center space-x-2"
                  >
                    <IconEdit  className="h-5 w-5 text-blue-500 cursor-pointer" />
                  </div> */}
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: receiptData || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding: false,
  });

  return (
    <div className=" bg-[#FFFFFF] p-2  w-[50rem]  overflow-y-auto custom-scroll-add">
      <div className="sticky top-0 p-2  mb-4 border-b-2 border-green-500 rounded-lg  bg-[#E1F5FA] ">
        <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
          <div className="flex  items-center gap-2">
            <IconInfoCircle className="w-4 h-4" />
            <span>Old Receipt</span>
          </div>
          <IconArrowBack
            onClick={() => onClose()}
            className="cursor-pointer hover:text-red-600"
          />
        </h2>
      </div>
      <hr />

      <div className=" shadow-md">
        <MantineReactTable table={table} />
      </div>
    </div>
  );
};

export default OldReceipt;
