import axios from "axios";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../../base/BaseUrl";
import { IconInfoCircle, IconPhotoPlus, IconTrash } from "@tabler/icons-react";
import { toast } from "react-toastify";
import AddToImage from "./AddToImage";
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";

const CommitteeList = () => {
  const [committeeData, setCommitteelist] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectDonorId, setSelectDonorId] = useState(null);

  const fetchCommitteeData = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
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

  const columns = useMemo(
    () => [
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

      {
        id: "id",
        header: "Action",
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
      },
    ],
    []
  );

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
      <div className="sticky top-0 p-2  mb-4 border-b-2 border-green-500 rounded-lg  bg-[#E1F5FA] ">
        <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
          <div className="flex  items-center gap-2">
            <IconInfoCircle className="w-4 h-4" />
            <span>Committee List</span>
          </div>
        </h2>
      </div>
      <hr />
      <div className=" shadow-md">
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
        {/* <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleCloseDialog}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
        </DialogFooter> */}
      </Dialog>
    </>
  );
};

export default CommitteeList;
