import React, { useEffect, useMemo, useState } from 'react'
import Layout from '../../../layout/Layout'
import { IconArrowRight, IconEdit } from '@tabler/icons-react';
import axios from 'axios';
import { DONOR_LIST, RECEIPT_SUSPENSE_LIST, RECEIPT_SUSPENSE_UPDATE } from '../../../api';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import moment from 'moment';
import {
  Dialog,
  FormLabel,
  Tooltip,
  Checkbox,
} from "@mui/material";
import { IconCircleX } from '@tabler/icons-react';
import { toast } from 'react-toastify';

const SuspenseList = () => {
  const [suspenseList, setSuspenseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [donors, setDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [currentSuspenseId, setCurrentSuspenseId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchSuspenseList = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${RECEIPT_SUSPENSE_LIST}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuspenseList(response.data.suspense);
    } catch (error) {
      console.error("error while fetching suspense receipt list ", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSuspenseList();
  }, []);

  const fetchDonors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${DONOR_LIST}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDonors(response.data.individualCompanies);
    } catch (error) {
      console.error("Error fetching donors:", error);
      toast.error("Failed to fetch donors list");
    }
  };

  const handleEditClick = (id) => {
    setCurrentSuspenseId(id);
    setSelectedDonor(null); // Reset selected donor when opening dialog
    setOpenDialog(true);
    fetchDonors();
  };

  const handleUpdateSuspense = async () => {
    if (!selectedDonor) {
      toast.warning("Please select a donor first");
      return;
    }
    const currentSuspense = suspenseList.find(item => item.id === currentSuspenseId);
  
    try {
      setIsUpdating(true);
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${RECEIPT_SUSPENSE_UPDATE}/${currentSuspenseId}`,
        {
          indicomp_fts_id: selectedDonor.indicomp_fts_id,
          receipt_ref_no: currentSuspense?.receipt_ref_no || null,
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
        fetchSuspenseList();
      } else {
        toast.error(res.data.msg);
        setIsUpdating(false);
      }
    } catch (error) {
      console.error("Error updating suspense:", error);
      toast.error("Failed to update suspense receipt");
    } finally {
      setIsUpdating(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "receipt_no",
        header: "Receipt No",
        enableHiding: false,
        size: 20,
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
      {
        id: "id",
        header: "Action",
        size: 50,
        Cell: ({ row }) => {
          const id = row.original.id;
          const receiptRef = row.original.receipt_ref_no;
          return (
            <div className="flex gap-2">
              <div
                title="Update Suspense"
                onClick={() => handleEditClick(id)}
                className="flex items-center space-x-2"
              >
                <IconEdit className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div>
            </div>
          );
        },
      },
    ],
    []
  );

 
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
  
     
    ],
    [selectedDonor]
  );

  const table = useMantineReactTable({
    columns,
    data: suspenseList || [],
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
           Suspense List
      </h2>
    ),
  });

  return (
    <Layout>
      <div className="max-w-screen">
      
          <MantineReactTable table={table} />
    
      </div>
      
      {/* Update Suspense Dialog */}
      <Dialog
         open={openDialog}
         onClose={() => setOpenDialog(false)}
         keepMounted
         aria-describedby="alert-dialog-slide-description"
         sx={{
           backdropFilter: "blur(5px) sepia(5%)",
           "& .MuiDialog-paper": {
             borderRadius: "8px",
           },
         }}
      
         disableEnforceFocus
         disableAutoFocus
      >
        <div className="p-4 space-y-2  container bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-2">
  <div className="flex-1 min-w-0">

      <h1 className="text-slate-800 text-lg font-semibold ">
        Update Suspense Receipt
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
          
      
       

          {/* {selectedDonor && (
  <div className="mb-2 px-2 py-1 bg-blue-500/10 border border-gray-200 w-full rounded-md flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs sm:text-sm">
    <span className="font-medium text-indigo-600 whitespace-nowrap flex items-center gap-1">
      <svg className="w-3 h-3 text-indigo-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span className="hidden xs:inline">Selected</span> Donor
    </span>
    
    <div className="h-3 w-px bg-gray-300"></div>
    
    <span className="text-gray-900 font-medium whitespace-nowrap">
      {selectedDonor.indicomp_full_name}
    </span>
    
    <div className="flex items-center gap-0.5 text-gray-700 whitespace-nowrap">
      <svg className="w-2.5 h-2.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
      </svg>
      <span>{selectedDonor.indicomp_mobile_phone || 'N/A'}</span>
    </div>
  </div>
)} */}
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
          
          <div className="mt-2 flex justify-center">
            <button
              disabled={isUpdating || !selectedDonor}
              onClick={handleUpdateSuspense}
              className={`text-center text-sm font-medium w-36 h-10 text-white rounded-lg shadow-md ${
                isUpdating || !selectedDonor 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors`}
            >
              {isUpdating ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </Dialog>
    </Layout>
  );
}

export default SuspenseList;
