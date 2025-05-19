import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconEdit, IconEye } from "@tabler/icons-react";
import moment from "moment";
import { CgTally } from "react-icons/cg";
import { navigateToReceiptEdit, navigateToReceiptView, RECEIPT_LIST } from "../../api";
import { toast } from "react-toastify";

const ReceiptList = () => {
  const [receiptList, setReceiptList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const navigate = useNavigate();
  const userType = localStorage.getItem("user_type_id");

  useEffect(() => {
    const fetchReciptList = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${RECEIPT_LIST}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReceiptList(response.data.receipts);
      } catch (error) {
        console.error("error while fetching receipt list ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReciptList();
  }, []);

  const handleDownloadMultipleReceipts = async () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one receipt to download");
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const token = localStorage.getItem("token");
      const totalReceipts = selectedRows.length;
      let successfulDownloads = 0;

      for (let i = 0; i < selectedRows.length; i++) {
        const receiptId = selectedRows[i];
        try {
          const response = await axios.get(
            `${BASE_URL}/api/download-receipts?id=${receiptId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              responseType: 'blob', 
            }
          );

         
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `receipt_${receiptId}.pdf`); 
          document.body.appendChild(link);
          link.click();
          link.remove();

          successfulDownloads++;
          setDownloadProgress(Math.round(((i + 1) / totalReceipts) * 100));
          setSelectedRows([])
        } catch (error) {
          console.error(`Failed to download receipt ${receiptId}:`, error);
         
          throw error;
        }
      }

      toast.success(`Successfully downloaded ${successfulDownloads} out of ${totalReceipts} receipts`);
    } catch (error) {
      toast.error("Error during batch download:", error);
      alert("Some receipts failed to download. Process stopped.");
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: 'Select',
        size: 10,
        Cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedRows.includes(row.original.id)}
            onChange={() => {
              setSelectedRows(prev => 
                prev.includes(row.original.id)
                  ? prev.filter(id => id !== row.original.id)
                  : [...prev, row.original.id]
              );
            }}
          />
        ),
      },
      {
        accessorKey: "receipt_no",
        header: "Receipt No",
        enableHiding: false,
        size: 20,
      },
      {
        accessorKey: "tally_status",
        header: "Tally",
        enableHiding: false,
        size: 20,
        Cell:({row})=>{
          const tally = row.original.tally_status
          return tally == 'True' ? <> <CgTally className="w-4 h-4" />
 </> : ""
        }
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
          return (
            <div className="flex gap-2">
              <div
                onClick={() => {
                  navigateToReceiptView(navigate,id)
                }}
                title="Receipt View"
                className="flex items-center space-x-2"
              >
                <IconEye className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div>
              {userType === "2" && (
                <div
                  title="Receipt Edit"
                  onClick={() => {
                    navigateToReceiptEdit(navigate,id)
                  }}
                  className="flex items-center space-x-2"
                >
                  <IconEdit className="h-5 w-5 text-blue-500 cursor-pointer" />
                </div>
              )}
            </div>
          );
        },
      },
    ],
    [selectedRows, userType]
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
      isLoading: loading,
    },
    initialState: { columnVisibility: { address: false } },
    mantineTableContainerProps: {
      sx: {
        maxHeight: '400px', 
        position: 'relative',
      },
    },
    mantineProgressProps: {
      color: 'blue',
      variant: 'bars', 
    },
    renderTopToolbarCustomActions: () => (
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold text-black px-4">
          Current Receipt List
        </h2>
        {selectedRows.length > 0 && (
          <button
            onClick={handleDownloadMultipleReceipts}
            disabled={isDownloading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isDownloading ? `Downloading... ${downloadProgress}%` : `Download (${selectedRows.length})`}
          </button>
        )}
      </div>
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

export default ReceiptList;