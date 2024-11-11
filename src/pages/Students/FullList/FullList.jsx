import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { Spinner } from "@material-tailwind/react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconEye } from "@tabler/icons-react";

const FullList = () => {
  const [schoolAllot, setSchoolAllot] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const [currentYear, setCurrentYear] = useState("");
  const [chapter, setChapter] = useState([]);

  // Fetch Year Data
  useEffect(() => {
    const fetchYearData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/fetch-year`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCurrentYear(response.data.year.current_year);
      } catch (error) {
        console.error("Error fetching year data:", error);
      }
    };
    fetchYearData();
  }, []);

  // Fetch Approved List Data
  useEffect(() => {
    const fetchApprovedRData = async () => {
      setLoading(true);
      if (currentYear) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${BASE_URL}/api/fetch-school-alloted-list/${currentYear}`,
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
  }, [isPanelUp, navigate, currentYear]);

  // Fetch Chapterwise Data
  useEffect(() => {
    const fetchChapterData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/fetch-school-count-chapterwise`,
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
    {
      accessorKey: "index",
      header: "#",
      Cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    { accessorKey: "school_state", header: "State" },
    { accessorKey: "district", header: "District" },
    { accessorKey: "achal", header: "Achal" },
    { accessorKey: "cluster", header: "Cluster" },
    { accessorKey: "sub_cluster", header: "Sub Cluster" },
    { accessorKey: "village", header: "Village" },
    { accessorKey: "school_code", header: "School Code" },
    { accessorKey: "status_label", header: "Status" },
    {
      accessorKey: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Link to={`/students-full-list-view/${row.original.id}`}>
            <IconEye
              title="Allotment"
              className="h-5 w-5 cursor-pointer text-blue-500"
            />
          </Link>
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
  });
  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:justify-between gap-2 bg-white p-4 mb-4 rounded-lg shadow-md">
        <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-xl md:text-2xl sm:text-sm text-center md:text-left">
          Schools List
        </h1>

        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          {chapter.map((item, index) => (
            <div key={index} className="flex items-center space-x-1">
              <h1 className="font-bold text-blue-500 sm:text-xs md:text-lg">
                {item.chapter_name} - {item.school_count}
              </h1>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : (
          <div className="w-full">
            {schoolAllot.length > 0 && <MantineReactTable table={table} />}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FullList;
