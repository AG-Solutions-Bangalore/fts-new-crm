import React from "react";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";




export default function NavItem({
  item,
  level,
  pathDirect,
  hideMenu,
  isCollapsed,
}) {
  const Icon = item.icon;
  const theme = useTheme();
  const itemIcon = <Icon stroke={1.5} size="1.3rem" />;


  const [isExpanded, setIsExpanded] = React.useState(() => {
    if (item?.subItems) {
      const savedState = localStorage.getItem(`menu-${item.id}`);
      const isCurrentPathInSubItems = item.subItems.some(
        subItem => subItem.href === pathDirect
      );
      return savedState ? savedState === 'true' : isCurrentPathInSubItems;
    }
    return false;
  });
  React.useEffect(() => {
    if (item?.subItems) {
      localStorage.setItem(`menu-${item.id}`, isExpanded);
    }
  }, [isExpanded, item?.id]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const ListItemStyled = styled(ListItemButton)(() => ({
    whiteSpace: "nowrap",
    marginBottom: "2px",
    padding: "5px 10px 5px 0",
    borderRadius: `30px`,
    backgroundColor: level > 1 ? "transparent !important" : "inherit",
    color:
      level > 1 && pathDirect === item?.href
        ? `${theme.palette.primary.main}!important`
        : theme.palette.text.secondary,
    fontWeight:
      level > 1 && pathDirect === item?.href ? "600 !important" : "400",
    paddingLeft: hideMenu
      ? "0"
      : level > 2
      ? `${level * 15}px`
      : level > 1
      ? "10px"
      : "0",
    "&:before": {
      content: '""',
      position: "absolute",
      top: 0,
      bottom: 0,
      left: "-20px",
      height: "100%",
      zIndex: "-1",
      borderRadius: " 0 24px 24px 0",
      transition: "all .3s ease-in-out",
      width: "0",
    },
    "&:hover::before": {
      width: "calc(100% + 20px)",
      backgroundColor: theme.palette.primary.light,
    },
    "& > .MuiListItemIcon-root": {
      width: 45,
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "8px",
      marginRight: "8px",
      transition: "all .3s ease-in-out",
    },
    "&:hover": {
      backgroundColor: "transparent !important",
    },
    "&.Mui-selected": {
      backgroundColor: "transparent !important",
      ".MuiListItemIcon-root": {
        color: theme.palette.primary.main,
      },
      "&:before": {
        backgroundColor: theme.palette.primary.light,
        width: "calc(100% + 16px)",
      },
      "&:hover": {
        // backgroundColor: theme.palette.primary.light,
        color: theme.palette.text.primary,
      },
    },
  }));


   const SubItemStyled = styled(ListItemButton)(() => ({
    whiteSpace: "nowrap",
    marginBottom: "2px",
    padding: "5px 10px 5px 0",
    borderRadius: `30px`,
    backgroundColor: "transparent !important",
    color: pathDirect === item?.href
      ? `${theme.palette.primary.main}!important`
      : theme.palette.text.secondary,
    fontWeight: pathDirect === item?.href ? "600 !important" : "400",
    paddingLeft: !isCollapsed ? "20px" : "10px",
    "&:before": {
      content: '""',
      position: "absolute",
      top: 0,
      bottom: 0,
      left: "-20px",
      height: "100%",
      zIndex: "-1",
      borderRadius: " 0 24px 24px 0",
      transition: "all .3s ease-in-out",
      width: "0",
    },
    "&:hover::before": {
      width: "calc(100% + 20px)",
      backgroundColor: theme.palette.primary.light,
    },
    "& > .MuiListItemIcon-root": {
      width: 45,
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "8px",
      marginRight: "8px",
      transition: "all .3s ease-in-out",
    },
    "&:hover": {
      backgroundColor: "transparent !important",
    },
    "&.Mui-selected": {
      backgroundColor: "transparent !important",
      ".MuiListItemIcon-root": {
        color: theme.palette.primary.main,
      },
      "&:before": {
        backgroundColor: theme.palette.primary.light,
        width: "calc(100% + 16px)",
      },
      "&:hover": {
        color: theme.palette.primary.main,
        ".MuiListItemIcon-root": {
          color: theme.palette.primary.main,
        },
      },
    },
  }));

  const listItemProps = {
    component: item?.external ? "a" : Link,
    to: item?.href,
    href: item?.external ? item?.href : "",
    target: item?.external ? "_blank" : "",
  };

  return (
    <List component="li" disablePadding key={item?.id && item.title}>
      <Link href={item.href} style={{ textDecoration: "none" }}>
        <ListItemStyled
          {...listItemProps}
          disabled={item?.disabled}
          selected={pathDirect === item?.href}
          onClick={item?.subItems ? handleToggle : undefined} // Only toggle if subItems exist
          sx={{
            "&:hover": {
              ".MuiListItemIcon-root": {
                color: item.bgcolor + ".main",
                //backgroundColor: level < 2 ? menu.bgcolor + ".light" : "",
              },
            },
            "&:hover::before": {
              backgroundColor: item.bgcolor + ".light",
            },
            // ".MuiListItemIcon-root": {
            //   color: item.bgcolor + ".main",
            //   backgroundColor: item.bgcolor + ".light",
            // },
            "&.Mui-selected": {
              color:
                level > 1
                  ? `${theme.palette.text.secondary} !important`
                  : "primary.main",
              "& .MuiTypography-root": {
                fontWeight: "600 !important",
              },
              ".MuiListItemIcon-root": {
                color: "primary.main",
              },
              "&:before": {
                backgroundColor: "primary.light",
              },
              "&:hover": {
                color: "primary.main",
                ".MuiListItemIcon-root": {
                  color: "primary.main",
                },
              },
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: "36px",
              p: "3px 0",
              color:
                level > 1 && pathDirect === item?.href
                  ? `${theme.palette.primary.main}!important`
                  : "inherit",
            }}
          >
            {itemIcon}
          </ListItemIcon>
          <ListItemText>
            {/* {hideMenu ? "" : <>{`${item?.title}`}</>} */}
            {!isCollapsed ? hideMenu ? null : <>{item?.title}</> : ""}
            <br />
            {item?.subtitle ? (
              <Typography variant="caption">
                {hideMenu ? "" : item?.subtitle}
              </Typography>
            ) : (
              ""
            )}
          </ListItemText>

          {!item?.chip || hideMenu ? null : (
            <Chip
              color={item?.chipColor}
              variant={item?.variant ? item?.variant : "filled"}
              size="small"
              label={item?.chip}
            />
          )}
       {
        isCollapsed ? "":
        item?.subItems && (
          <ListItemIcon
            sx={{
              minWidth: "36px",
              p: "3px 0",
              color: "inherit",
            }}
          >
            {isExpanded ? <IconChevronUp /> : <IconChevronDown />}
          </ListItemIcon>
        )
       }

          
        </ListItemStyled>
      </Link>
      {/* Sub-Menu Items (Collapsible) */}
      {item?.subItems && (
        <List component="div" disablePadding>
           {isExpanded &&
            item.subItems.map((subItem) => (
              <Link
                key={subItem.id}
                to={subItem.href}
                style={{ textDecoration: "none" }}
              >
                <SubItemStyled
                  selected={pathDirect === subItem.href}
                  sx={{
                    "&:hover": {
                      ".MuiListItemIcon-root": {
                        color: subItem.bgcolor + ".main",
                      },
                    },
                    "&:hover::before": {
                      backgroundColor: subItem.bgcolor + ".light",
                    },
                    "&.Mui-selected": {
                      color: "primary.main",
                      "& .MuiTypography-root": {
                        fontWeight: "600 !important",
                      },
                      ".MuiListItemIcon-root": {
                        color: "primary.main",
                      },
                      "&:before": {
                        backgroundColor: "primary.light",
                      },
                      "&:hover": {
                        color: "primary.main",
                        ".MuiListItemIcon-root": {
                          color: "primary.main",
                        },
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: "36px",
                      p: "3px 0",
                      color: pathDirect === subItem?.href
                        ? `${theme.palette.primary.main}!important`
                        : "inherit",
                    }}
                  >
                    <subItem.icon stroke={1.5} size="1.1rem" />
                  </ListItemIcon>
                  <ListItemText primary={!isCollapsed ? subItem.title : ""}    />
                </SubItemStyled>
              </Link>
            ))}
        </List>
      )}
      
    </List>
  );
}
