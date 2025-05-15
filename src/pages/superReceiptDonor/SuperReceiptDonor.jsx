import React, { useMemo, useState } from 'react';
import Layout from '../../layout/Layout';
import axios from 'axios';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { 
   
  IconArrowRight, 
  IconEdit, 
  IconSearch, 
  IconUser, 
  IconUsers, 
  IconCalendar, 
  IconReceipt, 
  IconCurrencyRupee, 
 
  IconMapPin, 
  IconCheck, 
  IconFileInvoice,
  
  IconPhone,
  IconX
} from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import BASE_URL from '../../base/BaseUrl';

const SuperReceiptDonor = () => {
  const [receiptRefNo, setReceiptRefNo] = useState('');
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDonorSelection, setShowDonorSelection] = useState(false);
  const [donors, setDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const fetchReceiptData = async () => {
    if (!receiptRefNo.trim()) {
      toast.warning('Please enter a receipt reference number');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/fetch-change-receipts-donor`,
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
        `${BASE_URL}/api/fetch-change-donors`,
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
        `${BASE_URL}/api/update-change-receipts-donor/${receiptData.receipts[0].id}`,
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
        
      setSelectedDonor(null)
        const updatedResponse = await axios.post(
          `${BASE_URL}/api/fetch-change-receipts-donor`,
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
      <div className="max-w-screen mx-auto p-4 md:p-6 bg-white/90 rounded">
        {/* Initial Search View */}
        {!receiptData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center justify-center min-h-[70vh]"
          >
            <div className="w-full max-w-lg mx-auto px-4">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-center mb-8"
              >
                <h1 className="text-3xl  font-bold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent mb-4">
                  Change Receipt Donor 
                </h1>
                <p className="text-gray-600 text-sm max-w-md mx-auto">
                  Enter receipt reference number to view and update donor information
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="relative"
              >
                <div className={`bg-white border border-black shadow-xl rounded-2xl overflow-hidden transition-all duration-300 transform ${
                  searchFocused ? 'scale-105 shadow-teal-100' : ''
                }`}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <motion.div
                      animate={{ rotate: searchFocused ? [0, -10, 10, -10, 0] : 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <IconFileInvoice className={`h-6 w-6 transition-colors duration-300 ${
                        searchFocused ? 'text-teal-500' : 'text-gray-400'
                      }`} />
                    </motion.div>
                  </div>
                  
                  <input
                    type="text"
                    value={receiptRefNo}
                    onChange={(e) => setReceiptRefNo(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="block w-full pl-12 pr-20 py-5 border-none focus:outline-none focus:ring-0 text-gray-800 bg-white text-center text-lg md:text-xl font-medium placeholder:text-gray-400 placeholder:font-normal"
                    placeholder="eg. GEN/6/2024-25"
                    onKeyPress={(e) => e.key === 'Enter' && fetchReceiptData()}
                  />
                  
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={fetchReceiptData}
                      disabled={loading}
                      className={`px-4 py-2 rounded-xl text-white font-medium transition-all ${
                        loading 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-md'
                      }`}
                    >
                      {loading ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>Search</span>
                          <IconSearch className="h-4 w-4" />
                        </div>
                      )}
                    </motion.button>
                  </div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="mt-4 text-center"
                >
                  <p className="text-sm text-gray-500">Press Enter or click Search to find receipt</p>
                </motion.div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mt-16 flex flex-col items-center justify-center"
              >
                <div className="flex flex-wrap gap-3 justify-center">
                  <div className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium flex items-center gap-1">
                    <IconReceipt className="w-4 h-4" />
                    <span>Manage Receipts</span>
                  </div>
                  <div className="px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg text-sm font-medium flex items-center gap-1">
                    <IconUsers className="w-4 h-4" />
                    <span>Update Donors</span>
                  </div>
                  <div className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium flex items-center gap-1">
                    <IconCheck className="w-4 h-4" />
                    <span>Easy Process</span>
                  </div>
                </div>
              </motion.div>
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
              className=""
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClear}
                    className="flex items-center gap-1 text-gray-600 hover:text-white transition-colors  rounded-lg px-2 bg-gradient-to-t  hover:from-teal-600 hover:to-cyan-600"
                  >
                    <IconX className="w-5 h-5" />
                    <span>Clear</span>
                  </motion.button>
                  <h2 className="text-xl font-bold text-gray-800">
                    Receipt: <span className="text-teal-600">{receiptRefNo}</span>
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={fetchDonors}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 font-medium shadow-md transition-all flex items-center gap-2 w-full md:w-auto justify-center"
                >
                  <IconEdit className="h-4 w-4" />
                  Change Donor
                </motion.button>
              </div>

              {/* Compact Receipt Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
              >
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
                        <span className="text-sm text-gray-500">Receipt Id</span>
                        <p className="font-medium text-lg flex items-center gap-1">
                       
                          {receiptData.receipts[0].id}
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
                        <span className="text-sm text-gray-500">Promoter</span>
                        <p className="font-medium flex items-center gap-1">
                          <IconPhone className="h-4 w-4 text-violet-500" />
                          {receiptData.receipts[0].individual_company.indicomp_promoter || 'N/A'}
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
                        <span className="text-sm text-gray-500">Amount</span>
                        <p className="font-medium text-lg text-teal-600 flex items-center gap-1">
                          <IconCurrencyRupee className="h-4 w-4" />
                          {receiptData.receipts[0].receipt_total_amount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
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
              className=""
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDonorSelection(false)}
                    className="flex items-center gap-1 text-gray-600 hover:text-white transition-colors rounded-lg hover:px-2 bg-gradient-to-t  hover:from-teal-600 hover:to-cyan-600 "
                  >
                    <IconArrowRight className="w-5 h-5 transform rotate-180" />
                    <span>Back to Receipt</span>
                  </motion.button>
                  <h2 className="text-xl font-bold text-gray-800">
                    Select New Donor for Receipt: <span className="text-teal-600">{receiptRefNo}</span>
                  </h2>
                </div>
                 <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className=" flex flex-col-reverse sm:flex-row justify-end gap-4"
              >
              
                <motion.button
                  whileHover={!isUpdating && selectedDonor ? { scale: 1.03 } : {}}
                  whileTap={!isUpdating && selectedDonor ? { scale: 0.97 } : {}}
                  disabled={isUpdating || !selectedDonor}
                  onClick={handleUpdateDonor}
                  className={`px-3 py-1 text-white rounded-lg font-medium shadow-md flex items-center justify-center gap-2 transition-all ${
                    isUpdating || !selectedDonor 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 hover:shadow-lg'
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
                </motion.button>
              </motion.div>
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
                        <div className="flex flex-wrap items-center text-sm text-gray-600 mt-1 gap-3">
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
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="mb-4 border border-gray-200 rounded-xl overflow-hidden shadow-sm"
              >
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
              </motion.div>
              
              {/* Action Buttons */}
              {/* <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowDonorSelection(false)}
                  className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors border border-gray-200"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={!isUpdating && selectedDonor ? { scale: 1.03 } : {}}
                  whileTap={!isUpdating && selectedDonor ? { scale: 0.97 } : {}}
                  disabled={isUpdating || !selectedDonor}
                  onClick={handleUpdateDonor}
                  className={`px-5 py-2.5 text-white rounded-lg font-medium shadow-md flex items-center justify-center gap-2 transition-all ${
                    isUpdating || !selectedDonor 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 hover:shadow-lg'
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
                </motion.button>
              </motion.div> */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default SuperReceiptDonor;


