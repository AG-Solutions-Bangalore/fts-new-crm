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

const DuplicateList = () => {
  const [duplicateData, setDuplicateData] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const handleDuplicateDelete = async (e, id) => {
    e.preventDefault();
    try {
      const response = await axios({
        url: DUPLICATE_DELETE  + id,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        toast.success(res.data.msg);
        fetchDuplicateData();
      } else if (res.data.code === 400) {
        toast.error(res.data.msg);
        setIsButtonDisabled(false);
      } else {
        toast.error("Unexcepted Error");
      }
    } catch (error) {
      toast.error("An error occurred: " + error.message);
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
        accessorKey: "receipt_count",
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
          const receiptCount = row.original.receipt_count;

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
                  onClick={(e) => handleDuplicateDelete(e, id)}
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
  }, [userType, navigate, handleDuplicateDelete, columnVisibility]);

  const table = useMantineReactTable({
    columns,
    data: duplicateData || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding: false,
    state: { columnVisibility },
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
        <div className="relative">
          <h2
            className="absolute top-3 left-2 z-50 text-lg px-4 font-bold
           text-black"
          >
            Duplicate List
          </h2>
          <MantineReactTable table={table} />
        </div>
      </div>
    </Layout>
  );
};

export default DuplicateList;
