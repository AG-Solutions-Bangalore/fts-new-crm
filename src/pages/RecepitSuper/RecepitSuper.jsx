import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import { IconEdit, IconEye, IconInfoCircle } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import moment from "moment/moment";
import RecepitSuperDialog from "./RecepitSuperDialog";
import { Dialog } from "@material-tailwind/react";
import { toast } from "react-toastify";
import {
  RECEIPT_SUPER_LIST,
  RECEIPT_SUPER_SUMBIT,
} from "../../api";
import { useNavigate } from "react-router-dom";
import ReceiptSuperView from "./ReceiptSuperView";

const RecepitSuper = () => {
  const [receipt, setRecepit] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReceiptId, setSelectedReceiptId] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [rowSelection, setRowSelection] = useState({});

  const selectedReceiptIds = useMemo(() => {
    return Object.keys(rowSelection)
      .filter(key => rowSelection[key])
      .map(key => receipt[parseInt(key)]?.id)
      .filter(id => id !== undefined);
  }, [rowSelection, receipt]);

  const handleChapterSelection = (Recepitref) => {
    onSubmit(Recepitref);
  };
  
  const fetchData = () => {
    axios
      .get(`${RECEIPT_SUPER_LIST}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setRecepit(res.data.receipts);
      });
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const handleClose = () => {
    setShowModal(false);
  };
  
  const handleViewClose = () => {
    setShowViewModal(false);
  };
  
  const onSubmit = (Recepitref) => {
    let data = {
      receipt_ref: Recepitref,
    };

    axios({
      url: `${RECEIPT_SUPER_SUMBIT}/${localStorage.getItem("Ref")}`,
      method: "PUT",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        toast.success("Receipt is Updated Successfully");
        fetchData();
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error updating receipt:", error);
        toast.error("Failed to update receipt");
      });
  };

  const handleOpenDialog = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setShowModal((prev) => !prev);
  };
  
  const handleOpenViewDialog = (id, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setSelectedReceiptId(id);
    setShowViewModal(true);
  };

  const handleDownloadMultipleReceipts = async (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    if (selectedReceiptIds.length === 0) {
      alert("Please select at least one receipt to download");
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const token = localStorage.getItem("token");
      const totalReceipts = selectedReceiptIds.length;
      let successfulDownloads = 0;

      for (let i = 0; i < selectedReceiptIds.length; i++) {
        const receiptId = selectedReceiptIds[i];
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
        } catch (error) {
          console.error(`Failed to download receipt ${receiptId}:`, error);
          throw error;
        }
      }

      toast.success(`Successfully downloaded ${successfulDownloads} out of ${totalReceipts} receipts`);
      setRowSelection({}); 
    } catch (error) {
      toast.error("Error during batch download");
      alert("Some receipts failed to download. Process stopped.");
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const columns = useMemo(
    () => [
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
      {
        accessorKey: "actions",
        header: "Actions",
        enableColumnFilter: false,
        Cell: ({ row }) => {
          const ref = row.original.id;

          const handleEditClick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            localStorage.setItem("Ref", ref);
            handleOpenDialog(e);
          };

          const handleViewClick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            handleOpenViewDialog(ref, e);
          };

          return (
            <div className="flex flex-row items-center gap-1" onClick={e => e.stopPropagation()}>
              <button 
                className="flex items-center justify-center p-1 hover:bg-gray-100 rounded"
                onClick={handleEditClick}
                title="Edit Receipt"
              >
                <IconEdit className="cursor-pointer text-blue-600" />
              </button>
              <button
                className="flex items-center justify-center p-1 hover:bg-gray-100 rounded"
                onClick={handleViewClick}
                title="View Receipt"
              >
                <IconEye className="h-5 w-5 text-blue-500 cursor-pointer" />
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: receipt,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    renderTopToolbarCustomActions: ({ table }) => (
      <div className="flex items-center gap-4">
        {selectedReceiptIds.length > 0 && (
          <button
            onClick={handleDownloadMultipleReceipts}
            disabled={isDownloading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isDownloading ? `Downloading... ${downloadProgress}%` : `Download (${selectedReceiptIds.length})`}
          </button>
        )}
      </div>
    ),
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: row.getToggleSelectedHandler(),
      style: { cursor: 'pointer' },
    }),
   
  });

  return (
    <Layout>
      <div className="bg-[#FFFFFF] p-2 rounded-lg">
        <div className="sticky top-0 p-2 border-b-2 border-green-500 rounded-t-lg bg-[#E1F5FA] mt-2">
          <h2 className="px-5 text-[black] text-lg flex flex-row justify-between items-center rounded-xl p-2">
            <div className="flex items-center gap-2">
              <IconInfoCircle className="cursor-pointer hover:text-red-600" />
              <span>Receipts</span>
            </div>
          </h2>
        </div>

        <MantineReactTable table={table} />
      </div>

      {/* Edit Dialog */}
      <Dialog open={showModal} handler={handleOpenDialog}>
        <div className="max-h-[500px] overflow-y-auto bg-white rounded-lg p-4 w-full sm:w-[300px] md:w-[600px] lg:w-[900px]">
          <RecepitSuperDialog
            onSelect={handleChapterSelection}
            handleClose={handleClose}
          />
        </div>
      </Dialog>
      
      {/* View Dialog */}
      <Dialog 
        open={showViewModal} 
        handler={handleViewClose}
        size="xl"
      >
        <div className="max-h-[80vh] overflow-y-auto bg-white rounded-lg">
          {selectedReceiptId && (
            <ReceiptSuperView 
              id={selectedReceiptId} 
              isDialog={true}
              onClose={handleViewClose}
            />
          )}
        </div>
      </Dialog>
    </Layout>
  );
};

export default RecepitSuper;