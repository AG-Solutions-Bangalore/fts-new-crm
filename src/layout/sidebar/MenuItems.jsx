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
    href: "/chapter",
  },
  {
    id: uniqueId(),
    title: "Data Sources",
    icon: IconChartDots2,
    href: "/datasource",
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
    subItems: [
      // for nested sum menu item
      {
        id: uniqueId(),
        title: "Chapters",
        icon: IconHierarchy,
        href: "/master/chapters",
      },
      {
        id: uniqueId(),
        title: "States",
        icon: IconLanguage,
        href: "/master/states",
      },
      {
        id: uniqueId(),
        title: "Designation",
        icon: IconBriefcase,
        href: "/master/designation",
      },
      {
        id: uniqueId(),
        title: "OTS Expensive Type",
        icon: IconCopy,
        href: "/master/expensive-type",
      },
      {
        id: uniqueId(),
        title: "FAQ",
        icon: IconMessages,
        href: "/master/faqList",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Donor",
    icon: IconRotate2,
    // href: "/table-one",
    subItems: [
      // for nested sum menu item
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
        href: "/member-list",
      },
      {
        id: uniqueId(),
        title: "Viewers",
        icon: IconCardboards,
        href: "/viewer-list",
      },
      {
        id: uniqueId(),
        title: "Duplicate",
        icon: IconCash,
        href: "/duplicate-list",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Receipts",
    icon: IconReceipt,
    href: "/receipt-list",
  },
  {
    id: uniqueId(),
    title: "Schools",
    icon: IconSchool,
    // href: "/",
    subItems: [
      // for nested sum menu item
      {
        id: uniqueId(),
        title: "Full List",
        icon: IconListDetails,
        href: "/students-full-list",
      },
      {
        id: uniqueId(),
        title: "School To Allot",
        icon: IconComponents,
        href: "/students-to-allot",
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
    subItems: [
      // for nested sum menu item
      {
        id: uniqueId(),
        title: "Donor Summary",
        icon: IconTypography,
        href: "/report/donorsummary",
      },
      {
        id: uniqueId(),
        title: "Promoter Summary",
        icon: IconCopy,
        href: "/report/promoter",
      },
      {
        id: uniqueId(),
        title: "Receipt Summary",
        icon: IconCopy,
        href: "/report/recepit",
      },
      {
        id: uniqueId(),
        title: "Donation Summary",
        icon: IconCopy,
        href: "/report/donation",
      },
      {
        id: uniqueId(),
        title: "School Summary",
        icon: IconCopy,
        href: "/report/school",
      },
      {
        id: uniqueId(),
        title: "10BD Statement",
        icon: IconCopy,
        href: "/report/otg",
      },
      // {
      //   id: uniqueId(),
      //   title: "Suspense Summary",
      //   icon: IconCopy,
      //   href: "/",
      // },
      // {
      //   id: uniqueId(),
      //   title: "Payment Summary",
      //   icon: IconCopy,
      //   href: "/",
      // },
    ],
  },
  {
    id: uniqueId(),
    title: "Download",
    icon: IconDownload,
    // href: "/authentication/register",
    subItems: [
      // for nested sum menu item
      {
        id: uniqueId(),
        title: "Receipt",
        icon: IconTypography,
        href: "/download/receipts",
      },
      {
        id: uniqueId(),
        title: "Donor",
        icon: IconCopy,
        href: "/download/donor",
      },
      {
        id: uniqueId(),
        title: "School",
        icon: IconCopy,
        href: "/download/school",
      },
      {
        id: uniqueId(),
        title: "OTS",
        icon: IconCopy,
        href: "/download/ots",
      },
      {
        id: uniqueId(),
        title: "Team",
        icon: IconCopy,
        href: "/download/team",
      },
      {
        id: uniqueId(),
        title: "All Receipts",
        icon: IconCopy,
        href: "/download/allrecepit",
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
    subItems: [
      // for nested sum menu item
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
