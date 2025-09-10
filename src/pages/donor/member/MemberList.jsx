import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../../layout/Layout";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconMail } from "@tabler/icons-react";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";

import mailSentGif from "../../../assets/mail-sent-fast.gif";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import moment from "moment";
const MemberList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mailLoader, setMailLoader] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({
    indicomp_spouse_name: false,
    indicomp_com_contact_name: false,
  });
  const [year, setYear] = useState("");

 
  useEffect(() => {
    const year = searchParams.get('year');
    const serializedMembers = searchParams.get('members');

    if (year && serializedMembers) {
      try {
   
        const decodedMembers = JSON.parse(atob(decodeURIComponent(serializedMembers)));
        setMemberData(decodedMembers);
        setYear(year);
      } catch (error) {
        toast.error("Failed to decode member data");
      }
    } else {
      toast.error("No data found in URL");
    }
  }, [searchParams]);
  

  const sendEmail = async (value) => {
    try {
      setMailLoader((prev) => ({ ...prev, [value]: true }));
      const response = await axios({
        url: `${BASE_URL}/api/send-membership-renew/${value}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success(response.data.msg || "Email sent successfully.");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send email";
      toast.error(message);
    } finally {
      setMailLoader((prev) => ({ ...prev, [value]: false }));
    }
  };
 
  const columns = useMemo(
    () => [
      {
        accessorKey: "indicomp_full_name",
        header: "Full Name",
        size: 50,
      },
      {
        accessorKey: "indicomp_type",
        header: "Type",
        size: 50,
      },

      {
        accessorKey: "indicomp_com_contact_name",
        header: "Contact",
        isVisible: columnVisibility.indicomp_com_contact_name,
      },
      {
        accessorKey: "indicomp_spouse_name",
        header: "Spouse",
        isVisible: columnVisibility.indicomp_spouse_name,
      },
      {
        accessorKey: "spouse_contact",
        header: "Spouse/Contact",
        size: 50,
        Cell: ({ value, row }) => {
          const indicompType = row.original.indicomp_type;
          const spouseRow = row.original?.indicomp_spouse_name;
          const contactRow = row.original?.indicomp_com_contact_name;
          if (indicompType === "Individual") {
            return spouseRow;
          } else {
            return contactRow;
          }
        },
      },
      {
        accessorKey: "indicomp_mobile_phone",
        header: "Mobile",
        size: 50,
      },

      {
        accessorKey: "indicomp_email",
        header: "Email",
        size: 50,
      },
      {
        accessorKey: "joining_date",
        header: "Joining",
        
        size: 50,
        Cell: ({ row }) => {
          const Validity = row.original?.joining_date;
          return Validity ? (
            <span>{moment(Validity).format("DD-MM-YYYY")}</span>
          ) : (
            <span className="text-gray-400">-</span>
          );
        },
      },
      {
        accessorKey: "last_payment_vailidity",
        header: "Validity",
        
        size: 50,
        Cell: ({ row }) => {
          const Validity = row.original?.last_payment_vailidity;
          return Validity ? (
            <span>31-3-{Validity}</span>
          ) : (
            <span className="text-gray-400">-</span>
          );
        },
      },

      {
        id: "id",
        header: "Action",
        size: 50,
        Cell: ({ row }) => {
          const email = row.original.indicomp_email;
          const rowId = row.original.id;
          return (
            <div className="flex gap-2">
              {email && email.toLowerCase() !== "null" ? (
                mailLoader[rowId] ? (
                  <img src={mailSentGif} alt="Sending..." className="h-7 w-7" />
                ) : (
                  <button
                    disabled={mailLoader[rowId]}
                    onClick={() => sendEmail(rowId)}
                    title="Send Mail"
                    className="flex items-center space-x-2"
                  >
                    <IconMail className="h-5 w-5 text-blue-500 " />
                  </button>
                )
              ) : (
                <button
                  disabled
                  title="Send Mail"
                  className="flex items-center space-x-2"
                >
                  <IconMail className="h-5 w-5 text-gray-500 cursor-not-allowed" />
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [mailLoader]
  );
  const table = useMantineReactTable({
    columns,
    data: memberData || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableHiding: false,
    enableColumnActions: false,
    state: {
      columnVisibility,
      isLoading: loading,
    },
    onColumnVisibilityChange: setColumnVisibility,
    mantineTableContainerProps: {
      sx: {
        maxHeight: "400px",
        position: "relative",
      },
    },
    mantineProgressProps: {
      color: "blue",
      variant: "bars",
    },
    renderTopToolbarCustomActions: () => (
      <div className="flex items-center gap-4 px-4">
      <button
        onClick={() => navigate('/member-dashbord')}
        className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
      <h2 className="text-lg font-bold text-black">
        {year ? `Membership List for ${year}` : "Membership List"}
      </h2>
    </div>
    ),
  });
  return (
    <Layout>
      <div className="max-w-screen">
        <MantineReactTable table={table} />
      </div>
    </Layout>
  );
};

export default MemberList;
