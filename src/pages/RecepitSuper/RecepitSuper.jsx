import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import { IconEdit, IconInfoCircle } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import moment from "moment/moment";
import RecepitSuperDialog from "./RecepitSuperDialog";
import { Dialog } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { RECEIPT_SUPER_LIST, RECEIPT_SUPER_SUMBIT } from "../../api";

const RecepitSuper = () => {
  const [receipt, setRecepit] = useState({});

  const [showModal, setShowModal] = useState(false);
  const handleChapterSelection = (Recepitref) => {
    onSubmit(Recepitref);
  };
  const fetchData = () => {
    axios
      .get(`${RECEIPT_SUPER_LIST}`, {
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
  const handleClose = () => {
    setShowModal(false);
  };
  const onSubmit = (Recepitref) => {
    let data = {
      receipt_ref: Recepitref,
    };

    axios({
      url: `${RECEIPT_SUPER_SUMBIT}/${localStorage.getItem(
        "Ref"
      )}`,
      method: "PUT",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        toast.success("Recepit is Updated Successfully");
        fetchData();
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        toast.error("Failed to update user");
      });
  };

  const handleOpenDialog = () => setShowModal((prev) => !prev);

  const columns = [
    {
      accessorKey: "indicomp_fts_id",
      header: "Fts Id",
      size: 50,
    },
    {
      accessorKey: "receipt_no",
      header: "Recepit No",
      size: 50,
    },

    {
      accessorKey: "receipt_date",
      header: "Date",
      Cell: ({ row }) => {
        const date = row.original.receipt_date;

        return <>{date ? moment.utc(date).format("DD-MM-YYYY") : "N/A"}</>;
      },
    },
    {
      accessorKey: "receipt_exemption_type",
      header: "Exemption Type",
    },
    { accessorKey: "receipt_donation_type", header: "Donation Type" },
    {
      accessorKey: "chapter_name",
      header: "Chapter Name",

      Cell: ({ row }) => {
        const name = row.original.chapter?.chapter_name || "N/A";
        return <span>{name}</span>;
      },
    },
    {
      accessorKey: "edit",
      header: "Edit",
      enableColumnFilter: false,
      Cell: ({ row }) => {
        const ref = row.original.id;

        const handleOpen = () => {
          localStorage.setItem("Ref", ref);
          handleOpenDialog();
        };

        return (
          <div className="flex items-center space-x-2">
            <IconEdit
              onClick={handleOpen}
              className="cursor-pointer text-blue-600"
            />
          </div>
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
    <Layout>
      <div className=" bg-[#FFFFFF] p-2  rounded-lg  ">
        <div className="sticky top-0 p-2   border-b-2 border-green-500 rounded-t-lg  bg-[#E1F5FA] mt-2 ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="cursor-pointer hover:text-red-600" />
              <span>Recepit</span>
            </div>
          </h2>
        </div>

        <MantineReactTable table={table} />
      </div>

      <Dialog open={showModal} handler={handleOpenDialog}>
        <div className="max-h-[500px] overflow-y-auto bg-white rounded-lg p-4 w-full sm:w-[300px] md:w-[600px] lg:w-[900px]">
          <RecepitSuperDialog
            onSelect={handleChapterSelection}
            handleClose={handleClose}
          />
        </div>
      </Dialog>
    </Layout>
  );
};

export default RecepitSuper;
