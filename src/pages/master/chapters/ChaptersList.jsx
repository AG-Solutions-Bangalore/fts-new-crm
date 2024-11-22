import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SwipeableDrawer, Button, Tooltip } from "@mui/material";
import { Spinner } from "@material-tailwind/react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconEdit, IconEye, IconReceipt } from "@tabler/icons-react";
import Layout from "../../../layout/Layout";
import BASE_URL from "../../../base/BaseUrl";
import AddChapter from "./AddChapter";

const ChaptersList = () => {
  const [chapterList, setChapterList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chapterDrawer, setChapterDrawer] = useState(false);

  const toggleIndividualDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setChapterDrawer(open);
  };

  const fetchOrderList = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/fetch-chapters`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.chapters) {
        setChapterList(response.data.chapters);
      } else {
        console.error("No chapters found in response");
      }
    } catch (error) {
      console.error("Error while fetching chapters: ", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrderList();
  }, []);

  const columns = [
    // {
    //   accessorKey: "index",
    //   header: "#",
    //   Cell: ({ row }) => <span>{row.index + 1}</span>,
    // },
    { accessorKey: "chapter_name", header: "Name" },
    { accessorKey: "chapter_email", header: "Email" },
    { accessorKey: "chapter_state", header: "Status" },
    { accessorKey: "chapter_whatsapp", header: "Whatsapp" },
    {
      accessorKey: "actions",
      header: "Actions",
      enableColumnFilter: false,

      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Tooltip title="View" arrow>
            <Link to={`/view-chapter/${row.original.id}`}>
              <IconEye className="h-5 w-5 cursor-pointer text-blue-500" />
            </Link>
          </Tooltip>

          <Tooltip title="Edit" arrow>
            <Link to={`/edit-chapter/${row.original.id}`}>
              <IconEdit className="h-5 w-5 cursor-pointer text-blue-500" />
            </Link>
          </Tooltip>

          <Tooltip title="Datasource" arrow>
            <Link to={`/edit-datasource/${row.original.id}`}>
              <IconReceipt className="h-5 w-5 cursor-pointer text-blue-500" />
            </Link>
          </Tooltip>
        </div>
      ),
    },
  ];

  const table = useMantineReactTable({
    columns,
    data: chapterList,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableFullScreenToggle: false,
    enableHiding: false,
  });

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:justify-between gap-2 bg-white p-4 mb-4 rounded-lg shadow-md">
        <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-xl md:text-2xl sm:text-sm text-center md:text-left">
          Chapters List
        </h1>

        <div className="flex flex-wrap gap-2 justify-center mt-2 md:mt-0">
          <button
            onClick={toggleIndividualDrawer(true)}
            className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md mr-2"
          >
            + Add Chapter
          </button>
          <SwipeableDrawer
            anchor="right"
            open={chapterDrawer}
            onClose={toggleIndividualDrawer(false)}
            onOpen={toggleIndividualDrawer(true)}
          >
            <AddChapter
              onClose={toggleIndividualDrawer(false)}
              fetchChapter={fetchOrderList}
            />
          </SwipeableDrawer>
        </div>
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : (
          <div className="w-full">
            {chapterList.length > 0 ? (
              <MantineReactTable table={table} />
            ) : (
              <div className="text-center text-gray-500">
                No chapters available.
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ChaptersList;
