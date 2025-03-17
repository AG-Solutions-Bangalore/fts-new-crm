import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../../layout/Layout";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconEdit } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import AddViewer from "./AddViewer";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import moment from "moment";
import { encryptId } from "../../../utils/encyrption/Encyrption";
import { navigateToViewerEdit, VIEWVER_LIST } from "../../../api";

const ViewerList = () => {
  const [viewerData, setViewerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [viewerDrawer, setViewerDrawer] = useState(false);

  const toggleViewerDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setViewerDrawer(open);
  };

  const fetchViewerData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${VIEWVER_LIST}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setViewerData(response.data?.viewerUsers);
    } catch (error) {
      console.error("Error fetching Factory data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchViewerData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Username",
        size: 50,
      },
      {
        accessorKey: "first_name",
        header: "Full Name",
        size: 50,
      },
      {
        accessorKey: "user_position",
        header: "Position",
        size: 50,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 50,
      },
      {
        accessorKey: "phone",
        header: "Phone",
        size: 50,
      },

      {
        accessorKey: "viewer_chapter_ids",
        header: "Chapter Ids",
        size: 50,
      },
      {
        accessorKey: "viewer_start_date",
        header: "Start Date",
        size: 50,
        Cell: ({ row }) => {
          const date = row.original.viewer_start_date;

          return <>{date ? moment.utc(date).format("DD-MM-YYYY") : "N/A"}</>;
        },
      },
      {
        accessorKey: "viewer_end_date",
        header: "End Date",
        size: 50,
        Cell: ({ row }) => {
          const date = row.original.viewer_end_date;

          return <>{date ? moment.utc(date).format("DD-MM-YYYY") : "N/A"}</>;
        },
      },

      {
        id: "id",
        header: "Action",
        size: 50,
        Cell: ({ row }) => {
          const id = row.original.id;

          return (
            <div className="flex gap-2">
              <div
                // onClick={() => {
                //   const encryptedId = encryptId(id);
                //   navigate(`/edit-viewer/${encodeURIComponent(encryptedId)}`);
                // }}
                 onClick={() => {
                  navigateToViewerEdit(navigate,id)
                                              }}
              
                className="flex items-center space-x-2"
                title="Edit"
              >
                <IconEdit
                  title="Edit"
                  className="h-5 w-5 cursor-pointer text-blue-600"
                />
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
    data: viewerData || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding: false,
  });
  return (
    <Layout>
      <div className="max-w-7xl">
        <div className=" flex justify-between gap-2 bg-white p-4 mb-4 rounded-lg shadow-md">
          <h1 className="border-b-2  font-[400] border-dashed border-orange-800">
            Viewer List
          </h1>
          <div className="flex gap-2">
            <button
              className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
              onClick={toggleViewerDrawer(true)}
            >
              + Viewer
            </button>
            <SwipeableDrawer
              anchor="right"
              open={viewerDrawer}
              onClose={toggleViewerDrawer(false)}
              onOpen={toggleViewerDrawer(true)}
            >
              <AddViewer
                onClose={toggleViewerDrawer(false)}
                fetchViewerData={fetchViewerData}
              />
            </SwipeableDrawer>
          </div>
        </div>
        <div className=" shadow-md">
          <MantineReactTable table={table} />
        </div>
      </div>
    </Layout>
  );
};

export default ViewerList;
