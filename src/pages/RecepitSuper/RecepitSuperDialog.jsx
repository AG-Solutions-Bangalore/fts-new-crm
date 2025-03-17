import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { IconInfoCircle } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconCheckbox } from "@tabler/icons-react";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { RECEIPT_SUPER_DIALOG_LIST } from "../../api";

const RecepitSuperDialog = ({ onSelect, handleClose }) => {
  const [receipt, setRecepit] = useState([]);

  const fetchData = () => {
    axios
      .get(`${RECEIPT_SUPER_DIALOG_LIST}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setRecepit(res.data.receipts);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { accessorKey: "indicomp_fts_id", header: "Fts Id", size: 50 },
    { accessorKey: "receipt_ref_no", header: "Recepit Ref" },
    {
      accessorKey: "chapter_name",
      header: "Chapter Name",
      Cell: ({ row }) => {
        const name = row.original.chapter?.chapter_name || "N/A";
        return <span>{name}</span>;
      },
    },
    {
      accessorKey: "receipt_exemption_type",
      header: "Exemption Type",
      size: 50,
    },
    { accessorKey: "receipt_donation_type", header: "Donation Type" },
    { accessorKey: "receipt_total_amount", header: "Amount", size: 50 },

    {
      accessorKey: "edit",
      header: "Edit",
      enableColumnFilter: false,
      Cell: ({ row }) => {
        const Recepitref = row.original.receipt_ref_no;
        return (
          <IconCheckbox
            onClick={() => onSelect(Recepitref)}
            className="cursor-pointer text-blue-600"
          />
        );
      },
    },
  ];

  const table = useMantineReactTable({
    columns,
    data: receipt,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableFullScreenToggle: false,
    enableHiding: false,
  });

  return (
    <div className="bg-[#FFFFFF] p-2 rounded-lg">
      <div className="sticky top-0 p-2 border-b-2 border-green-500 rounded-t-lg bg-[#E1F5FA] mt-2">
        <h2 className="px-5 text-[black] text-lg flex flex-row justify-between items-center rounded-xl p-2">
          <div className="flex items-center gap-2">
            <IconInfoCircle className="cursor-pointer hover:text-red-600" />
            <span>Recepit</span>
          </div>
          <IconSquareRoundedX
            className="cursor-pointer hover:text-red-600"
            onClick={handleClose}
          />
        </h2>
      </div>

      <MantineReactTable table={table} />
    </div>
  );
};

export default RecepitSuperDialog;
