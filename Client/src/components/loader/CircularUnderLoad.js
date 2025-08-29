import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";

import { Box } from "@mui/material";

export default function CircularUnderLoad({ isLoading }) {
  if (!isLoading) return null; // don't render anything when not loading

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.7)", // semi-transparent bg
        zIndex: 1300, // above MUI dialogs
      }}
    >
      <CircularProgress disableShrink />
    </Box>
  );
}
