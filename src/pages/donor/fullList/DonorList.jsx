import React, { useContext, useEffect, useMemo, useState } from "react";
import Layout from "../../../layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { IconEdit, IconEye, IconReceipt } from "@tabler/icons-react";

import SwipeableDrawer from "@mui/material/SwipeableDrawer";

import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import AddIndivisual from "./AddIndivisual";
import AddCompany from "./AddCompany";
import CreateReceipt from "./CreateReceipt";
import DonorView from "./DonorView";
import { encryptId } from "../../../utils/encyrption/Encyrption";
import { DONOR_LIST, navigateToCreateReceipt, navigateToDonorEdit, navigateToReceiptEdit } from "../../../api";
import { ContextPanel } from "../../../utils/ContextPanel";

const DonorList = () => {
  const [donorData, setDonorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userType = localStorage.getItem("user_type_id");
  const { isPanelUp } = useContext(ContextPanel);
  const [columnVisibility, setColumnVisibility] = useState({
    indicomp_spouse_name: false,
    indicomp_com_contact_name: false,
    indicomp_fts_id: false,
  });

  const [individualDrawer, setIndividualDrawer] = useState(false);
  const [companyDrawer, setCompanyDrawer] = useState(false);
  const [receiptDrawer, setReceiptDrawer] = useState(false);
  const [selectedDonorId, setSelectedDonorId] = useState(null);
  const [viewerDrawer, setViewerDrawer] = useState(false);
  const [selectedViewerId, setSelectedViewerId] = useState(null);

  const toggleIndividualDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIndividualDrawer(open);
  };

  const toggleCompanyDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setCompanyDrawer(open);
  };
  const toggleReceiptDrawer =
    (open, id = null) =>
    (event) => {
      if (
        event &&
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }
      setReceiptDrawer(open);
      if (id) setSelectedDonorId(id);
    };
  const toggleViewerDrawer =
    (open, id = null) =>
    (event) => {
      if (
        event &&
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }
      setViewerDrawer(open);
      if (id) setSelectedViewerId(id);
    };

  const fetchDonorData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${DONOR_LIST}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDonorData(response.data?.individualCompanies);
    } catch (error) {
      console.error("Error fetching Factory data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonorData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "indicomp_fts_id",
        header: "Fts Id",
        isVisible: columnVisibility.indicomp_fts_id,
        enableHiding: false,
      },
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
        accessorKey: "indicomp_spouse_name",
        header: "Spouse",
        isVisible: columnVisibility.indicomp_spouse_name,
        enableHiding: false,
      },
      {
        accessorKey: "indicomp_com_contact_name",
        header: "Contact",
        isVisible: columnVisibility.indicomp_com_contact_name,
        enableHiding: false,
      },
      {
        accessorKey: "spouse_contact",
        header: "Spouse/Contact",
        size: 150,
        Cell: ({ value, row }) => {
          const indicompType = row.original.indicomp_type;
          const spouseRow = row.original?.indicomp_spouse_name;
          const contactRow = row.original?.indicomp_com_contact_name;
          if (indicompType === "Individual") {
            return spouseRow;
          } else {
            return contactRow;
          }
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
        Cell: ({ value, row }) => {
          const valueData = row.original?.indicomp_email;

          return <div>{valueData}</div>;
        },
      },
      ...(userType === "4"
        ? [
            {
              accessorKey: "chapter_name",
              header: "Chapter",
              size: 50,
            },
          ]
        : []),
      {
        id: "id",
        header: "Action",
        size: 20,
        enableHiding: false,
        Cell: ({ row }) => {
          const id = row.original.id;

          return (
            <div className="flex gap-2">
              {userType == "1" || userType == "2" ? (
                <div
                  // onClick={() => navigate(`/donor-edit/${id}`)}
                  // onClick={() => {
                  //   const encryptedId = encryptId(id);
                  //   navigate(`/donor-edit/${encodeURIComponent(encryptedId)}`);
                  // }}
                  onClick={() => {
                    navigateToDonorEdit(navigate,id)
                            }}
                  className="flex items-center space-x-2"
                  title="Edit"
                >
                  <IconEdit className="h-5 w-5 text-blue-500 cursor-pointer" />
                </div>
              ) : (
                ""
              )}
              <div
                onClick={toggleViewerDrawer(true, id)}
                className="flex items-center space-x-2"
                title="View"
              >
                <IconEye className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div>
              {userType == "1" ? (
                <div
                  // onClick={() => navigate(`/donor-create/${id}`)}
                  // onClick={() => {
                  //   const encryptedId = encryptId(id);
                  //   navigate(
                  //     `/donor-create/${encodeURIComponent(encryptedId)}`
                  //   );
                  // }}
                  onClick={() => {
                    navigateToCreateReceipt(navigate,id)
                            }}
                  className="flex items-center space-x-2"
                  title="Create Reciept"
                >
                  <IconReceipt className="h-5 w-5 text-blue-500 cursor-pointer" />
                </div>
              ) : (
                ""
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: donorData || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding: false,
    state: { 
      columnVisibility,
      isLoading: loading ,
      showProgressBars: loading,
    },
    enableStickyHeader: true,
    enableStickyFooter: true,
    mantineTableContainerProps: { sx: { maxHeight: "400px" } },
    onColumnVisibilityChange: setColumnVisibility,
    initialState: { columnVisibility: { address: false } },
    mantineProgressProps: {
      color: 'blue',
      variant: 'bars', 
    },
  });

  return (
    <>
      <Layout>
        <div className="max-w-screen">
          {/* <div className=" flex justify-between gap-2 bg-white p-4 mb-4 rounded-lg shadow-md">
            <h1 className="border-b-2  font-[400] border-dashed border-orange-800">
              Donor List
            </h1>

            {userType === "1" && (
              <div className="flex gap-2">
                <button
                  className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                  onClick={toggleIndividualDrawer(true)}
                >
                  + Individual
                </button>
                <SwipeableDrawer
                  anchor="right"
                  open={individualDrawer}
                  onClose={toggleIndividualDrawer(false)}
                  onOpen={toggleIndividualDrawer(true)}
                >
                  <AddIndivisual
                    onClose={toggleIndividualDrawer(false)}
                    fetchDonorData={fetchDonorData}
                  />
                </SwipeableDrawer>
                <div>
                  <button
                    className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                    onClick={toggleCompanyDrawer(true)}
                  >
                    + Company
                  </button>
                  <SwipeableDrawer
                    anchor="right"
                    open={companyDrawer}
                    onClose={toggleCompanyDrawer(false)}
                    onOpen={toggleCompanyDrawer(true)}
                  >
                    <AddCompany
                      onClose={toggleCompanyDrawer(false)}
                      fetchDonorData={fetchDonorData}
                    />
                  </SwipeableDrawer>
                </div>
              </div>
            )}
          </div> */}
          <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
              <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-center md:text-left">
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

                  <button
                    className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-full md:w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                    onClick={toggleCompanyDrawer(true)}
                  >
                    + Company
                  </button>
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
                </div>
              )}
            </div>
          </div>

          <div className=" shadow-md">
            <MantineReactTable table={table} />
          </div>
        </div>
        {/* for receipt  */}
        {/* <SwipeableDrawer
          anchor="right"
          open={receiptDrawer}
          onClose={toggleReceiptDrawer(false)}
          onOpen={toggleReceiptDrawer(true)}
        > */}
        {/* <CreateReceipt
            donorId={selectedDonorId}
            onClose={toggleReceiptDrawer(false)}
          /> */}
        {/* </SwipeableDrawer> */}
        {/* for donor view  */}
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
    </>
  );
};

export default DonorList;
