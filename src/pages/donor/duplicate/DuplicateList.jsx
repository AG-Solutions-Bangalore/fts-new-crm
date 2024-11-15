import React, { useEffect, useMemo, useState } from 'react'
import Layout from '../../../layout/Layout'
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../../base/BaseUrl';

const DuplicateList = () => {
    const [duplicateData, setDuplicateData] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const userType = parseInt(localStorage.getItem("user_type_id"), 10);
  
  
    
    useEffect(() => {
      const fetchDuplicateData = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${BASE_URL}/api/fetch-donors-duplicate`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          setDuplicateData(response.data?.individualCompanies);
        } catch (error) {
          console.error("Error fetching duplicate data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDuplicateData();
      setLoading(false);
    }, []);
  
    const handleDuplicateDelete = async (e, id) => {
      e.preventDefault();
      axios({
          url: BASE_URL+"/api/update-donors-duplicate-by-id/"+id,
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }).then((res) => {
          toast.success("Data Updated Sucessfully");
          
          navigate('/donor-list')
          
        })
    };
  
    


    const columns = useMemo(
        () => [
          {
            accessorKey: "id",
            header: "Fts Id",
           
          },
          {
            accessorKey: "indicomp_full_name",
            header: "Name",
          },
          {
            accessorKey: "indicomp_type",
            header: "Type",
          },
          {
            accessorKey: "indicomp_spouse_name",
            header: "Spouse",
           
          },
          {
            accessorKey: "indicomp_com_contact_name",
            header: "Contact",
          
          },
         
          {
            accessorKey: "indicomp_mobile_phone",
            header: "Mobile",
          },
          {
            accessorKey: "indicomp_email",
            header: "Email",
          },
          {
            accessorKey: "receipt_count",
            header: "Receipt Count",
          },
          
          {
            id: "id",
            header: "Action",
            Cell: ({ row }) => {
              const id = row.original.id;
    
              return (
                <>
            <div
              onClick={(e) => handleDuplicateDelete(e, id)}
              className="flex items-center space-x-2"
            >
              <IconTrash title="Delete" className="h-5 w-5 cursor-pointer" />
            </div>
            {/* <div
              onClick={(e) => handleDuplicateDelete(e, id)}
              className="flex items-center space-x-2"
            >
              <FaDeleteLeft title="Delete" className="h-5 w-5 cursor-pointer" />
            </div> */}
            </>
              );
            },
          },
        ],
        []
      );

    const table = useMantineReactTable({
        columns,
        data: duplicateData || [],
        enableFullScreenToggle: false,
        enableDensityToggle: false,
        enableColumnActions: false,
        enableHiding:false,
      
      });
  return (
   <Layout>
      <div className="max-w-screen">
          <div className=" flex justify-between gap-2 bg-white p-4 mb-4 rounded-lg shadow-md">
            <h1 className="border-b-2  font-[400] border-dashed border-orange-800">
              Duplicate List
            </h1>

            
          </div>
          <div className="p-2 mb-4  rounded-lg bg-[#D0F6F2]">
        <p>
          Duplicate Criteria: If Mobile Number is Same or Donor Name is Same.
          <br />
          (Note: All the below data is not 100% duplicate. It is all recommended
          data that may be duplicated. Please make the changes very carefully.
          We advise you to make a note before removing.)
        </p>
      </div>
          <div className=" shadow-md">
            <MantineReactTable table={table} />
          </div>
        </div>
   </Layout>
  )
}

export default DuplicateList