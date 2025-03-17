import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const Upgrade = ({ isCollapsed }) => {
  if (isCollapsed) return null;

  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount((prev) => prev + 1);
  }, []);

  const directions = ["bottom", "left", "top", "right"];
  const direction = directions[count % directions.length];

  const animationVariants = {
    bottom: { opacity: 0, y: 20, scale: 1.2 },
    left: { opacity: 0, x: -20, scale: 1.2 },
    top: { opacity: 0, y: -20, scale: 1.2 },
    right: { opacity: 0, x: 20, scale: 1.2 },
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{ m: 1, p: 1, justifyContent: "center" }}
    >
      <motion.h2
        key={count}
        className="text-xs text-gray-600 border-b-2 border-dashed border-black"
        initial={animationVariants[direction]}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          type: "spring",
          stiffness: 120,
          damping: 10,
        }}
      >
        Updated On: 17-03-2025
      </motion.h2>
    </Box>
  );
};
