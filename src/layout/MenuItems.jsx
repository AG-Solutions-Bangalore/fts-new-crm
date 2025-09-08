import {
    LayoutDashboard,
    User,
    Network,
    PieChart,
    Languages,
    Briefcase,
    Copy,
    MessageSquare,
    Users,
    Receipt,
    School,
    List,
    Repeat,
    Component,
    FileText,
    Download,

    Type,
    Bell,
    DollarSign,
    Box,
  } from "lucide-react";
  
  const Menuitems = (userTypeId) => {
    const items = [
      {
        navlabel: true,
        subheader: "Home",
      },
      {
        id: "dashboard",
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/home",
      },
    ];
  
    if (userTypeId === "5") {
      items.push(
        {
          id: "receipt-sup",
          title: "Receipt",
          icon: Receipt,
          href: "/recepit-sup",
        },
        {
          id: "change-promoter",
          title: "Change Promoter",
          icon: DollarSign,
          href: "/change-promoter",
        },
        {
          id: "superadmin-chapters",
          title: "Chapter-S",
          icon: Network,
          href: "/chapter",
        },
        {
          id: "change-receipt-donor",
          title: "C-receipt Donor",
          icon: DollarSign,
          href: "/change-receipt-donor",
        },
        {
          id: "multi-receipt-download",
          title: "M-receipt",
          icon: DollarSign,
          href: "/multi-receipt-download",
        }
      );
    } else {
      // Add other menu items based on user type
      if (userTypeId === "2") {
        items.push(
          {
            id: "chapters",
            title: "Chapters",
            icon: Network,
            href: "/chapter",
          },
          {
            id: "data-sources",
            title: "Data Sources",
            icon: PieChart,
            href: "/datasource",
          }
        );
      }
  
      items.push(
        {
          navlabel: true,
          subheader: "Operation",
        }
      );
  
      if (userTypeId === "3") {
        items.push({
          id: "master",
          title: "Master",
          icon: User,
          subItems: [
            {
              id: "master-chapters",
              title: "Chapters",
              icon: Network,
              href: "/master/chapters",
            },
            {
              id: "master-states",
              title: "States",
              icon: Languages,
              href: "/master/states",
            },
            {
              id: "master-designation",
              title: "Designation",
              icon: Briefcase,
              href: "/master/designation",
            },
            {
              id: "master-expensive-type",
              title: "OTS Expensive Type",
              icon: Copy,
              href: "/master/expensive-type",
            },
            {
              id: "master-faq",
              title: "FAQ",
              icon: MessageSquare,
              href: "/master/faqList",
            },
          ],
        });
      }
  
      items.push(
        {
          id: "donors",
          title: "Donors",
          icon: Users,
          subItems: [
            {
              id: "donor-list",
              title: "Full List",
              icon: List,
              href: "/donor-list",
            },
            {
              id: "member-list",
              title: "Members",
              icon: Users,
              href: "/member-list",
            },
            ...(userTypeId === "3"
              ? [
                  {
                    id: "viewer-list",
                    title: "Viewers",
                    icon: Box,
                    href: "/viewer-list",
                  },
                ]
              : []),
            {
              id: "duplicate-list",
              title: "Duplicate",
              icon: Copy,
              href: "/duplicate-list",
            },
          ],
        },
        {
          id: "receipts",
          title: "Receipts",
          icon: Receipt,
          subItems: [
            {
              id: "receipt-list",
              title: "Current Receipts",
              icon: Receipt,
              href: "/receipt-list",
            },
            // {
            //   id: "receipt-old-list",
            //   title: "Old Receipts",
            //   icon: Receipt,
            //   href: "/receipt-old-list",
            // },
            {
              id: "suspense-list",
              title: "Suspense Receipts",
              icon: Receipt,
              href: "/suspense-list",
            },
          ],
        },
        {
          id: "schools",
          title: "Schools",
          icon: School,
          subItems: [
            {
              id: "students-full-list",
              title: "Full List",
              icon: List,
              href: "/students-full-list",
            },
            {
              id: "students-to-allot",
              title: "School To Allot",
              icon: Component,
              href: "/students-to-allot",
            },
            {
              id: "students-schoolallot",
              title: "School Alloted",
              icon: Component,
              href: "/students-schoolallot",
            },
            {
              id: "students-report-donor",
              title: "Repeat Donors",
              icon: Repeat,
              href: "/students-report-donor",
            },
          ],
        },
        {
          navlabel: true,
          subheader: "Summary",
        },
        {
          id: "reports",
          title: "Reports",
          icon: FileText,
          subItems: [
            {
              id: "donorsummary",
              title: "Donor Summary",
              icon: Copy,
              href: "/report/donorsummary",
            },
            {
              id: "promoter",
              title: "Promoter Summary",
              icon: Copy,
              href: "/report/promoter",
            },
            {
              id: "recepit",
              title: "Receipt Summary",
              icon: Copy,
              href: "/report/recepit",
            },
            {
              id: "donation",
              title: "Donation Summary",
              icon: Copy,
              href: "/report/donation",
            },
            {
              id: "school",
              title: "School Summary",
              icon: Copy,
              href: "/report/school",
            },
            {
              id: "otg",
              title: "10BD Statement",
              icon: Copy,
              href: "/report/otg",
            },
            {
              id: "suspense",
              title: "Suspense Summary",
              icon: Copy,
              href: "/report/suspense",
            },
          ],
        },
        {
          id: "download",
          title: "Download",
          icon: Download,
          subItems: [
            {
              id: "receipts",
              title: "Receipt",
              icon: Copy,
              href: "/download/receipts",
            },
            {
              id: "donor",
              title: "Donor",
              icon: Copy,
              href: "/download/donor",
            },
            {
              id: "school",
              title: "School",
              icon: Copy,
              href: "/download/school",
            },
            {
              id: "ots",
              title: "OTS",
              icon: Copy,
              href: "/download/ots",
            },
            {
              id: "team",
              title: "Team",
              icon: Copy,
              href: "/download/team",
            },
            {
              id: "allrecepit",
              title: "All Receipts",
              icon: Copy,
              href: "/download/allrecepit",
            },
          ],
        },
        {
          navlabel: true,
          subheader: "Extra",
        },
        {
          id: "others",
          title: "Others",
          icon: Copy,
          subItems: [
            {
              id: "faq",
              title: "FAQ",
              icon: Type,
              href: "/faq",
            },
            {
              id: "team",
              title: "Team",
              icon: Users,
              href: "/team",
            },
            {
              id: "notification",
              title: "Notification",
              icon: Bell,
              href: "/notification",
            },
          ],
        }
      );
    }
  
    return items;
  };
  
  export default Menuitems;