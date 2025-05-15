import React, { useMemo, useState } from 'react';
import Layout from '../../layout/Layout';
import axios from 'axios';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { Dialog, Tooltip } from "@mui/material";
import { IconCircleX, IconArrowRight, IconEdit } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const SuperReceiptDonor = () => {
  const [receiptRefNo, setReceiptRefNo] = useState('');
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [donors, setDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchReceiptData = async () => {
    if (!receiptRefNo.trim()) {
      toast.warning('Please enter a receipt reference number');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://agsrb.online/api1/public/api/fetch-change-receipts-donor",
        { receipt_ref_no: receiptRefNo },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        setReceiptData(response.data);
        toast.success(response.data.toast?.msg || 'Receipt data fetched successfully');
      } else {
        toast.error(response.data.toast?.msg || 'Failed to fetch receipt data');
      }
    } catch (error) {
      console.error("Error fetching receipt data:", error);
      toast.error(error.response?.data?.toast?.msg || 'An error occurred while fetching receipt data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDonors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://agsrb.online/api1/public/api/fetch-change-donors",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDonors(response.data.individualCompanies);
    } catch (error) {
      console.error("Error fetching donors:", error);
      toast.error("Failed to fetch donors list");
    }
  };

  const handleChangeDonorClick = () => {
    setSelectedDonor(null);
    setOpenDialog(true);
    fetchDonors();
  };

  const handleUpdateDonor = async () => {
    if (!selectedDonor) {
      toast.warning("Please select a donor first");
      return;
    }

    try {
      setIsUpdating(true);
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `https://agsrb.online/api1/public/api/update-change-receipts-donorD/${receiptData.receipts[0].id}`,
        {
          indicomp_fts_id: selectedDonor.indicomp_fts_id,
          receipt_ref_no: receiptRefNo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.code === 200) {
        toast.success(res.data.msg);
        setOpenDialog(false);
        // Refresh the receipt data
        fetchReceiptData();
      } else {
        toast.error(res.data.msg);
      }
    } catch (error) {
      console.error("Error updating donor:", error);
      toast.error(error.response?.data?.msg || "Failed to update donor");
    } finally {
      setIsUpdating(false);
    }
  };

  const updateColumns = useMemo(
    () => [
      {
        id: 'select',
        header: 'Select',
        size: 80,
        Cell: ({ row }) => (
          <button
            onClick={() => setSelectedDonor(row.original)}
            className={`px-3 py-1 text-xs rounded-md ${
              selectedDonor?.indicomp_fts_id === row.original.indicomp_fts_id
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {selectedDonor?.indicomp_fts_id === row.original.indicomp_fts_id ? 'Selected' : 'Select'}
          </button>
        ),
      },
      {
        accessorKey: 'indicomp_full_name',
        header: 'Donor Name',
        size: 150,
        Cell: ({ row, table }) => (
          <div className="flex items-center gap-2">
            {selectedDonor?.indicomp_fts_id === row.original.indicomp_fts_id && (
              <IconArrowRight className="w-4 h-4 text-blue-500" />
            )}
            <span className={selectedDonor?.indicomp_fts_id === row.original.indicomp_fts_id ? "font-medium text-blue-600 " : ""}>
              {row.original.indicomp_full_name}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'indicomp_mobile_phone',
        header: 'Mobile',
        size: 120,
        Cell: ({ cell, row }) => (
          <span className={selectedDonor?.indicomp_fts_id === row.original.indicomp_fts_id ? "text-blue-500" : "text-gray-800"}>
            {cell.getValue() || 'N/A'}
          </span>
        ),
      },
      {
        accessorKey: 'indicomp_type',
        header: 'Type',
        size: 100,
      },
      {
        accessorKey: 'chapter_name',
        header: 'Chapter',
        size: 120,
      },
    ],
    [selectedDonor]
  );

  return (
    <Layout>
      <div className="max-w-screen mx-auto p-4 bg-white rounded-lg">
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: receiptData ? -100 : 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center min-h-[200px]"
        >
          <div className="w-full max-w-md">
            <label htmlFor="receiptRefNo" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Receipt Ref No
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="receiptRefNo"
                value={receiptRefNo}
                onChange={(e) => setReceiptRefNo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. GEN/6/2024-25"
              />
              <button
                onClick={fetchReceiptData}
                disabled={loading}
                className={`px-4 py-2 rounded-md text-white ${
                  loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </motion.div>

        {receiptData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Receipt Details</h2>
              <button
                onClick={handleChangeDonorClick}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Change Donor
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-medium text-gray-700 w-40">Receipt No:</span>
                  <span>{receiptData.receipts[0].receipt_no}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-700 w-40">Receipt Date:</span>
                  <span>{receiptData.receipts[0].receipt_date}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-700 w-40">Exemption Type:</span>
                  <span>{receiptData.receipts[0].receipt_exemption_type}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-700 w-40">Donation Type:</span>
                  <span>{receiptData.receipts[0].receipt_donation_type}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex">
                  <span className="font-medium text-gray-700 w-40">Total Amount:</span>
                  <span>₹{receiptData.receipts[0].receipt_total_amount}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-700 w-40">Current Donor:</span>
                  <span>{receiptData.receipts[0].individual_company.indicomp_full_name}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-700 w-40">Promoter:</span>
                  <span>{receiptData.receipts[0].individual_company.indicomp_promoter}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-700 w-40">Chapter:</span>
                  <span>{receiptData.receipts[0].chapter.chapter_name} ({receiptData.receipts[0].chapter.chapter_code})</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Change Donor Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        sx={{
          backdropFilter: "blur(5px) sepia(5%)",
          "& .MuiDialog-paper": {
            borderRadius: "8px",
            maxWidth: "800px",
            width: "100%",
          },
        }}
        disableEnforceFocus
        disableAutoFocus
      >
        <div className="p-4 space-y-2 container bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-slate-800 text-lg font-semibold">
                Change Receipt Donor
              </h1>
            </div>
            <Tooltip title="Close">
              <button
                type="button"
                className="ml-2 flex-shrink-0"
                onClick={() => setOpenDialog(false)}
              >
                <IconCircleX className="w-5 h-5" />
              </button>
            </Tooltip>
          </div>

          {selectedDonor && (
            <div className="mb-4 px-4 py-3 bg-blue-50/50 border border-blue-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-900">
                      {selectedDonor.indicomp_full_name}
                    </h3>
                    <div className="flex items-center text-xs text-gray-900 mt-1">
                      <svg className="w-3 h-3 mr-1 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      {selectedDonor.indicomp_mobile_phone || 'N/A'}
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Selected
                </span>
              </div>
            </div>
          )}

          <div className="mb-0">
            {donors.length > 0 ? (
              <MantineReactTable
                columns={updateColumns}
                data={donors || []}
                enableFullScreenToggle={false}
                enableDensityToggle={false}
                enableHiding={false}
                enableColumnActions={false}
                enableStickyHeader={true}
                enableStickyFooter={false}
                mantineTableContainerProps={{ 
                  sx: { 
                    maxHeight: "400px",
                    '& tr': {
                      height: '20px' 
                    }
                  } 
                }}
                initialState={{ 
                  density: 'xs', 
                  columnVisibility: { address: false } 
                }}
                mantineTableBodyRowProps={({ row }) => ({
                  sx: {
                    backgroundColor: selectedDonor?.indicomp_fts_id === row.original.indicomp_fts_id 
                      ? '#dbeafe' 
                      : 'inherit',
                    '&:hover': {
                      backgroundColor: '#f3f4f6',
                    },
                  },
                })}
              />
            ) : (
              <p className="text-gray-500 text-center py-4">Loading donors...</p>
            )}
          </div>
          
          <div className="mt-4 flex justify-center">
            <button
              disabled={isUpdating || !selectedDonor}
              onClick={handleUpdateDonor}
              className={`text-center text-sm font-medium w-36 h-10 text-white rounded-lg shadow-md ${
                isUpdating || !selectedDonor 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors`}
            >
              {isUpdating ? "Updating..." : "Update Donor"}
            </button>
          </div>
        </div>
      </Dialog>
    </Layout>
  );
};

export default SuperReceiptDonor;




// 2nd test

import React, { useMemo, useState } from 'react';
import Layout from '../../layout/Layout';
import axios from 'axios';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { Dialog, Tooltip } from "@mui/material";
import { 
  IconCircleX, 
  IconArrowRight, 
  IconEdit, 
  IconSearch, 
  IconUser, 
  IconUsers, 
  IconCalendar, 
  IconReceipt, 
  IconCurrencyRupee, 
  IconBuilding, 
  IconMapPin, 
  IconCheck, 
  IconFileInvoice,
  IconDeviceFloppy,
  IconPhone
} from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const SuperReceiptDonor = () => {
  const [receiptRefNo, setReceiptRefNo] = useState('');
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [donors, setDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchReceiptData = async () => {
    if (!receiptRefNo.trim()) {
      toast.warning('Please enter a receipt reference number');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://agsrb.online/api1/public/api/fetch-change-receipts-donor",
        { receipt_ref_no: receiptRefNo },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        setReceiptData(response.data);
        toast.success(response.data.toast?.msg || 'Receipt data fetched successfully');
      } else {
        toast.error(response.data.toast?.msg || 'Failed to fetch receipt data');
      }
    } catch (error) {
      console.error("Error fetching receipt data:", error);
      toast.error(error.response?.data?.toast?.msg || 'An error occurred while fetching receipt data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDonors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://agsrb.online/api1/public/api/fetch-change-donors",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDonors(response.data.individualCompanies);
    } catch (error) {
      console.error("Error fetching donors:", error);
      toast.error("Failed to fetch donors list");
    }
  };

  const handleChangeDonorClick = () => {
    setSelectedDonor(null);
    setOpenDialog(true);
    fetchDonors();
  };

  const handleUpdateDonor = async () => {
    if (!selectedDonor) {
      toast.warning("Please select a donor first");
      return;
    }

    try {
      setIsUpdating(true);
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `https://agsrb.online/api1/public/api/update-change-receipts-donorD/${receiptData.receipts[0].id}`,
        {
          indicomp_fts_id: selectedDonor.indicomp_fts_id,
          receipt_ref_no: receiptRefNo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.code === 200) {
        toast.success(res.data.msg);
        setOpenDialog(false);
        // Refresh the receipt data
        fetchReceiptData();
      } else {
        toast.error(res.data.msg);
      }
    } catch (error) {
      console.error("Error updating donor:", error);
      toast.error(error.response?.data?.msg || "Failed to update donor");
    } finally {
      setIsUpdating(false);
    }
  };

  const updateColumns = useMemo(
    () => [
      {
        id: 'select',
        header: 'Select',
        size: 80,
        Cell: ({ row }) => (
          <button
            onClick={() => setSelectedDonor(row.original)}
            className={`px-3 py-1.5 text-xs rounded-full font-medium transition-all ${
              selectedDonor?.indicomp_fts_id === row.original.indicomp_fts_id
                ? 'bg-teal-500 text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {selectedDonor?.indicomp_fts_id === row.original.indicomp_fts_id ? (
              <span className="flex items-center justify-center gap-1">
                <IconCheck className="w-3 h-3" />
                Selected
              </span>
            ) : 'Select'}
          </button>
        ),
      },
      {
        accessorKey: 'indicomp_full_name',
        header: 'Donor Name',
        size: 150,
        Cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {selectedDonor?.indicomp_fts_id === row.original.indicomp_fts_id && (
              <IconArrowRight className="w-4 h-4 text-teal-500" />
            )}
            <span className={selectedDonor?.indicomp_fts_id === row.original.indicomp_fts_id ? "font-medium text-teal-600" : ""}>
              {row.original.indicomp_full_name}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'indicomp_mobile_phone',
        header: 'Mobile',
        size: 120,
        Cell: ({ cell, row }) => (
          <span className={selectedDonor?.indicomp_fts_id === row.original.indicomp_fts_id ? "text-teal-500" : "text-gray-800"}>
            {cell.getValue() || 'N/A'}
          </span>
        ),
      },
      {
        accessorKey: 'indicomp_type',
        header: 'Type',
        size: 100,
        Cell: ({ cell }) => (
          <span className="px-2 py-1 bg-violet-50 text-violet-700 rounded-md text-xs font-medium">
            {cell.getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'chapter_name',
        header: 'Chapter',
        size: 120,
        Cell: ({ cell }) => (
          <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-medium">
            {cell.getValue()}
          </span>
        ),
      },
    ],
    [selectedDonor]
  );

  return (
    <Layout>
      <div className="max-w-screen mx-auto p-6 bg-white rounded-xl shadow">
        {/* Page Header with Decorative Elements */}
        <div className="relative mb-8">
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-teal-50 rounded-full opacity-70"></div>
          <div className="absolute top-10 -right-4 w-16 h-16 bg-violet-50 rounded-full opacity-70"></div>
          
          <div className="relative">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Receipt Donor Management</h1>
            <div className="w-20 h-1 bg-teal-500 rounded-full mb-2"></div>
            <p className="text-gray-600">Update donation receipt information with ease</p>
          </div>
        </div>
        
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: receiptData ? -20 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex flex-col items-center justify-center min-h-[120px]"
        >
          <div className="w-full max-w-lg bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl shadow-sm border border-teal-100">
            <label htmlFor="receiptRefNo" className="block text-sm font-medium text-gray-700 mb-2">
              Receipt Reference Number
            </label>
            <div className="flex gap-3">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconFileInvoice className="h-5 w-5 text-teal-500" />
                </div>
                <input
                  type="text"
                  id="receiptRefNo"
                  value={receiptRefNo}
                  onChange={(e) => setReceiptRefNo(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent shadow-sm text-gray-800 bg-white"
                  placeholder="e.g. GEN/6/2024-25"
                />
              </div>
              <button
                onClick={fetchReceiptData}
                disabled={loading}
                className={`px-6 py-3 rounded-lg text-white font-medium shadow flex items-center justify-center gap-2 transition-all ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-teal-500 hover:bg-teal-600 hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <IconSearch className="h-4 w-4" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {receiptData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8"
          >
            <div className="relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute w-64 h-64 bg-teal-50 rounded-full -top-32 -right-20 opacity-50"></div>
              <div className="absolute w-32 h-32 bg-cyan-50 rounded-full bottom-10 -left-10 opacity-50"></div>
              
              {/* Receipt Main Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 relative z-10">
                {/* Receipt Header */}
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-5 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <IconReceipt className="h-5 w-5 text-white" />
                      <h2 className="text-xl font-bold text-white">Receipt #{receiptData.receipts[0].receipt_no}</h2>
                    </div>
                    <p className="text-teal-50 text-sm flex items-center gap-1">
                      <span className="bg-white/20 px-2 py-0.5 rounded text-white">
                        Ref: {receiptRefNo}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={handleChangeDonorClick}
                    className="px-4 py-2 bg-white text-teal-600 rounded-lg hover:bg-teal-50 font-medium shadow-sm transition-all flex items-center gap-2"
                  >
                    <IconEdit className="h-4 w-4" />
                    Change Donor
                  </button>
                </div>

                {/* Receipt Body */}
                <div className="p-6">
                  {/* Summary Bar */}
                  <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg mb-6 border border-teal-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-teal-500 rounded-lg text-white">
                        <IconCalendar className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-sm text-teal-700">Receipt Date</span>
                        <p className="font-medium text-gray-800">{receiptData.receipts[0].receipt_date}</p>
                      </div>
                    </div>
                    <div className="h-10 w-px bg-teal-200"></div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-cyan-500 rounded-lg text-white">
                        <IconCurrencyRupee className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-sm text-teal-700">Total Amount</span>
                        <p className="font-medium text-gray-800">₹{receiptData.receipts[0].receipt_total_amount}</p>
                      </div>
                    </div>
                    <div className="h-10 w-px bg-teal-200"></div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-violet-500 rounded-lg text-white">
                        <IconUser className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-sm text-teal-700">Donor Type</span>
                        <p className="font-medium text-gray-800">{receiptData.receipts[0].receipt_donation_type}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column - Receipt & Financial Details */}
                    <div className="lg:col-span-5">
                      {/* Receipt Details Card */}
                      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                          <div className="p-2.5 bg-teal-100 rounded-lg text-teal-600">
                            <IconReceipt className="h-5 w-5" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800">Receipt Details</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <span className="text-gray-500 w-40">Receipt Number:</span>
                            <span className="font-medium text-gray-800 bg-gray-50 px-3 py-1 rounded-md border border-gray-100">{receiptData.receipts[0].receipt_no}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-500 w-40">Date:</span>
                            <span className="font-medium text-gray-800 flex items-center gap-1.5">
                              <IconCalendar className="h-4 w-4 text-teal-500" />
                              {receiptData.receipts[0].receipt_date}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-500 w-40">Exemption Type:</span>
                            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium">
                              {receiptData.receipts[0].receipt_exemption_type}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-500 w-40">Donation Type:</span>
                            <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-medium">
                              {receiptData.receipts[0].receipt_donation_type}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Financial Details Card */}
                      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                          <div className="p-2.5 bg-cyan-100 rounded-lg text-cyan-600">
                            <IconCurrencyRupee className="h-5 w-5" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800">Financial Details</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-4 rounded-lg mb-4">
                            <span className="block text-teal-600 text-sm mb-1">Total Amount</span>
                            <span className="text-3xl font-bold text-gray-800">₹{receiptData.receipts[0].receipt_total_amount}</span>
                          </div>
                          <div className="pt-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                <span className="text-sm text-gray-600 font-medium">Payment Status</span>
                              </div>
                              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium">
                                Completed
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Donor Information */}
                    <div className="lg:col-span-7">
                      <div className="bg-white p-6 rounded-xl border border-violet-200 shadow-sm hover:shadow-md transition-shadow h-full">
                        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-violet-100 rounded-lg text-violet-600">
                              <IconUser className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Donor Information</h3>
                          </div>
                          <span className="px-3 py-1 bg-violet-50 text-violet-700 rounded-lg text-sm font-medium border border-violet-100">
                            Current Donor
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-center mb-6">
                          <div className="bg-violet-500 rounded-full p-6 text-white">
                            <IconUser className="w-10 h-10" />
                          </div>
                        </div>
                        
                        <div className="space-y-5">
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <span className="text-sm text-gray-500 block mb-1">Full Name</span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-lg text-gray-800">{receiptData.receipts[0].individual_company.indicomp_full_name}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                              <span className="text-sm text-gray-500 block mb-1">Promoter</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-800">{receiptData.receipts[0].individual_company.indicomp_promoter || 'N/A'}</span>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                              <span className="text-sm text-gray-500 block mb-1">Contact</span>
                              <div className="flex items-center gap-2">
                                <IconPhone className="h-4 w-4 text-violet-500" />
                                <span className="font-medium text-gray-800">
                                  {receiptData.receipts[0].individual_company.indicomp_mobile_phone || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-4 rounded-lg border border-violet-100">
                            <span className="text-sm text-violet-600 block mb-1">Chapter Information</span>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-violet-500 rounded-lg text-white">
                                <IconBuilding className="h-5 w-5" />
                              </div>
                              <div>
                                <span className="font-medium text-gray-800 flex items-center gap-2">
                                  {receiptData.receipts[0].chapter.chapter_name}
                                  <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">
                                    {receiptData.receipts[0].chapter.chapter_code}
                                  </span>
                                </span>
                                <span className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                  <IconMapPin className="h-3 w-3 text-violet-400" />
                                  {receiptData.receipts[0].chapter.chapter_city || 'Location not available'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Change Donor Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        sx={{
          backdropFilter: "blur(8px) saturate(180%)",
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            maxWidth: "900px",
            width: "100%",
            overflow: "hidden",
          },
        }}
        disableEnforceFocus
        disableAutoFocus
      >
        <div className="bg-white overflow-hidden">
          {/* Dialog Header */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <IconUsers className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-white text-xl font-semibold">
                  Change Receipt Donor
                </h1>
              </div>
              <Tooltip title="Close">
                <button
                  type="button"
                  className="text-white/70 hover:text-white transition-colors focus:outline-none"
                  onClick={() => setOpenDialog(false)}
                >
                  <IconCircleX className="w-6 h-6" />
                </button>
              </Tooltip>
            </div>
          </div>

          <div className="p-6">
            {/* Selected Donor Card */}
            {selectedDonor && (
              <div className="mb-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl overflow-hidden shadow-sm border border-teal-100">
                <div className="bg-teal-100/50 px-4 py-2 border-b border-teal-100 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-teal-800">Selected Donor</h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-teal-500 text-white">
                    <IconCheck className="w-3 h-3" />
                    Selected
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full p-3 text-white shadow-md">
                      <IconUser className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {selectedDonor.indicomp_full_name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1 gap-3">
                        <div className="flex items-center gap-1">
                          <IconPhone className="w-4 h-4 text-teal-500" />
                          {selectedDonor.indicomp_mobile_phone || 'N/A'}
                        </div>
                        <div className="flex items-center gap-1">
                          <IconMapPin className="w-4 h-4 text-teal-500" />
                          {selectedDonor.chapter_name || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Donors Table */}
            <div className="mb-4 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {donors.length > 0 ? (
                <MantineReactTable
                  columns={updateColumns}
                  data={donors || []}
                  enableFullScreenToggle={false}
                  enableDensityToggle={false}
                  enableHiding={false}
                  enableColumnActions={false}
                  enableStickyHeader={true}
                  enableStickyFooter={false}
                  mantineSearchTextInputProps={{
                    variant: 'filled',
                    placeholder: 'Search donors...',
                    sx: { borderRadius: '8px' }
                  }}
                  mantineTableContainerProps={{ 
                    sx: { 
                      maxHeight: "400px",
                      '& tr': {
                        height: '20px' 
                      }
                    } 
                  }}
                  initialState={{ 
                    density: 'xs', 
                    columnVisibility: { address: false },
                    showGlobalFilter: true,
                  }}
                  mantineTableBodyRowProps={({ row }) => ({
                    sx: {
                      backgroundColor: selectedDonor?.indicomp_fts_id === row.original.indicomp_fts_id 
                        ? '#e6fffa' 
                        : 'inherit',
                      '&:hover': {
                        backgroundColor: '#f9fafb',
                      },
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    },
                    onClick: () => setSelectedDonor(row.original),
                  })}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-gray-50">
                  <div className="animate-spin h-10 w-10 border-4 border-teal-500 rounded-full border-t-transparent mb-4"></div>
                  <p className="text-gray-600 text-center">Loading donors list...</p>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setOpenDialog(false)}
                className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors border border-gray-200"
              >
                Cancel
              </button>
              <button
                disabled={isUpdating || !selectedDonor}
                onClick={handleUpdateDonor}
                className={`px-5 py-2.5 text-white rounded-lg font-medium shadow-md flex items-center gap-2 transition-all ${
                  isUpdating || !selectedDonor 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                }`}
              >
                {isUpdating ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <IconCheck className="w-4 h-4" />
                    <span>Update Donor</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </Layout>
  );
};

export default SuperReceiptDonor;



// 3rd 

import React, { useMemo, useState } from 'react';
import Layout from '../../layout/Layout';
import axios from 'axios';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { 
  IconCircleX, 
  IconArrowRight, 
  IconEdit, 
  IconSearch, 
  IconUser, 
  IconUsers, 
  IconCalendar, 
  IconReceipt, 
  IconCurrencyRupee, 
  IconBuilding, 
  IconMapPin, 
  IconCheck, 
  IconFileInvoice,
  IconDeviceFloppy,
  IconPhone,
  IconX
} from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const SuperReceiptDonor = () => {
  const [receiptRefNo, setReceiptRefNo] = useState('');
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDonorSelection, setShowDonorSelection] = useState(false);
  const [donors, setDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchReceiptData = async () => {
    if (!receiptRefNo.trim()) {
      toast.warning('Please enter a receipt reference number');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://agsrb.online/api1/public/api/fetch-change-receipts-donor",
        { receipt_ref_no: receiptRefNo },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        setReceiptData(response.data);
        toast.success(response.data.toast?.msg || 'Receipt data fetched successfully');
      } else {
        toast.error(response.data.toast?.msg || 'Failed to fetch receipt data');
      }
    } catch (error) {
      console.error("Error fetching receipt data:", error);
      toast.error(error.response?.data?.toast?.msg || 'An error occurred while fetching receipt data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDonors = async () => {
    try {
      setShowDonorSelection(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://agsrb.online/api1/public/api/fetch-change-donors",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDonors(response.data.individualCompanies);
    } catch (error) {
      console.error("Error fetching donors:", error);
      toast.error("Failed to fetch donors list");
    }
  };

  const handleUpdateDonor = async () => {
    if (!selectedDonor) {
      toast.warning("Please select a donor first");
      return;
    }

    try {
      setIsUpdating(true);
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `https://agsrb.online/api1/public/api/update-change-receipts-donorD/${receiptData.receipts[0].id}`,
        {
          indicomp_fts_id: selectedDonor.indicomp_fts_id,
          receipt_ref_no: receiptRefNo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.code === 200) {
        toast.success(res.data.msg);
        setShowDonorSelection(false);
        // Refresh the receipt data with new donor
        const updatedResponse = await axios.post(
          "https://agsrb.online/api1/public/api/fetch-change-receipts-donor",
          { receipt_ref_no: receiptRefNo },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReceiptData(updatedResponse.data);
      } else {
        toast.error(res.data.msg);
      }
    } catch (error) {
      console.error("Error updating donor:", error);
      toast.error(error.response?.data?.msg || "Failed to update donor");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClear = () => {
    setReceiptRefNo('');
    setReceiptData(null);
    setShowDonorSelection(false);
    setSelectedDonor(null);
  };

  const updateColumns = useMemo(
    () => [
      {
        id: 'select',
        header: 'Select',
        size: 80,
        Cell: ({ row }) => (
          <button
            onClick={() => setSelectedDonor(row.original)}
            className={`px-3 py-1.5 text-xs rounded-full font-medium transition-all ${
              selectedDonor?.indicomp_fts_id === row.original.indicomp_fts_id
                ? 'bg-teal-500 text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {selectedDonor?.indicomp_fts_id === row.original.indicomp_fts_id ? (
              <span className="flex items-center justify-center gap-1">
                <IconCheck className="w-3 h-3" />
                Selected
              </span>
            ) : 'Select'}
          </button>
        ),
      },
      {
        accessorKey: 'indicomp_full_name',
        header: 'Donor Name',
        size: 150,
        Cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {selectedDonor?.indicomp_fts_id === row.original.indicomp_fts_id && (
              <IconArrowRight className="w-4 h-4 text-teal-500" />
            )}
            <span className={selectedDonor?.indicomp_fts_id === row.original.indicomp_fts_id ? "font-medium text-teal-600" : ""}>
              {row.original.indicomp_full_name}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'indicomp_mobile_phone',
        header: 'Mobile',
        size: 120,
        Cell: ({ cell, row }) => (
          <span className={selectedDonor?.indicomp_fts_id === row.original.indicomp_fts_id ? "text-teal-500" : "text-gray-800"}>
            {cell.getValue() || 'N/A'}
          </span>
        ),
      },
      {
        accessorKey: 'indicomp_type',
        header: 'Type',
        size: 100,
        Cell: ({ cell }) => (
          <span className="px-2 py-1 bg-violet-50 text-violet-700 rounded-md text-xs font-medium">
            {cell.getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'chapter_name',
        header: 'Chapter',
        size: 120,
        Cell: ({ cell }) => (
          <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-medium">
            {cell.getValue()}
          </span>
        ),
      },
    ],
    [selectedDonor]
  );

  return (
    <Layout>
      <div className="max-w-screen mx-auto p-6 bg-white rounded-xl">
        {/* Initial Search View */}
        {!receiptData && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center min-h-[70vh]"
          >
            <div className="w-full max-w-lg">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-3">Receipt Donor Management</h1>
                <p className="text-gray-600">Enter receipt reference number to view and update donor information</p>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconFileInvoice className="h-5 w-5 text-teal-500" />
                </div>
                <input
                  type="text"
                  value={receiptRefNo}
                  onChange={(e) => setReceiptRefNo(e.target.value)}
                  className="block w-full pl-10 pr-12 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent shadow-sm text-gray-800 bg-white text-center text-lg"
                  placeholder="eg.GEN/6/2024-25"
                  onKeyPress={(e) => e.key === 'Enter' && fetchReceiptData()}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    onClick={fetchReceiptData}
                    disabled={loading}
                    className={`p-2 rounded-lg text-white font-medium ${
                      loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-teal-500 hover:bg-teal-600'
                    }`}
                  >
                    {loading ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <IconSearch className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Receipt Data View */}
        <AnimatePresence>
          {receiptData && !showDonorSelection && (
            <motion.div
              key="receipt-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleClear}
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <IconX className="w-5 h-5" />
                    <span>Clear</span>
                  </button>
                  <h2 className="text-xl font-bold text-gray-800">
                    Receipt: <span className="text-teal-600">{receiptRefNo}</span>
                  </h2>
                </div>
                <button
                  onClick={fetchDonors}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-medium shadow-sm transition-all flex items-center gap-2"
                >
                  <IconEdit className="h-4 w-4" />
                  Change Donor
                </button>
              </div>

              {/* Compact Receipt Card */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                  {/* Receipt Info */}
                  <div className="p-5 border-b md:border-b-0 md:border-r border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                        <IconReceipt className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Receipt Details</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Receipt No.</span>
                        <p className="font-medium">{receiptData.receipts[0].receipt_no}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Date</span>
                        <p className="font-medium flex items-center gap-1">
                          <IconCalendar className="h-4 w-4 text-teal-500" />
                          {receiptData.receipts[0].receipt_date}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Amount</span>
                        <p className="font-medium text-lg text-teal-600 flex items-center gap-1">
                          <IconCurrencyRupee className="h-4 w-4" />
                          {receiptData.receipts[0].receipt_total_amount}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Current Donor Info */}
                  <div className="p-5 border-b md:border-b-0 md:border-r border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-violet-100 rounded-lg text-violet-600">
                        <IconUser className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Current Donor</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Name</span>
                        <p className="font-medium">{receiptData.receipts[0].individual_company.indicomp_full_name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Contact</span>
                        <p className="font-medium flex items-center gap-1">
                          <IconPhone className="h-4 w-4 text-violet-500" />
                          {receiptData.receipts[0].individual_company.indicomp_mobile_phone || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Chapter</span>
                        <p className="font-medium">
                          {receiptData.receipts[0].chapter.chapter_name} ({receiptData.receipts[0].chapter.chapter_code})
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Donation Info */}
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                        <IconCurrencyRupee className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Donation Info</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Type</span>
                        <p className="font-medium">
                          <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-medium">
                            {receiptData.receipts[0].receipt_donation_type}
                          </span>
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Exemption</span>
                        <p className="font-medium">
                          <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium">
                            {receiptData.receipts[0].receipt_exemption_type}
                          </span>
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Status</span>
                        <p className="font-medium">
                          <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium">
                            Completed
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Donor Selection View */}
        <AnimatePresence>
          {showDonorSelection && (
            <motion.div
              key="donor-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowDonorSelection(false)}
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <IconArrowRight className="w-5 h-5 transform rotate-180" />
                    <span>Back to Receipt</span>
                  </button>
                  <h2 className="text-xl font-bold text-gray-800">
                    Select New Donor for Receipt: <span className="text-teal-600">{receiptRefNo}</span>
                  </h2>
                </div>
              </div>

              {/* Selected Donor Preview */}
              {selectedDonor && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl overflow-hidden shadow-sm border border-teal-100"
                >
                  <div className="bg-teal-100/50 px-4 py-2 border-b border-teal-100 flex justify-between items-center">
                    <h3 className="text-sm font-medium text-teal-800">Selected Donor</h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-teal-500 text-white">
                      <IconCheck className="w-3 h-3" />
                      Selected
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full p-3 text-white shadow-md">
                        <IconUser className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {selectedDonor.indicomp_full_name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1 gap-3">
                          <div className="flex items-center gap-1">
                            <IconPhone className="w-4 h-4 text-teal-500" />
                            {selectedDonor.indicomp_mobile_phone || 'N/A'}
                          </div>
                          <div className="flex items-center gap-1">
                            <IconMapPin className="w-4 h-4 text-teal-500" />
                            {selectedDonor.chapter_name || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Donors Table */}
              <div className="mb-4 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                {donors.length > 0 ? (
                  <MantineReactTable
                    columns={updateColumns}
                    data={donors || []}
                    enableFullScreenToggle={false}
                    enableDensityToggle={false}
                    enableHiding={false}
                    enableColumnActions={false}
                    enableStickyHeader={true}
                    enableStickyFooter={false}
                    mantineSearchTextInputProps={{
                      variant: 'filled',
                      placeholder: 'Search donors...',
                      sx: { borderRadius: '8px' }
                    }}
                    mantineTableContainerProps={{ 
                      sx: { 
                        maxHeight: "400px",
                        '& tr': {
                          height: '20px' 
                        }
                      } 
                    }}
                    initialState={{ 
                      density: 'xs', 
                      columnVisibility: { address: false },
                      showGlobalFilter: true,
                    }}
                    mantineTableBodyRowProps={({ row }) => ({
                      sx: {
                        backgroundColor: selectedDonor?.indicomp_fts_id === row.original.indicomp_fts_id 
                          ? '#e6fffa' 
                          : 'inherit',
                        '&:hover': {
                          backgroundColor: '#f9fafb',
                        },
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      },
                      onClick: () => setSelectedDonor(row.original),
                    })}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 bg-gray-50">
                    <div className="animate-spin h-10 w-10 border-4 border-teal-500 rounded-full border-t-transparent mb-4"></div>
                    <p className="text-gray-600 text-center">Loading donors list...</p>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setShowDonorSelection(false)}
                  className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  disabled={isUpdating || !selectedDonor}
                  onClick={handleUpdateDonor}
                  className={`px-5 py-2.5 text-white rounded-lg font-medium shadow-md flex items-center gap-2 transition-all ${
                    isUpdating || !selectedDonor 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-teal-500 hover:bg-teal-600 hover:shadow-lg'
                  }`}
                >
                  {isUpdating ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <IconCheck className="w-4 h-4" />
                      <span>Update Donor</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default SuperReceiptDonor;