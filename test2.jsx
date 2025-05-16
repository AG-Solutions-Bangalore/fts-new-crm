import React, { useEffect, useMemo, useState, useCallback } from "react";
import Layout from "../../layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconEdit, IconEye } from "@tabler/icons-react";
import moment from "moment";
import { CgTally } from "react-icons/cg";
import { navigateToReceiptEdit, navigateToReceiptView, RECEIPT_LIST } from "../../api";

const ReceiptList = () => {
  const [receiptList, setReceiptList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userType = localStorage.getItem("user_type_id");

  const fetchReceiptList = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(RECEIPT_LIST, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReceiptList(response.data.receipts || []);
    } catch (error) {
      console.error("Error while fetching receipt list", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReceiptList();
  }, [fetchReceiptList]);

  const columns = useMemo(() => [
    {
      accessorKey: "receipt_no",
      header: "Receipt No",
      size: 20,
    },
    {
      accessorKey: "tally_status",
      header: "Tally",
      size: 20,
      Cell: ({ row }) => row.original.tally_status === 'True' ? <CgTally className="w-4 h-4" /> : null
    },
    {
      accessorKey: "individual_company.indicomp_full_name",
      header: "Name",
      accessorFn: (row) => row?.individual_company?.indicomp_full_name || null,
      Cell: ({ row }) => (
        <span>{row.original.individual_company?.indicomp_full_name || ""}</span>
      ),
    },
    {
      accessorKey: "receipt_date",
      header: "Date",
      size: 150,
      Cell: ({ row }) => (
        <span>{row.original.receipt_date ? moment.utc(row.original.receipt_date).format("DD-MM-YYYY") : "N/A"}</span>
      ),
    },
    {
      accessorKey: "receipt_exemption_type",
      header: "Exemption Type",
      size: 20,
    },
    {
      accessorKey: "receipt_donation_type",
      header: "Donation Type",
      size: 150,
    },
    {
      accessorKey: "receipt_total_amount",
      header: "Amount",
      size: 50,
    },
    ...(userType === "4" ? [{
      accessorKey: "chapter.chapter_name",
      header: "Chapter",
      size: 50,
      Cell: ({ row }) => (
        <span>{(row.original.chapter?.chapter_name || "").split(" ")[0]}</span>
      ),
    }] : []),
    {
      id: "actions",
      header: "Action",
      size: 50,
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <IconEye 
            className="h-5 w-5 text-blue-500 cursor-pointer" 
            onClick={() => navigateToReceiptView(navigate, row.original.id)}
            title="Receipt View"
          />
          {userType === "2" && (
            <IconEdit 
              className="h-5 w-5 text-blue-500 cursor-pointer" 
              onClick={() => navigateToReceiptEdit(navigate, row.original.id)}
              title="Receipt Edit"
            />
          )}
        </div>
      ),
    },
  ], [navigate, userType]);

  const table = useMantineReactTable({
    columns,
    data: receiptList,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableHiding: false,
    enableColumnActions: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    state: { isLoading: loading },
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
        Current Receipt List
      </h2>
    ),

    memoMode: "cells",
    enableRowVirtualization: true,
    initialState: { 
      pagination: { pageSize: 20, pageIndex: 0 },
      columnVisibility: { address: false } 
    },
  });

  return (
    <Layout>
      <div className="max-w-screen">
        <MantineReactTable table={table} />
      </div>
    </Layout>
  );
};

export default React.memo(ReceiptList);