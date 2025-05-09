import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../../layout/Layout";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconMail } from "@tabler/icons-react";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import { MEMBERS_LIST, SEND_EMAIL } from "../../../api";

const MemberList = () => {
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({
    indicomp_spouse_name: false,
    indicomp_com_contact_name: false,
  });

  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${MEMBERS_LIST}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMemberData(response.data?.individualCompanies);
      } catch (error) {
        console.error("Error fetching Factory data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonorData();
    
  }, []);

  const sendEmail = (value) => {
    axios({
      url: SEND_EMAIL + value,
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      toast.success("Email Sent Sucessfully");
    });
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
        accessorKey: "receipt.m_ship_vailidity",
        header: "Validity",
        size: 50,
        Cell: ({ row }) => {
          const Validity = row.original.receipt.m_ship_vailidity;
          return <span>31-3-{Validity}</span>;
        },
      },

      {
        id: "id",
        header: "Action",
        size: 50,
        Cell: ({ row }) => {
          const email = row.original.indicomp_email;

          return (
            <div className="flex gap-2">
              {email && email.toLowerCase() !== "null" && (
                <div
                  onClick={() => sendEmail(email)}
                  title="Send Mail"
                  className="flex items-center space-x-2"
                >
                  <IconMail className="h-5 w-5 text-blue-500 cursor-not-allowed  " />
                </div>
              )}
            </div>
          );
        },
      },
    ],
    []
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
      isLoading: loading ,
     
    },
    onColumnVisibilityChange: setColumnVisibility,
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
  });
  return (
    <Layout>
      <div className="max-w-screen">
        <div className="relative">
          <h2
            className="absolute top-3 left-2 z-50 text-lg px-4 font-bold
           text-black"
          >
            Membership List
          </h2>
          <MantineReactTable table={table} />
        </div>
      </div>
    </Layout>
  );
};

export default MemberList;
