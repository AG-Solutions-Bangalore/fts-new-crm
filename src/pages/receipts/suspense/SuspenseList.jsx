import React, { useEffect, useMemo, useState } from 'react'
import Layout from '../../../layout/Layout'
import { IconEdit } from '@tabler/icons-react';
import axios from 'axios';
import {  DONOR_LIST, RECEIPT_SUSPENSE_LIST, RECEIPT_SUSPENSE_UPDATE } from '../../../api';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import moment from 'moment';
import {
  Dialog,
  FormLabel,
  Tooltip,
} from "@mui/material";
import { IconCircleX } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { FaPlus } from "react-icons/fa";
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
        console.error("error while fetching suspense  receipt list ", error);
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
      setOpenDialog(true);
      fetchDonors();
    };
  
    const handleUpdateSuspense = async () => {
      if (!selectedDonor) {
        toast.warning("Please select a donor first");
        return;
      }
  
      try {
        setIsUpdating(true);
        const token = localStorage.getItem("token");
       const res= await axios.put(
          `${RECEIPT_SUSPENSE_UPDATE}/${currentSuspenseId}`,
          {
            indicomp_fts_id: selectedDonor.indicomp_fts_id
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
            accessorKey: 'indicomp_full_name',
            header: 'Full Name',
            size: 20,
          },
          {
            accessorKey: 'indicomp_mobile_phone',
            header: 'Mobile',
            size: 20,
            Cell: ({ cell }) => cell.getValue() || 'N/A',
          },
          {
            id: 'actions',
            header: 'Action',
            Cell: ({ row }) => (
              <button
                onClick={() => setSelectedDonor(row.original)}
               className="flex items-center text-sm gap-1 px-2 py-1.5 bg-blue-500 hover:bg-green-500 text-white rounded-lg transition-colors"
              >
                <FaPlus className="h-3 w-3" />
                Select
              </button>
            ),
          },
    ],
    []
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
    mantineTableContainerProps: { sx: { maxHeight: "400px" } },
    initialState: { columnVisibility: { address: false } },
  });


  return (
    <Layout>
      <div className="max-w-screen">
        <div className="relative">
          <h2
            className="absolute top-3 left-2 z-50 text-lg px-4 font-bold
           text-black"
          >
         Suspense List
          </h2>
          <MantineReactTable table={table} />
        </div>
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
            >
              <div className="p-2 space-y-1 sm:w-[280px] md:w-[500px] bg-white rounded-lg shadow-md">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h1 className="text-slate-800 text-lg  font-semibold">
                      Update Suspense Receipt
                    </h1>
                    <div className="flex" onClick={() => setOpenDialog(false)}>
                      <Tooltip title="Close">
                        <button type="button" className="ml-3 pl-2">
                          <IconCircleX />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
      
                  <div className="mt-0 p-0">
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
      enableStickyFooter={true}
      mantineTableContainerProps={{ sx: { maxHeight: "400px" } }}
      initialState={{ columnVisibility: { address: false } }}
      mantineTableBodyRowProps={({ row }) => ({
        sx: {
          backgroundColor: selectedDonor?.id === row.original.id ? '#eff6ff' : 'inherit',
          '&:hover': {
            backgroundColor: '#f9fafb',
          },
        },
      })}
    />
  ) : (
    <p className="text-gray-500">Loading donors...</p>
  )}
</div>
      
                    {selectedDonor && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium">Selected Donor:</p>
                        <p>Name: {selectedDonor.indicomp_full_name}</p>
                        <p>Mobile: {selectedDonor.indicomp_mobile_phone || 'N/A'}</p>
                      </div>
                    )}
      
                    <div className="mt-0 flex justify-center">
                      <button
                        disabled={isUpdating || !selectedDonor}
                        onClick={handleUpdateSuspense}
                        className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 h-15 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUpdating ? "Updating..." : "Update"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Dialog>
    </Layout>
  );
}

export default SuspenseList