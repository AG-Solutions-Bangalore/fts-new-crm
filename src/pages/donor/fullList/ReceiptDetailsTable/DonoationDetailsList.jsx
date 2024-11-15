import React, { useEffect, useMemo, useState } from 'react'
import BASE_URL from '../../../../base/BaseUrl';
import axios from 'axios';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import moment from 'moment';
import { IconInfoCircle } from '@tabler/icons-react';

const DonoationDetailsList = ({viewerId}) => {
    const [loader, setLoader] = useState(false);
    const [donation, setDonation] = useState([]);
    useEffect(() => {
        axios
          .get(`${BASE_URL}/api/fetch-donor-receipt-by-id/${viewerId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            setDonation(res.data.donor_receipts);
          
          
            setLoader(false);
         
          });
      }, [viewerId]);

      const columns = useMemo(
        () => [
          {
            accessorKey: "receipt_no",
            header: "Receipt No",
            size:50,
          
          },
         
          {
            accessorKey: "indicomp_full_name",
            header: "Full Name",
            size:50,
          },
          {
            accessorKey: "receipt_date",
            header: "Date",
          
            Cell:({row})=>{
                const date = row.original.receipt_date
                return moment.utc(date).format("DD-MM-YYYY");
            }

          },
          {
            accessorKey: "receipt_total_amount",
            header: "Amount",
            size:50,
           
          },
          
        ],
        []
      );
    
      const table = useMantineReactTable({
        columns,
        data: donation || [],
        enableFullScreenToggle: false,
        enableDensityToggle: false,
        enableColumnActions: false,
        enableHiding:false,
     
      });
  return (
   <div>
     <div className="sticky top-0 z-10 bg-white shadow-md rounded-xl ">
        <div className="bg-[#E1F5FA] p-4 rounded-t-xl border-b-2 border-green-500">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <IconInfoCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-sm font-semibold text-black">Donation Details</h2>
            </div>

          </div>
        </div>

       
      </div>
     <div className=" shadow-md">
    <MantineReactTable table={table} />
  </div>
   </div>
  )
}

export default DonoationDetailsList




