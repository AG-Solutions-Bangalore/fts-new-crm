import {
    IconAperture,
    IconCopy,
    IconHierarchy,
    IconChartDots2,
    IconLayoutDashboard,
    IconLogin,
    IconMoodHappy,
    IconUser,
    IconLanguage,
    IconBriefcase,
    IconMessages,
    IconTypography,
    IconUserPlus,
    IconRotate2,
    IconCash,
    IconCardboards,
    IconUsers,
    IconReceipt,
    IconSchool,
    IconListDetails,
    IconRepeat,
    IconComponents,
    IconReport,
    IconDownload,
    IconPeace,
  } from "@tabler/icons-react";
  
  import { uniqueId } from "lodash";
  
  const Menuitems = [
    {
      navlabel: true,
      subheader: "Home",
    },
  
    {
      id: uniqueId(),
      title: "Dashboard",
      icon: IconLayoutDashboard,
      href: "/home",
    },
    {
      id: uniqueId(),
      title: "Chapters",
      icon: IconHierarchy,
      href: "/form",
    },
    {
      id: uniqueId(),
      title: "Data Sources",
      icon: IconChartDots2,
      href: "/form",
    },
    {
      navlabel: true,
      subheader: "Operation",
    },
    {
      id: uniqueId(),
      title: "Master",
      icon: IconUser,
      // href: "/table",
      subItems: [  // for nested sum menu item
        {
          id: uniqueId(),
          title: "Chapters",
          icon: IconHierarchy,
          href: "/table",
        },
        {
          id: uniqueId(),
          title: "States",
          icon: IconLanguage,
          href: "/table-one",
        },
        {
          id: uniqueId(),
          title: "Designation",
          icon: IconBriefcase,
          href: "/table-one",
        },
        {
          id: uniqueId(),
          title: "OTS Expensive Type",
          icon: IconCopy,
          href: "/table-one",
        },
        {
          id: uniqueId(),
          title: "FAQ",
          icon: IconMessages,
          href: "/table-one",
        },
      ],
    },
    {
      id: uniqueId(),
      title: "Donor",
      icon: IconRotate2,
      // href: "/table-one",
      subItems: [  // for nested sum menu item
        {
          id: uniqueId(),
          title: "Full List",
          icon: IconListDetails,
          href: "/donor-list",
        },
        {
          id: uniqueId(),
          title: "Members",
          icon: IconUsers,
          href: "/table-one",
        },
        {
          id: uniqueId(),
          title: "Viewers",
          icon: IconCardboards,
          href: "/table-one",
        },
        {
          id: uniqueId(),
          title: "Duplicate",
          icon: IconCash,
          href: "/table-one",
        },
        
      ],
    },
    {
      id: uniqueId(),
      title: "Receipts",
      icon: IconReceipt,
      href: "/formview",
    },
    {
      id: uniqueId(),
      title: "Schools",
      icon: IconSchool,
      // href: "/",
      subItems: [  // for nested sum menu item
        {
          id: uniqueId(),
          title: "Full List",
          icon: IconListDetails,
          href: "/",
        },
        {
          id: uniqueId(),
          title: "School To Allot",
          icon: IconComponents,
          href: "/",
        },
        {
          id: uniqueId(),
          title: "School Alloted",
          icon: IconComponents,
          href: "/",
        },
        {
          id: uniqueId(),
          title: "Repeat Donors",
          icon: IconRepeat,
          href: "/",
        },
      ],
    },
    {
      navlabel: true,
      subheader: "Summary",
    },
    {
      id: uniqueId(),
      title: "Reports",
      icon: IconReport,
      // href: "/",
      subItems: [  // for nested sum menu item
        {
          id: uniqueId(),
          title: "Donor Summary",
          icon: IconTypography,
          href: "/",
        },
        {
          id: uniqueId(),
          title: "Promoter Summary",
          icon: IconCopy,
          href: "/",
        },
        {
          id: uniqueId(),
          title: "Receipt Summary",
          icon: IconCopy,
          href: "/",
        },
        {
          id: uniqueId(),
          title: "Donation Summary",
          icon: IconCopy,
          href: "/",
        },
        {
          id: uniqueId(),
          title: "School Summary",
          icon: IconCopy,
          href: "/",
        },
        {
          id: uniqueId(),
          title: "10BD Statement",
          icon: IconCopy,
          href: "/",
        },
        {
          id: uniqueId(),
          title: "Suspense Summary",
          icon: IconCopy,
          href: "/",
        },
        {
          id: uniqueId(),
          title: "Payment Summary",
          icon: IconCopy,
          href: "/",
        },
      ],
    },
    {
      id: uniqueId(),
      title: "Download",
      icon: IconDownload,
      // href: "/authentication/register",
      subItems: [  // for nested sum menu item
        {
          id: uniqueId(),
          title: "Receipt",
          icon: IconTypography,
          href: "/",
        },
        {
          id: uniqueId(),
          title: "Donor",
          icon: IconCopy,
          href: "/",
        },
        {
          id: uniqueId(),
          title: "School",
          icon: IconCopy,
          href: "/",
        },
        {
          id: uniqueId(),
          title: "OTS",
          icon: IconCopy,
          href: "/",
        },
        {
          id: uniqueId(),
          title: "Team",
          icon: IconCopy,
          href: "/",
        },
        {
          id: uniqueId(),
          title: "All Receipts",
          icon: IconCopy,
          href: "/",
        },
      ],
    },
    {
      navlabel: true,
      subheader: "Extra",
    },
    {
      id: uniqueId(),
      title: "Others",
      icon: IconPeace,
      // href: "/icons",
      subItems: [  // for nested sum menu item
        {
          id: uniqueId(),
          title: "FAQ",
          icon: IconTypography,
          href: "/table",
        },
        {
          id: uniqueId(),
          title: "Team",
          icon: IconCopy,
          href: "/table-one",
        },
        {
          id: uniqueId(),
          title: "Notification",
          icon: IconCopy,
          href: "/table-one",
        },
      
      ],
    },
    
  ];
  
  export default Menuitems;
  


