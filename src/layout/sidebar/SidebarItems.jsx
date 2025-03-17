import React, { useMemo } from "react";
import Menuitems from "./MenuItems";
import { Box, List } from "@mui/material";

import { useLocation } from "react-router-dom";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";

const SidebarItems = ({ toggleMobileSidebar, isCollapsed }) => {
  const location = useLocation();
  const pathDirect = location.pathname;
  const userTypeId = localStorage.getItem("user_type_id");
  // console.log(userTypeId, "userTypeId");
  // const MenuData = useMemo(() => Menuitems(userTypeId), [userTypeId]);
  const MenuData = Menuitems(userTypeId);
  //chnage mm
  return (
    <Box sx={{ px: "20px" }}>
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
        {MenuData.map((item) => {
          // {/********SubHeader**********/}
          if (item.subheader) {
            return (
              <NavGroup
                item={item}
                key={item.subheader}
                isCollapsed={isCollapsed}
              />
            );

            // {/********If Sub Menu**********/}
            /* eslint no-else-return: "off" */
          } else {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                onClick={toggleMobileSidebar}
                isCollapsed={isCollapsed}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
