import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconEye } from "@tabler/icons-react";
import { ContextPanel } from "../../../utils/ContextPanel";
import { encryptId } from "../../../utils/encyrption/Encyrption";
import { navigateToSchoolFullListView, SCHOOL_ALLOTED_LIST, SCHOOL_COUNT_CHAPTERWISE_LIST } from "../../../api";

const FullList = () => {
  const [schoolAllot, setSchoolAllot] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentYear } = useContext(ContextPanel);
  const [chapter, setChapter] = useState([]);

  // Fetch Approved List Data
  useEffect(() => {
    const fetchApprovedRData = async () => {
      setLoading(true);
      if (currentYear) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${SCHOOL_ALLOTED_LIST}/${currentYear}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const res = response.data?.schools;

          setSchoolAllot(res);
        } catch (error) {
          console.error("Error fetching approved list request data", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchApprovedRData();
  }, [currentYear]);

  // Fetch Chapterwise Data
  useEffect(() => {
    const fetchChapterData = async () => {
      try {
        const response = await axios.get(
          `${SCHOOL_COUNT_CHAPTERWISE_LIST}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setChapter(response.data.schoolcount);
      } catch (error) {
        console.error("Error fetching chapter data:", error);
      }
    };
    fetchChapterData();
  }, []);

  // Define columns for MantineReactTable
  const columns = [
    { accessorKey: "school_state", header: "State", size: 50 },
    { accessorKey: "district", header: "District", size: 50 },
    { accessorKey: "achal", header: "Achal", size: 50 },
    { accessorKey: "cluster", header: "Cluster", size: 50 },
    { accessorKey: "sub_cluster", header: "Sub Cluster", size: 50 },
    { accessorKey: "village", header: "Village", size: 50 },
    { accessorKey: "school_code", header: "School Code", size: 50 },
    { accessorKey: "status_label", header: "Status", size: 50 },
    {
      accessorKey: "actions",
      header: "Actions",
      enableColumnFilter: false,
      size: 50,
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <div
            // to={`/students-full-list-view/${row.original.id}`}
            // onClick={() => {
            //   const encryptedId = encryptId(row.original.id);
            //   navigate(
            //     `/students-full-list-view/${encodeURIComponent(encryptedId)}`
            //   );
            // }}
            onClick={() => {
              navigateToSchoolFullListView(navigate,row.original.id)
                      }}
          >
            <IconEye
              title="Allotment"
              className="h-5 w-5 cursor-pointer text-blue-500"
            />
          </div>
        </div>
      ),
    },
  ];

  const table = useMantineReactTable({
    columns,
    data: schoolAllot || [],
    enableDensityToggle: false,
    enableColumnActions: false,
    enableFullScreenToggle: false,
    enableHiding: false,
  });
  return (
    <Layout>
      <div className="relative">
        <h2
          className="absolute top-3 left-2 z-50 text-lg px-4 font-bold
           text-black"
        >
          <div className="flex justify-between">
            <h1>Schools List -</h1>

            <div className="ml-2 mt-1">
              {chapter.map((item, index) => (
                <div key={index} className="flex items-center  space-x-1">
                  <h1 className="font-semibold text-blue-500 sm:text-xs md:text-sm">
                    {item.chapter_name} - {item.school_count}
                  </h1>
                </div>
              ))}
            </div>
          </div>
        </h2>
        <MantineReactTable table={table} />
      </div>{" "}
    </Layout>
  );
};

export default FullList;
