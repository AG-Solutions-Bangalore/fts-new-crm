import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../../layout/Layout";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconMail } from "@tabler/icons-react";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";

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
        const response = await axios.get(`${BASE_URL}/api/fetch-members`, {
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
    setLoading(false);
  }, []);
  

  const sendEmail = (value) => {
    axios({
      url: BASE_URL + "/api/send-membership-renew?id=" + value,
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
      },
      {
        accessorKey: "indicomp_type",
        header: "Type",
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
      },

      {
        accessorKey: "indicomp_email",
        header: "Email",
      },
      {
        accessorKey: "receipt.m_ship_vailidity",
        header: "Validity",
        Cell: ({ row }) => {
          const Validity = row.original.receipt.m_ship_vailidity;
          return <span>31-3-{Validity}</span>;
        },
      },

      {
        id: "id",
        header: "Action",
        Cell: ({ row }) => {
          const email = row.original.indicomp_email;

          return (
            <div className="flex gap-2">
              {email && email.toLowerCase() !== "null" && (
                <div
                  onClick={() => sendEmail(email)}
                  className="flex items-center space-x-2"
                >
                  <IconMail title="Edit" className="h-5 w-5 cursor-pointer" />
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
    enableHiding:false,
    enableColumnActions: false,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
  });
  return (
    <Layout>
      <div className="max-w-screen">
        <div className=" flex justify-between gap-2 bg-white p-4 mb-4 rounded-lg shadow-md">
          <h1 className="border-b-2  font-[400] border-dashed border-orange-800">
            Membership List
          </h1>
        </div>
        <div className=" shadow-md">
          <MantineReactTable table={table} />
        </div>
      </div>
    </Layout>
  );
};

export default MemberList;
