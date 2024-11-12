import React, { useEffect, useMemo, useState } from 'react'
import Layout from '../../layout/Layout'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../base/BaseUrl';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { IconEdit, IconEye } from '@tabler/icons-react';

const ReceiptList = () => {
    const [receiptList, setReceiptList] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const userType = localStorage.getItem("user_type_id");
    useEffect(() => {
        const fetchReciptList = async () => {
          try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${BASE_URL}/api/fetch-receipts`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setReceiptList(response.data.receipts);
          } catch (error) {
            console.error("error while fetching  receipt list ", error);
          } finally {
            setLoading(false);
          }
        };
        fetchReciptList();
        setLoading(false);
      }, []);


      const columns = useMemo(
        () => [
          {
            accessorKey: "receipt_no",
            header: "Receipt No",
            enableHiding: false,
            size: 20,
           
          },
          {
            accessorKey: "individual_company.indicomp_full_name",
            header: "Name",
         
            Cell: ({ row }) => {
                const fullName = row.original.individual_company.indicomp_full_name;
                return <span>{fullName}</span>;
              },
          },
          {
            accessorKey: "receipt_date",
            header: "Date",
            size: 150,
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
            size:50,
           
          },
          
      
          
          {
            id: "id",
            header: "Action",
            size:50,
            Cell: ({ row }) => {
              const id = row.original.id;
    
              return (
                <div className="flex gap-2">
                  
    
                  <div
                
                  onClick={()=>navigate(`/view-receipts/${id}`)}
                   title='Receipt View'
                    className="flex items-center space-x-2"
                  >
                    <IconEye title="View" className="h-5 w-5 cursor-pointer" />
                  </div>
                  <div
                  title='Receipt Edit'
                  onClick={()=>navigate(`/receipt-edit/${id}`)}
                    className="flex items-center space-x-2"
                  >
                    <IconEdit  className="h-5 w-5 cursor-pointer" />
                  </div>
                  
                </div>
              );
            },
          
          },
        ],
        []
      );
    
      const table = useMantineReactTable({
        columns,
        data: receiptList || [],
        enableFullScreenToggle: false,
        enableDensityToggle: false,
        enableHiding:false,
        enableColumnActions: false,
        enableStickyHeader:true,
        enableStickyFooter:true,
        mantineTableContainerProps: { sx: { maxHeight: '400px' } },
        initialState:{ columnVisibility: { address: false } },
                
        
       
      });
  return (
    <Layout>
      <div className="max-w-screen">
          <div className=" flex justify-between gap-2 bg-white p-4 mb-4 rounded-lg shadow-md">
            <h1 className="border-b-2  font-[400] border-dashed border-orange-800">
              Receipt List
            </h1>
           
          </div>
          <div className=" shadow-md">
            <MantineReactTable table={table}
              
                  
            
            />
          </div>
        </div>
    </Layout>
  )
}

export default ReceiptList