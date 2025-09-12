import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconEdit, IconEye } from "@tabler/icons-react";
import moment from "moment";
import {  navigateToOldReceiptEdit, navigateToOldReceiptView, RECEIPT_OLD_LIST } from "../../api";

const ReceiptOldList = () => {
  const [receiptList, setReceiptList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userType = localStorage.getItem("user_type_id");

  useEffect(() => {
    const fetchReciptList = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${RECEIPT_OLD_LIST}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReceiptList(response.data.receipts);
      } catch (error) {
        console.error("error while fetching old  receipt list ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReciptList();
   
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "receipt_no",
        header: "Receipt No",
        enableHiding: false,
        size: 20,
      },
   
      {
        accessorKey: "individual_company.indicomp_full_name",
        header: "Name",
        accessorFn: (row) => {
          return row?.individual_company?.indicomp_full_name || null;
        },
        Cell: ({ row }) => {
          const fullName = row.original.individual_company.indicomp_full_name;
          return <span>{fullName ? fullName : ""}</span>;
        },
      },
      {
        accessorKey: "receipt_date",
        header: "Date",
        size: 150,
        Cell: ({ row }) => {
          const date = row.original.receipt_date;

          return <>{date ? moment.utc(date).format("DD-MM-YYYY") : "N/A"}</>;
        },
      },
      {
        accessorKey: "receipt_exemption_type",
        header: "Exemption Type",
        size: 20,
      },
      {
        accessorKey: "receipt_donation_type",
        header: "Donation Type",
        size: 150,
      },
      {
        accessorKey: "receipt_total_amount",
        header: "Amount",
        size: 50,
      },
      ...(userType === "4"
        ? [
            {
              accessorKey: "chapter_name",
              header: "Chapter",
              size: 50,
              Cell: ({ row }) => {
                const fullName = row.original.chapter.chapter_name;
                return <span>{fullName.split(" ")[0]}</span>;
              },
            },
          ]
        : []),

      {
        id: "id",
        header: "Action",
        size: 50,
        Cell: ({ row }) => {
          const id = row.original.id;
          const finacialYear =row?.original?.receipt_financial_year
          return (
            <div className="flex gap-2">
              <div
               
                    //  onClick={() => {
                    //   navigateToOldReceiptView(navigate,id)
                    //           }}
                                 onClick={() => {
                                  navigateToOldReceiptView(navigate,id,finacialYear)
                                                                          }}
               
                title="Receipt Old View"
                className="flex items-center space-x-2"
              >
                <IconEye className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div>
               {/* {userType === "2" && (
                              <div
                                title="Receipt Old Edit"
                               
                                onClick={() => {
                                  navigateToOldReceiptEdit(navigate,id)
                                          }}
                                className="flex items-center space-x-2"
                              >
                                <IconEdit className="h-5 w-5 text-blue-500 cursor-pointer" />
                              </div>
                            )} */}
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: receiptList || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableHiding: false,
    enableColumnActions: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    state: { 
      
      isLoading: loading ,
     
    },
    mantineTableContainerProps: { sx: { maxHeight: "400px" } },
    initialState: { columnVisibility: { address: false } },
    mantineProgressProps: {
      color: 'blue',
      variant: 'bars', 
    },
    renderTopToolbarCustomActions: () => (
      <h2 className="text-lg font-bold text-black px-4">
         Old Receipt List
      </h2>
    ),
  });
  return (
    <Layout>
      <div className="max-w-screen">
       
          <MantineReactTable table={table} />
    
      </div>
    </Layout>
  );
};

export default ReceiptOldList;




