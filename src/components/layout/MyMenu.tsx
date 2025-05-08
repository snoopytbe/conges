import React, { MouseEvent, useState } from "react";

// Import from Material UI
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Divider } from "@mui/material";

// Interface pour définir la structure des options de menu
interface MenuOption {
  menu: string;
  value?: string | number | null;
}

// Interface pour la position d'ancrage
interface AnchorPosition {
  top: number;
  left: number;
}

// Interface pour la position de la souris
interface MousePosition {
  mouseX: number;
  mouseY: number;
}

// Interface pour les props de PersonnalizedMenu
interface PersonnalizedMenuProps {
  open: boolean;
  onClose: () => void;
  anchorPosition: AnchorPosition;
  menuOptions: MenuOption[];
  width?: string;
  onClick: (event: MouseEvent<HTMLLIElement>, value?: string | number | null) => void;
}

/**
 * Composant PersonnalizedMenu - Menu personnalisé réutilisable
 */
const PersonnalizedMenu: React.FC<PersonnalizedMenuProps> = ({ 
  open, 
  onClose, 
  anchorPosition, 
  menuOptions, 
  width, 
  onClick 
}) => {
  return (
    <Menu
      keepMounted
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
    >
      {menuOptions.map((option) => {
        if (option.menu === "divider") {
          return <Divider key={`divider-${Math.random()}`} />;
        }
        return (
          <MenuItem
            key={option.menu}
            sx={{
              fontSize: "0.8em",
              lineHeight: "1",
              width: width,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            onClick={(event) => onClick(event, option.value)}
          >
            {option.menu}
          </MenuItem>
        );
      })}
    </Menu>
  );
};

// Interface pour les props de MyMenu
interface MyMenuProps {
  open: boolean;
  mousePos: MousePosition;
  menuOptions: MenuOption[];
  subMenuOptions: MenuOption[];
  onClick: (event: MouseEvent<HTMLLIElement>, abr: string, value?: string | number | null) => void;
  onClose: () => void;
}

/**
 * Composant principal MyMenu - Gère un menu principal et un sous-menu
 */
const MyMenu: React.FC<MyMenuProps> = ({ 
  open, 
  mousePos, 
  menuOptions, 
  subMenuOptions, 
  onClick, 
  onClose 
}) => {
  // États pour gérer le sous-menu
  const [activeSubMenu, setActiveSubMenu] = useState<boolean>(false);
  const [anchorPosition, setAnchorPosition] = useState<AnchorPosition>({ top: 0, left: 0 });
  const [selectedAbr, setSelectedAbr] = useState<string>("");

  /**
   * Gère le clic sur un élément du menu principal
   */
  const handleMenuItemClick = (event: MouseEvent<HTMLLIElement>, abr?: string | number | null): void => {
    event.preventDefault();
    setAnchorPosition({
      left: mousePos.mouseX + 100,
      top: event.clientY - 4,
    });
    setActiveSubMenu(true);
    setSelectedAbr(String(abr || ""));
  };

  return (
    <div>
      {/* Menu principal */}
      <PersonnalizedMenu
        open={open}
        onClose={onClose}
        anchorPosition={{ top: mousePos.mouseY, left: mousePos.mouseX }}
        menuOptions={menuOptions}
        width="100px"
        onClick={handleMenuItemClick}
      />

      {/* Sous-menu */}
      <PersonnalizedMenu
        open={activeSubMenu}
        onClose={onClose}
        anchorPosition={anchorPosition}
        menuOptions={subMenuOptions}
        onClick={(event, value) => {
          setActiveSubMenu(false);
          onClick(event, selectedAbr, value);
        }}
      />
    </div>
  );
};

export default MyMenu; 