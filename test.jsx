import React, { forwardRef } from "react";
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { IconListCheck, IconMail, IconUser  } from "@tabler/icons-react";
import Logout from "../../components/Logout";

const Profile = forwardRef((props, ref) => {
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  
  const handleOpenLogout = () => setOpenModal(!openModal);
  
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  return (
    <Box>
      <IconButton
        ref={ref} // Attach the ref here
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src="/images/profile/user-1.jpg"
          alt="image"
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
          },
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <IconUser  width={20} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <IconMail width={20} />
          </ListItemIcon>
          <ListItemText>My Account</ListItemText>
        </MenuItem>
        {/* Uncomment if you want to add My Tasks option */}
        {/* <MenuItem>
          <ListItemIcon>
            <IconListCheck width={20} />
          </ListItemIcon>
          <ListItemText>My Tasks</ListItemText>
        </MenuItem> */}
        {/* Uncomment if you want to add Help option */}
        {/* <MenuItem 
            onClick={() => {
            navigate("/manualguide-book");
          }}
        >
          <ListItemIcon>
            <IconListCheck width={20} />
          </ListItemIcon>
          <ListItemText>Help</ListItemText>
        </MenuItem> */}
        <Box mt={1} py={1} px={2}>
          <Button
            onClick={handleOpenLogout}
            variant="outlined"
            color="primary"
            fullWidth
          >
            Logout
          </Button>
        </Box>
      </Menu>
      <Logout open={openModal} handleOpen={handleOpenLogout} />
    </Box>
  );
});

export default Profile;