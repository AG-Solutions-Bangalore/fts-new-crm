import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import { IconEdit, IconEye, IconInfoCircle, IconDownload } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import moment from "moment/moment";
import { RECEIPT_SUPER_MULTI_RECEIPT_LIST } from "../../api";

const MultiReceiptDownload = () => {
  const [receipt, setReceipt] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${RECEIPT_SUPER_MULTI_RECEIPT_LIST}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setReceipt(response.data.receipts);
    } catch (error) {
      console.error("Error fetching receipts:", error);
      setNotification({
        show: true,
        message: "Failed to load receipts. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDownload = async (e) => {
    e.preventDefault();
    
    if (!fromId || !toId) {
      setNotification({
        show: true,
        message: "Please enter both From and To Receipt IDs",
        type: "error",
      });
      return;
    }

    setDownloadLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/download-receipts-multi`,
        { from_id: fromId, to_id: toId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: 'blob',
        }
      );
      
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `receipts_${fromId}_to_${toId}.zip`); 
        link.click();
        link.remove();
        
        
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 100);
        
        setNotification({
          show: true,
          message: "Receipts downloaded successfully!",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error downloading receipts:", error);
      setNotification({
        show: true,
        message: "Failed to download receipts. Please try again.",
        type: "error",
      });
    } finally {
      setDownloadLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: "id",
      header: "Id",
      size: 50,
    },
    {
      accessorKey: "indicomp_fts_id",
      header: "Fts Id",
      size: 50,
    },
    {
      accessorKey: "receipt_no",
      header: "Receipt No",
      size: 50,
    },
    {
      accessorKey: "donor_name",
      header: "Donor Name",
      Cell: ({ row }) => {
        const name = row.original.individual_company?.indicomp_full_name || "N/A";
        return <span>{name}</span>;
      },
    },
    {
      accessorKey: "receipt_date",
      header: "Date",
      Cell: ({ row }) => {
        const date = row.original.receipt_date;
        return <>{date ? moment.utc(date).format("DD-MM-YYYY") : "N/A"}</>;
      },
    },
    {
      accessorKey: "receipt_exemption_type",
      header: "Exemption Type",
    },
    { 
      accessorKey: "receipt_donation_type", 
      header: "Donation Type" 
    },
    {
      accessorKey: "chapter_name",
      header: "Chapter Name",
      Cell: ({ row }) => {
        const name = row.original.chapter?.chapter_name || "N/A";
        return <span>{name}</span>;
      },
    },
  ];

  const table = useMantineReactTable({
    columns,
    data: receipt || [],
    enableDensityToggle: false,
    enableColumnActions: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    state: {
      isLoading: loading,
    },
  });

  return (
    <Layout>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="sticky top-0 p-2 border-b-2 border-green-500 rounded-t-lg bg-[#E1F5FA] mb-4">
          <h2 className="px-5 text-black text-lg flex flex-row justify-between items-center rounded-xl p-2">
            <div className="flex items-center gap-2">
              <IconInfoCircle className="cursor-pointer hover:text-red-600" />
              <span>Multi Receipt Download</span>
            </div>
            <form onSubmit={handleDownload} className="flex items-center gap-4">
            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
        <div className="flex flex-col min-w-[120px]">
          <label htmlFor="fromId" className="text-xs font-medium text-gray-500 mb-1">From ID</label>
          <input
            id="fromId"
            type="text"
            inputMode="numeric"
            placeholder="Start ID"
            value={fromId}
            onChange={(e) => setFromId(e.target.value.replace(/[^0-9]/g, ''))}
            required
            className="text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="flex flex-col min-w-[120px]">
          <label htmlFor="toId" className="text-xs font-medium text-gray-500 mb-1">To ID</label>
          <input
            id="toId"
            type="text"
            inputMode="numeric"
            placeholder="End ID"
            value={toId}
            onChange={(e) => setToId(e.target.value.replace(/[^0-9]/g, ''))}
            required
            className="text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>
              <button
                type="submit"
                disabled={downloadLoading}
                className="inline-flex items-center px-4 py-2 mt-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {downloadLoading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <IconDownload className="mr-2" size={16} />
                )}
                Download Zip
              </button>
            </form>
          </h2>
        </div>

        {notification.show && (
          <div className={`mb-4 p-3 rounded-md ${notification.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${notification.type === "error" ? "text-red-400" : "text-green-400"}`}>
                  {notification.type === "error" ? (
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{notification.message}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNotification({ ...notification, show: false })}
                className="inline-flex bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )
    }
        <MantineReactTable table={table} />
      </div>
    </Layout>
  );
};

export default MultiReceiptDownload;