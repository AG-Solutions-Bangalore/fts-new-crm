import {
  IconCopy,
  IconHierarchy,
  IconChartDots2,
  IconLayoutDashboard,
  IconUser,
  IconLanguage,
  IconBriefcase,
  IconMessages,
  IconTypography,
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
  IconBell,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";
//chnage mm
const Menuitems = (userTypeId) => [
  ...(userTypeId == 5
    ? ""
    : [
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
      ]),
  ...(userTypeId == 5
    ? [
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
          title: "Recepit",
          icon: IconReceipt,
          href: "/recepit-sup",
        },
      ]
    : ""),

  ...(userTypeId == 5
    ? ""
    : [
        ...(userTypeId == 2
          ? [
              {
                id: uniqueId(),
                title: "Chapters",
                icon: IconHierarchy,
                href: "/chapter",
              },
            ]
          : ""),
        ...(userTypeId == 2
          ? [
              {
                id: uniqueId(),
                title: "Data Sources",
                icon: IconChartDots2,
                href: "/datasource",
              },
            ]
          : ""),

        {
          navlabel: true,
          subheader: "Operation",
        },
        ...(userTypeId == 3
          ? [
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
            ]
          : ""),
        {
          id: uniqueId(),
          title: "Donors",
          icon: IconUsers,
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
            ...(userTypeId == 3
              ? [
                  {
                    id: uniqueId(),
                    title: "Viewers",
                    icon: IconCardboards,
                    href: "/viewer-list",
                  },
                ]
              : ""),
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
          subItems: [
            {
              id: uniqueId(),
              title: "Current Receipts",
              icon: IconReceipt,
              href: "/receipt-list",
            },
            {
              id: uniqueId(),
              title: "Old Receipts",
              icon: IconReceipt,
              href: "/receipt-old-list",
            },
            {
              id: uniqueId(),
              title: "Suspense Receipts",
              icon: IconReceipt,
              href: "/suspense-list",
            },
          ],
        },
        // {
        //   id: uniqueId(),
        //   title: "Receipts",
        //   icon: IconReceipt,
        //   href: "/receipt-list",
        // },
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
              href: "/students-schoolallot",
            },
            {
              id: uniqueId(),
              title: "Repeat Donors",
              icon: IconRepeat,
              href: "/students-report-donor",
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
              icon: IconCopy,
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
            {
              id: uniqueId(),
              title: "Suspense Summary",
              icon: IconCopy,
              href: "/report/suspense",
            },
            // {
            //   id: uniqueId(),
            //   title: "Payment Summary",
            //   icon: IconCopy,
            //   href: "/report/payment",
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
              icon: IconCopy,
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
              href: "/faq",
            },
            {
              id: uniqueId(),
              title: "Team",
              icon: IconUsers,
              href: "/team",
            },
            {
              id: uniqueId(),
              title: "Notification",
              icon: IconBell,
              href: "/notification",
            },
          ],
        },
      ]),
];

export default Menuitems;
