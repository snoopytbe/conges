import React from "react";
import PropTypes from "prop-types";

// Import from Material UI
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Divider } from "@mui/material";

/**
 * Composant PersonnalizedMenu - Menu personnalisé réutilisable
 * @param {Object} params - Les propriétés du menu
 * @param {boolean} params.open - État d'ouverture du menu
 * @param {Function} params.onClose - Fonction de fermeture du menu
 * @param {Object} params.anchorPosition - Position d'ancrage du menu
 * @param {Array} params.menuOptions - Options du menu
 * @param {string} params.width - Largeur du menu
 * @param {Function} params.onClick - Gestionnaire de clic
 */
const PersonnalizedMenu = ({ open, onClose, anchorPosition, menuOptions, width, onClick }) => {
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

// Validation des props pour PersonnalizedMenu
PersonnalizedMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  anchorPosition: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
  }).isRequired,
  menuOptions: PropTypes.arrayOf(
    PropTypes.shape({
      menu: PropTypes.string.isRequired,
      value: PropTypes.any,
    })
  ).isRequired,
  width: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

/**
 * Composant principal MyMenu - Gère un menu principal et un sous-menu
 * @param {Object} params - Les propriétés du menu
 * @param {boolean} params.open - État d'ouverture du menu principal
 * @param {Object} params.mousePos - Position de la souris
 * @param {Array} params.menuOptions - Options du menu principal
 * @param {Array} params.subMenuOptions - Options du sous-menu
 * @param {Function} params.onClick - Gestionnaire de clic
 * @param {Function} params.onClose - Fonction de fermeture
 */
export default function MyMenu({ open, mousePos, menuOptions, subMenuOptions, onClick, onClose }) {
  // États pour gérer le sous-menu
  const [activeSubMenu, setActiveSubMenu] = React.useState(false);
  const [anchorPosition, setAnchorPosition] = React.useState({ top: 0, left: 0 });
  const [selectedAbr, setSelectedAbr] = React.useState("");

  /**
   * Gère le clic sur un élément du menu principal
   * @param {Event} event - L'événement de clic
   * @param {string} abr - L'abréviation sélectionnée
   */
  const handleMenuItemClick = (event, abr) => {
    event.preventDefault();
    setAnchorPosition({
      left: mousePos.mouseX + 100,
      top: event.clientY - 4,
    });
    setActiveSubMenu(true);
    setSelectedAbr(abr);
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
}

// Validation des props pour MyMenu
MyMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  mousePos: PropTypes.shape({
    mouseX: PropTypes.number.isRequired,
    mouseY: PropTypes.number.isRequired,
  }).isRequired,
  menuOptions: PropTypes.arrayOf(
    PropTypes.shape({
      menu: PropTypes.string.isRequired,
      value: PropTypes.any,
    })
  ).isRequired,
  subMenuOptions: PropTypes.arrayOf(
    PropTypes.shape({
      menu: PropTypes.string.isRequired,
      value: PropTypes.any,
    })
  ).isRequired,
  onClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
