import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../../../base/BaseUrl";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
const AddToGroup = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [donorData, setDonorData] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          url: `${BASE_URL}/api/fetch-donors`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const formattedData = response.data.individualCompanies.map(
          (donor) => ({
            name: donor.indicomp_full_name,
            phone: donor.indicomp_mobile_phone,
            id: donor.indicomp_related_id,
          })
        );

        setDonorData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addMemberToGroup = async (relativeId) => {
    try {
      await axios({
        url: `${BASE_URL}/api/update-donor/${id}`,
        method: "PUT",
        data: {
          indicomp_related_id: relativeId,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Successfully added to group");
      navigate("/donor-list");
    } catch (error) {
      console.error("Error adding member to group:", error);
      toast.error("Failed to add member to group");
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      enableColumnFilter: false,

      Cell: ({ row }) => (
        <button
          onClick={() => addMemberToGroup(row.original.id)}
          className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-20 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md mr-2"
        >
          Add
        </button>
      ),
    },
  ];

  // Hooks must always be called
  const table = useMantineReactTable({
    columns,
    data: donorData,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding: false,
    state: { columnVisibility },
    enableStickyHeader: true,
    enableStickyFooter: true,
    mantineTableContainerProps: { sx: { maxHeight: "400px" } },
    onColumnVisibilityChange: setColumnVisibility,
    initialState: { columnVisibility: { phone: true } },
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-56">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <MantineReactTable table={table} />
    </div>
  );
};

export default AddToGroup;
