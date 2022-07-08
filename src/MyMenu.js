import React from "react";

// Import from Material UI
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

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
  const { open, mousePos, menuOptions, subMenuOptions, onClick, onClose } =
    params;

  const [abr, setAbr] = React.useState("");

  const handleMenuItemClick = (event, abr) => {
    event.preventDefault();
    setAnchorPosition({
      left: mousePos.mouseX + 100,
      top: event.clientY - 4,
    });
    setActiveSubMenu(true);
    setAbr(abr);
  };

  const [activeSubMenu, setActiveSubMenu] = React.useState(false);

  const [anchorPosition, setAnchorPosition] = React.useState();

  return (
    <div>
      <PersonnalizedMenu
        open={open}
        onClose={onClose}
        anchorPosition={{ top: mousePos.mouseY, left: mousePos.mouseX }}
        menuOptions={menuOptions}
        width="100px"
        onClick={(event, value) => handleMenuItemClick(event, value)}
      />

      <PersonnalizedMenu
        open={activeSubMenu}
        onClose={onClose}
        anchorPosition={anchorPosition}
        menuOptions={subMenuOptions}
        onClick={(event, value) => {
          setActiveSubMenu(false);
          onClick(event, abr, value);
        }}
      />
    </div>
  );
}
