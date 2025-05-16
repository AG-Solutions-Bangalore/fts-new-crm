import React, { useContext, useEffect, useMemo, useState } from "react";
import Layout from "../../../layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IconEdit, IconEye, IconReceipt } from "@tabler/icons-react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import AddIndivisual from "./AddIndivisual";
import AddCompany from "./AddCompany";
import DonorView from "./DonorView";
import { DONOR_LIST, navigateToCreateReceipt, navigateToDonorEdit } from "../../../api";
import { ContextPanel } from "../../../utils/ContextPanel";

const DonorList = () => {
  const [donorData, setDonorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userType = localStorage.getItem("user_type_id");
  const { isPanelUp } = useContext(ContextPanel);
  
  // Drawer states
  const [individualDrawer, setIndividualDrawer] = useState(false);
  const [companyDrawer, setCompanyDrawer] = useState(false);
  const [viewerDrawer, setViewerDrawer] = useState(false);
  const [selectedViewerId, setSelectedViewerId] = useState(null);

  const fetchDonorData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(DONOR_LIST, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonorData(response.data?.individualCompanies || []);
    } catch (error) {
      console.error("Error fetching donor data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonorData();
  }, []);

  // Drawer handlers
  const toggleIndividualDrawer = (open) => (event) => {
    if (event?.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setIndividualDrawer(open);
  };

  const toggleCompanyDrawer = (open) => (event) => {
    if (event?.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setCompanyDrawer(open);
  };

  const toggleViewerDrawer = (open, id = null) => (event) => {
    if (event?.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setViewerDrawer(open);
    if (id) setSelectedViewerId(id);
  };

  const columns = useMemo(() => [
    {
      accessorKey: "indicomp_full_name",
      header: "Full Name",
      size: 150,
    },
    {
      accessorKey: "indicomp_type",
      header: "Type",
      size: 50,
    },
    {
      accessorKey: "spouse_contact",
      header: "Spouse/Contact",
      size: 150,
      Cell: ({ row }) => {
        const { indicomp_type, indicomp_spouse_name, indicomp_com_contact_name } = row.original;
        return indicomp_type === "Individual" ? indicomp_spouse_name : indicomp_com_contact_name;
      },
    },
    {
      accessorKey: "indicomp_mobile_phone",
      header: "Mobile",
      size: 50,
    },
    {
      accessorKey: "indicomp_email",
      header: "Email",
      size: 150,
    },
    ...(userType === "4" ? [{
      accessorKey: "chapter_name",
      header: "Chapter",
      size: 50,
      Cell: ({ row }) => <span>{row.original.chapter_name?.split(" ")[0]}</span>,
    }] : []),
    {
      id: "actions",
      header: "Action",
      size: 20,
      Cell: ({ row }) => {
        const id = row.original.id;
        return (
          <div className="flex gap-2">
            {(userType === "1" || userType === "2") && (
              <IconEdit 
                className="h-5 w-5 text-blue-500 cursor-pointer" 
                onClick={() => navigateToDonorEdit(navigate, id)}
                title="Edit"
              />
            )}
            <IconEye 
              className="h-5 w-5 text-blue-500 cursor-pointer" 
              onClick={toggleViewerDrawer(true, id)}
              title="View"
            />
            {userType === "1" && (
              <IconReceipt 
                className="h-5 w-5 text-blue-500 cursor-pointer" 
                onClick={() => navigateToCreateReceipt(navigate, id)}
                title="Create Receipt"
              />
            )}
          </div>
        );
      },
    },
  ], [userType, navigate]);

  const table = useMantineReactTable({
    columns,
    data: donorData,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding: false,
    state: { isLoading: loading },
    enableStickyHeader: true,
    enableStickyFooter: true,
    mantineTableContainerProps: { sx: { maxHeight: "400px" } },
    mantineProgressProps: {
      color: 'blue',
      variant: 'bars',
    },
  });

  return (
    <Layout>
      <div className="max-w-screen">
        <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
            <h1 className="border-b-2 font-[400] border-dashed border-orange-800">
              Donor List
            </h1>
            {userType === "1" && (
              <div className="flex flex-col md:flex-row gap-2">
                <button
                 className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-full md:w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                  onClick={toggleIndividualDrawer(true)}
                >
                  + Individual
                </button>
                <button
                className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-full md:w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                  onClick={toggleCompanyDrawer(true)}
                >
                  + Company
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="shadow-md">
          <MantineReactTable table={table} />
        </div>
      </div>

      {/* Drawers */}
      <SwipeableDrawer
        anchor="right"
        open={individualDrawer}
        onClose={toggleIndividualDrawer(false)}
        onOpen={toggleIndividualDrawer(true)}
      >
        <AddIndivisual
          onClose={toggleIndividualDrawer(false)}
          fetchDonorData={fetchDonorData}
          isOpen={individualDrawer}
          isPanelUp={isPanelUp}
        />
      </SwipeableDrawer>

      <SwipeableDrawer
        anchor="right"
        open={companyDrawer}
        onClose={toggleCompanyDrawer(false)}
        onOpen={toggleCompanyDrawer(true)}
      >
        <AddCompany
          onClose={toggleCompanyDrawer(false)}
          fetchDonorData={fetchDonorData}
          isOpen={companyDrawer}
          isPanelUp={isPanelUp}
        />
      </SwipeableDrawer>

      <SwipeableDrawer
        anchor="right"
        open={viewerDrawer}
        onClose={toggleViewerDrawer(false)}
        onOpen={toggleViewerDrawer(true)}
      >
        <DonorView
          viewerId={selectedViewerId}
          onClose={toggleViewerDrawer(false)}
        />
      </SwipeableDrawer>
    </Layout>
  );
};

export default DonorList;

//sajid