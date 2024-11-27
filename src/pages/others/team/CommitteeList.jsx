import axios from "axios";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import React, { useEffect, useMemo, useState } from "react";
import BASE_URL from "../../../base/BaseUrl";
import { IconInfoCircle, IconPhotoPlus, IconTrash } from "@tabler/icons-react";
import { toast } from "react-toastify";
import AddToImage from "./AddToImage";
import { Dialog, DialogBody } from "@material-tailwind/react";
import { Typography } from "@mui/material";

const CommitteeList = () => {
  const [committeeData, setCommitteelist] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectDonorId, setSelectDonorId] = useState(null);
  const userType = localStorage.getItem("user_type_id");
  const fetchCommitteeData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/fetch-commitee`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCommitteelist(response.data?.committeeData);
    } catch (error) {
      console.error("Error fetching Factory data", error);
    } finally {
    }
  };
  useEffect(() => {
    fetchCommitteeData();
  }, []);

  const deleteData = async (e, value) => {
    e.preventDefault();
    await axios({
      url: `${BASE_URL}/api/delete-commitee/${value}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        toast.success("Data deleted successfully");
        fetchCommitteeData();
      })
      .catch((error) => {
        console.error("There was an error deleting the data!", error);
        toast.error("Failed to delete data. Please try again.");
      });
  };

  const handleOpenDialog = (id) => {
    setSelectDonorId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectDonorId(null);
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: "individual_company.indicomp_image_logo",
        header: "Photo",
        enableColumnFilter: false,
        Cell: ({ value, row }) => {
          const imageData =
            row.original?.individual_company.indicomp_image_logo;
          return (
            <div>
              {imageData ? (
                <img
                  src={
                    "https://ftschamp.com/api/storage/app/public/donor/" +
                    imageData
                  }
                  className="media-object rounded-full w-10 h-10 object-cover"
                />
              ) : (
                <img
                  src={
                    "https://ftschamp.com/api/storage/app/public/donor/no_image.png"
                  }
                  className="media-object rounded-full w-10 h-10 object-cover"
                />
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "individual_company.indicomp_full_name",
        header: "Donor",
        Cell: ({ value, row }) => {
          const valueData = row.original?.individual_company.indicomp_full_name;
          return <div>{valueData}</div>;
        },
      },
      {
        accessorKey: "committee_type",
        header: "Committee type",
      },
      {
        accessorKey: "designation",
        header: "Designation",
      },
      {
        accessorKey: "individual_company.indicomp_mobile_phone",
        header: "Mobile",
        Cell: ({ value, row }) => {
          const valueData =
            row.original?.individual_company.indicomp_mobile_phone;
          return <div>{valueData}</div>;
        },
      },
    ];

    if (userType === "1") {
      baseColumns.push({
        id: "action",
        header: "Action",
        size: 50,
        Cell: ({ row }) => {
          const id = row.original.id;
          const handleId = row.original.indicomp_fts_id;

          return (
            <div className="flex gap-2">
              <div
                onClick={(e) => deleteData(e, id)}
                className="flex items-center space-x-2"
                title="Delete"
              >
                <IconTrash className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div>

              <div
                onClick={() => handleOpenDialog(handleId)}
                className="flex items-center space-x-2"
                title="Add Photos"
              >
                <IconPhotoPlus className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div>
            </div>
          );
        },
      });
    }

    return baseColumns;
  }, [userType]);

  const table = useMantineReactTable({
    columns,
    data: committeeData || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding: false,
  });
  return (
    <>
      <div className="relative">
        <h2
          className="absolute top-3 left-2 z-50 text-lg px-4 font-bold
           text-black"
        >
          Employee List
        </h2>
        <MantineReactTable table={table} />
      </div>

      <Dialog open={openDialog} handler={handleCloseDialog}>
        <DialogBody>
          <AddToImage
            selectDonorId={selectDonorId}
            setOpenDialog={setOpenDialog}
            handleCloseDialog={handleCloseDialog}
          />
        </DialogBody>
      </Dialog>
    </>
  );
};

export default CommitteeList;
