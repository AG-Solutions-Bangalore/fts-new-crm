import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  Badge,
  Button,
  Tooltip,
} from "@mui/material";
import PropTypes from "prop-types";

// components
import Profile from "./Profile";
import {
  IconBellRinging,
  IconInfoOctagon,
  IconMenu,
  IconMenuDeep,
} from "@tabler/icons-react";
import { IconInfoSquareRounded } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

// interface ItemType {
//   toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
// }

const Header = ({ toggleMobileSidebar, toggleSidebar }) => {
  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  // const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: theme.palette.background.paper,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    borderRadius: 13,
    [theme.breakpoints.up("lg")]: {
      minHeight: "70px",
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));
  const navigate = useNavigate();
  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
          sx={{
            display: {
              lg: "inline",
              xs: "none",
            },
          }}
        >
          <IconMenuDeep width="20" height="20" />
        </IconButton>

        {/* <IconButton
          size="large"
          aria-label="show 11 new notifications"
          color="inherit"
          aria-controls="msgs-menu"
          aria-haspopup="true"
        >
          <Badge variant="dot" color="primary">
            <IconBellRinging size="21" stroke="1.5" />
          </Badge>
        </IconButton> */}
        <Box flexGrow={1} />
        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
      
        >
          {/* <Tooltip title="Help" arrow>
            <IconButton color="inherit" aria-label="menu">
              <IconInfoOctagon height={20} width={20} />
            </IconButton>
          </Tooltip> */}

          <Tooltip title="Profile" arrow>
            <Profile />
          </Tooltip>
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
