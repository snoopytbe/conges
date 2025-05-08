import React from "react";
import { Typography } from "@mui/material";
import DotLoader from "react-spinners/DotLoader";
import { LOADER_CONFIG } from "../../config/calendarConfig";

const LoadingIndicator = () => (
  <>
    <Typography variant="h1">
      <br />
    </Typography>
    <DotLoader
      color={LOADER_CONFIG.color}
      loading={true}
      size={LOADER_CONFIG.size}
      cssOverride={LOADER_CONFIG.cssOverride}
    />
    <Typography variant="h6" align="center">
      Chargement en cours
    </Typography>
  </>
);

export default LoadingIndicator; 