import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export const Upgrade = ({ isCollapsed }) => {
  return (
    <>
      {!isCollapsed ? (
        <Box display={"flex"} alignItems="center" gap={2} sx={{ m: 3  }}>
          <>
            <h2 className="text-xs  text-gray-600 border-b-2 border-dashed border-black">
              Updated On: 28-11-2024
            </h2>
         
          </>
        </Box>
      ) : (
        ""
      )}
    </>
  );
};
