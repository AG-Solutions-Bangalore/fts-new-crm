import { Box, Dialog, DialogContent, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ContextPanel } from "../../utils/ContextPanel";
import BASE_URL from "../../base/BaseUrl";

export const Upgrade = ({ isCollapsed }) => {
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const [showUpdateBadge, setShowUpdateBadge] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [showDot, setShowDot] = useState(false);

  useEffect(() => {
    const verCon = localStorage.getItem("ver_con");
    if (verCon && isPanelUp?.version?.version_panel) {
      if (verCon !== isPanelUp.version.version_panel) {
        setShowUpdateBadge(true);
        setShowDot(true);
        const dotTimer = setTimeout(() => {
          setShowDot(false);
          setOpenDialog(true);
        }, 5000);
        return () => clearTimeout(dotTimer);
      }
    }
  }, [isPanelUp]);

  const handleUpdate = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/panel-logout`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.code === 200) {
        toast.success(res.data.msg);
        localStorage.clear();
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (isCollapsed) return null;

  return (
    <Box sx={{ 
      p: 0, 
      mt: 'auto',
      position: 'relative',
      height: showUpdateBadge ? '64px' : '48px'
      
    }}>
      {/* Version Display */}
      {!showUpdateBadge ? (
        <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-b-lg p-3  shadow-md  flex items-center justify-between"
  
        layout
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-white">
            v{localStorage.getItem("ver_con")}
          </span>
          {showDot && (
            <div className="w-2 h-2 rounded-full bg-white" />
          )}
        </div>
        <div className="text-[12px] font-medium text-white/90 mt-0">
       Updated: 19-04-2025
        </div>
      </motion.div>
         
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-b-lg p-2 shadow-md cursor-pointer"
          onClick={() => setOpenDialog(true)}
          layout
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white">
              New Update Available!
            </span>
            {showDot && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>
          <div className="text-[10px] text-white/80 mt-1">
            Current: v{localStorage.getItem("ver_con")} → New: v{isPanelUp?.version?.version_panel}
          </div>
        </motion.div>
      )}

      {/* Update Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => {}}
        maxWidth="xs"
        fullWidth
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            overflow: 'hidden',
            position: 'relative'
          }
        }}
      >
        <DialogContent className="p-6 text-center bg-gradient-to-br from-blue-50 to-gray-50">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center shadow-inner">
              <svg 
                className="w-7 h-7 text-blue-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" 
                />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Version Update Available
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            A new version <span className="font-medium">v{isPanelUp?.version?.version_panel}</span> is ready to install.
          </p>
          <div className="flex justify-center gap-3">
            <Button
              variant="contained"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-sm transition-all hover:shadow-md"
              onClick={handleUpdate}
              fullWidth
            >
              Update Now
            </Button>
            <Button
              variant="outlined"
              className="border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium shadow-sm transition-all"
              onClick={() => setOpenDialog(false)}
              fullWidth
            >
              Later
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Box>
  );
};



