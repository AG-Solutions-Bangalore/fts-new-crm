import React, { useEffect, useMemo, useState } from 'react'
import BASE_URL from '../../../../base/BaseUrl';
import axios from 'axios';
import { IconInfoCircle } from '@tabler/icons-react';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import moment from 'moment';
import { FAMILY_DETAILS_LIST } from '../../../../api';

const FamilyDetails = ({viewerId}) => {
    const [donorfam, setDonorFam] = useState([]);
    const [loader, setLoader] = useState(false);

    const fetchFamilyDetails = async () => {
      try {
        setLoader(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${FAMILY_DETAILS_LIST}/${viewerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setDonorFam(response.data.family_details);
      } catch (error) {
        console.error("Error fetching Family details list data", error);
      } finally {
        setLoader(false);
      }
    };

    useEffect(() => {
      if(viewerId){
        fetchFamilyDetails()
      }
     
          
      }, [viewerId]);
  
    
      const columns = useMemo(
        () => [
          {
            accessorKey: "indicomp_fts_id",
            header: "Fts Id",
            size: 50,
          },
    
          {
            accessorKey: "indicomp_full_name",
            header: "Full Name",
            size: 50,
           
          },
          {
            accessorKey: "indicomp_dob_annualday",
            header: "DOB",
    
            Cell: ({ row }) => {
              const date = row.original.indicomp_dob_annualday;
       
              return (
                <>
                 {date ? 
                    moment.utc(date).format("DD-MM-YYYY") : 
                    'N/A'
                  }
                </>
              )
             
            },
          },
          {
            accessorKey: "indicomp_mobile_phone",
            header: "Mobile",
            size: 50,
          },
        ],
        []
      );
    
      const table = useMantineReactTable({
        columns,
        data: donorfam || [],
        enableFullScreenToggle: false,
        enableDensityToggle: false,
        enableColumnActions: false,
        enableHiding: false,
      });
  return (
    <div>
    <div className="sticky top-0 z-10 bg-white shadow-md rounded-xl ">
      <div className="bg-[#E1F5FA] p-4 rounded-t-xl border-b-2 border-green-500">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <IconInfoCircle className="w-5 h-5 text-green-600" />
            <h2 className="text-sm font-semibold text-black">
              Family Details
            </h2>
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

export default FamilyDetails