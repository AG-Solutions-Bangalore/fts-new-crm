import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../../layout/Layout";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import { encryptId } from "../../../utils/encyrption/Encyrption";
import { DUPLICATE_DELETE, DUPLICATE_LIST, navigateToDuplicateEdit } from "../../../api";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";

const DuplicateList = () => {
  const [duplicateData, setDuplicateData] = useState(null);
  const [loading, setLoading] = useState(false);
   const [deleteId, setDeleteId] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const userType = localStorage.getItem("user_type_id");
  const [columnVisibility, setColumnVisibility] = useState({
    indicomp_spouse_name: false,
    indicomp_com_contact_name: false,
  });

  const fetchDuplicateData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${DUPLICATE_LIST}`,
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
  useEffect(() => {
    fetchDuplicateData();
  }, []);
  const handleOpenDeleteDialog = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteId(null);
  };


  const handleDuplicateDelete = async () => {
    if (!deleteId) return;
    
    try {
      const response = await axios({
        url: DUPLICATE_DELETE + deleteId,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.code === 200) {
        toast.success(response.data.msg);
        fetchDuplicateData();
      } else if (response.data.code === 400) {
        toast.error(response.data.msg);
      } else {
        toast.error("Unexpected Error");
      }
    } catch (error) {
      toast.error("An error occurred: " + error.message);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: "indicomp_fts_id",
        header: "Fts Id",
        size: 50,
      },
      {
        accessorKey: "indicomp_full_name",
        header: "Name",
        size: 50,
      },
      {
        accessorKey: "indicomp_type",
        header: "Type",
        size: 50,
      },
      {
        accessorKey: "indicomp_spouse_name",
        header: "Spouse",
        isVisible: columnVisibility.indicomp_fts_id,
      },
      {
        accessorKey: "indicomp_com_contact_name",
        header: "Contact",
        isVisible: columnVisibility.indicomp_fts_id,
      },
      {
        accessorKey: "spouse_contact",
        header: "Spouse/Contact",
        size: 50,
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
        size: 50,
      },
      {
        accessorKey: "total_receipt_count",
        header: "Receipt Count",
        size: 50,
      },
    ];

    if (userType === "1") {
      baseColumns.push({
        id: "id",
        header: "Action",
        size: 50,
        Cell: ({ row }) => {
          const id = row.original.id;
          const receiptCount = row.original.total_receipt_count;

          return (
            <div className="flex flex-row">
              {receiptCount > 0 ? (
                <div
                  title="Edit"
                  // onClick={() => navigate(`/duplicate-edit/${id}`)}
                  // onClick={() => {
                  //   const encryptedId = encryptId(id);
                  //   navigate(
                  //     `/duplicate-edit/${encodeURIComponent(encryptedId)}`
                  //   );
                  // }}
                  onClick={() => {
                    navigateToDuplicateEdit(navigate,id)
                                                }}
                
                  className="flex items-center space-x-2"
                >
                  <IconEdit className="h-5 w-5 text-blue-500 hover:text-green-500 cursor-pointer" />
                </div>
              ) : (
                <div
                  title="Delete"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenDeleteDialog(id);
                  }}
                  className="flex items-center space-x-2"
                >
                  <IconTrash className="h-5 w-5 text-blue-500 hover:text-red-500 cursor-pointer" />
                </div>
              )}
            </div>
          );
        },
      });
    }

    return baseColumns;
  }, [userType, navigate, columnVisibility]);

  // const table = useMantineReactTable({
  //   columns,
  //   data: duplicateData || [],
  //   enableFullScreenToggle: false,
  //   enableDensityToggle: false,
  //   enableColumnActions: false,
  //   enableHiding: false,
  //   state: { columnVisibility },
  // });
  const table = useMantineReactTable({
    columns,
    data: duplicateData || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding: false,
    state: { 
      columnVisibility,
      isLoading: loading ,
    },
    mantineTableContainerProps: {
      sx: {
        maxHeight: '400px', 
        position: 'relative',
      },
    },
    mantineProgressProps: {
      color: 'blue',
      variant: 'bars', 
    },
    renderTopToolbarCustomActions: () => (
      <h2 className="text-lg font-bold text-black px-4">
        Duplicate List
      </h2>
    ),
  });
  return (
    <Layout>
      <div className="max-w-screen">
        <div className="p-2 mb-4  rounded-lg bg-[#D0F6F2]">
          <p className="text-sm">
            Duplicate Criteria: If Mobile Number is Same or Donor Name is Same.
            <br />
            (Note: All the below data is not 100% duplicate. It is all
            recommended data that may be duplicated. Please make the changes
            very carefully. We advise you to make a note before removing.)
          </p>
        </div>
     
         
          <MantineReactTable table={table} />
       
      </div>
         <Dialog open={openDeleteDialog} handler={handleCloseDeleteDialog}>
              <DialogHeader>Confirm Delete</DialogHeader>
              <DialogBody>
                Are you sure you want to delete this record? This action cannot be undone.
              </DialogBody>
              <DialogFooter>
                <Button
                  variant="text"
                  color="red"
                  onClick={handleCloseDeleteDialog}
                  className="mr-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="gradient"
                  color="green"
                  onClick={handleDuplicateDelete}
                >
                  Confirm
                </Button>
              </DialogFooter>
            </Dialog>
    </Layout>
  );
};

export default DuplicateList;
