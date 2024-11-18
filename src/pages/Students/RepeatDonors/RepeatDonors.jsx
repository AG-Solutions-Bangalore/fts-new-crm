import React, { useContext, useEffect, useMemo, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconEdit } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const RepeatDonors = () => {
  const [repeatDonor, setRepeatDonor] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentYear, setCurrentYear] = useState("");
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");
  // Fetch current year
  const fetchYearData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/fetch-year`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentYear(response.data.year.current_year);
    } catch (error) {
      console.error("Error fetching year data:", error);
    }
  };

  // Fetch repeat donor data
  const fetchRepeatDonorData = async () => {
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/fetch-receipt-duplicate/${currentYear}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRepeatDonor(response.data?.receipts || []);
    } catch (error) {
      console.error("Error fetching repeat donor data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch year data on component mount
  useEffect(() => {
    fetchYearData();
  }, []);

  // Fetch repeat donor data when currentYear changes
  useEffect(() => {
    if (currentYear) {
      fetchRepeatDonorData();
    }
  }, [currentYear]);
  const columns = useMemo(
    () => [
      
      {
        accessorKey: "individual_company.indicomp_full_name",
        header: "Full Name",
        size: 50,
        Cell:({row})=>{
          const fullName = row.original.individual_company.indicomp_full_name
          return fullName
        }
      },
      {
        accessorKey: "individual_company.indicomp_type",
        header: "Type",
        size: 50,
        Cell:({row})=>{
          const type = row.original.individual_company.indicomp_type
          return type
        }
      },
      {
        accessorKey: "individual_company.indicomp_mobile_phone",
        header: "Mobile",
        size: 50,
        Cell:({row})=>{
          const mobile = row.original.individual_company.indicomp_mobile_phone
          return   !mobile || mobile === "null" ? "N/A" : mobile;
        }
      },
      {
        accessorKey: "individual_company.indicomp_email",
        header: "Email",
        size: 50,
        Cell:({row})=>{
          const email = row.original.individual_company.indicomp_email
          return email
        }
      },
    
    
      {
        id: "id",
        header: localStorage.getItem("id") === "1" ? "Alloted List" : "",
        size: 50,
        enableHiding: false,
        Cell: ({ row }) => {
          const id = row.original.indicomp_fts_id;
          console.log("id",id)

          return (
            <div className="flex gap-2">
              <div
                onClick={() => navigate(`/repeat-donor-allot/${id}`)}
                className="flex items-center space-x-2"
                title="Edit"
                style={{
                  display: localStorage.getItem("id") == 1 ? "" : "none",
                }}
              >
                <IconEdit  className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div>

              
              {/* {userType == "1" ? (
                <div
                  onClick={toggleReceiptDrawer(true, id)}
                  className="flex items-center space-x-2"
                   title="Create Reciept"
                >
                  <IconReceipt
                   
                    className="h-5 w-5 text-blue-500 cursor-pointer"
                  />
                </div>
              ) : (
                ""
              )} */}
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: repeatDonor || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding:false,
    enableStickyHeader:true,
    enableStickyFooter:true,
    mantineTableContainerProps: { sx: { maxHeight: '400px' } },
   
    
  });

  return (
    <Layout>
      <div className="max-w-screen">
          <div className=" flex justify-between gap-2 bg-white p-4 mb-4 rounded-lg shadow-md">
            <h1 className="border-b-2  font-[400] border-dashed border-orange-800">
              Repeat Donor List
            </h1>
           
          </div>
          <div className=" shadow-md">
            <MantineReactTable table={table} />
          </div>
        </div>
    </Layout>
  );
};

export default RepeatDonors;
