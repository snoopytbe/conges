import React from "react";

// Import from Material UI
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Divider } from "@mui/material";

const PersonnalizedMenu = (params) => {
  const { open, onClose, anchorPosition, menuOptions, width, onClick } = params;

  return (
    <Menu
      keepMounted
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
    >
      {menuOptions.map((option) => {
        if (option.menu === "divider") return <Divider />;
        else
          return (
            <MenuItem
              key={option.menu}
              sx={{ fontSize: "0.8em", lineHeight: "1", width: { width } }}
              onClick={(event) => onClick(event, option.value)}
            >
              {option.menu}
            </MenuItem>
          );
      })}
    </Menu>
  );
};

export default function MyMenu(params) {
  const { open, mousePos, menuOptions, onClick, onClose } = params;

  return (
    <div>
      <PersonnalizedMenu
        open={open}
        onClose={onClose}
        anchorPosition={{ top: mousePos.mouseY, left: mousePos.mouseX }}
        menuOptions={menuOptions}
        width="100px"
        onClick={(event, value) => onClick(event, value)}
      />
    </div>
  );
}
