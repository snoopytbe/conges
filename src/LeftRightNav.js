import React from "react";

// Import from Material UI
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import SvgIcon from "@mui/material/SvgIcon";

function SimpleLeftArrowIcon(props) {
  return (
    <SvgIcon viewBox="0 0 15 15" {...props}>
      <path d="M8.842 3.135a.5.5 0 0 1 .023.707L5.435 7.5l3.43 3.658a.5.5 0 0 1-.73.684l-3.75-4a.5.5 0 0 1 0-.684l3.75-4a.5.5 0 0 1 .707-.023Z"></path>
    </SvgIcon>
  );
}

function DoubleLeftArrowIcon(props) {
  return (
    <SvgIcon viewBox="0 0 15 15" {...props}>
      <path d="M6.854 3.854a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L3.207 7.5l3.647-3.646Zm6 0a.5.5 0 0 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L9.207 7.5l3.647-3.646Z"></path>
    </SvgIcon>
  );
}

function SimpleRightArrowIcon(props) {
  return (
    <SvgIcon viewBox="0 0 15 15" {...props}>
      <path d="M6.158 3.135a.5.5 0 0 1 .707.023l3.75 4a.5.5 0 0 1 0 .684l-3.75 4a.5.5 0 1 1-.73-.684L9.566 7.5l-3.43-3.658a.5.5 0 0 1 .023-.707Z"></path>
    </SvgIcon>
  );
}

function DoubleRightArrowIcon(props) {
  return (
    <SvgIcon viewBox="0 0 15 15" {...props}>
      <path d="M2.146 11.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 1 0-.708.708L5.793 7.5l-3.647 3.646Zm6 0a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 1 0-.708.708L11.793 7.5l-3.647 3.646Z"></path>
    </SvgIcon>
  );
}

function MyFab(params) {
  const { children, onClick, position } = params;
  var sxPosition;
  switch (position) {
    case "doubleleft":
      sxPosition = { left: 5 };
      break;
    case "simpleleft":
      sxPosition = { left: 50 };
      break;
    case "doubleright":
      sxPosition = { right: 50 };
      break;
    case "simpleright":
      sxPosition = { right: 5 };
      break;
    default:
  }

  return (
    <Fab
      color="primary"
      size="small"
      sx={{
        position: "absolute",
        top: 5,
        ...sxPosition,
      }}
      onClick={onClick}
    >
      {children}
    </Fab>
  );
}

export default function Nav(params) {
  const { onClickLeft, onFastClickLeft, onClickRight, onFastClickRight } =
    params;

  return (
    <>
      <MyFab position="doubleleft" onClick={onFastClickLeft}>
        <IconButton aria-label="fastbefore">
          <DoubleLeftArrowIcon htmlColor="#FFFFFF" />
        </IconButton>
      </MyFab>
      <MyFab position="simpleleft" onClick={onClickLeft}>
        <IconButton aria-label="before">
          <SimpleLeftArrowIcon htmlColor="#FFFFFF" />
        </IconButton>
      </MyFab>
      <MyFab position="doubleright" onClick={onClickRight}>
        <IconButton aria-label="after">
          <SimpleRightArrowIcon htmlColor="#FFFFFF" />
        </IconButton>
      </MyFab>
      <MyFab position="simpleright" onClick={onFastClickRight}>
        <IconButton aria-label="fastafter">
          <DoubleRightArrowIcon htmlColor="#FFFFFF" />
        </IconButton>
      </MyFab>
    </>
  );
}
