import { useState } from "react";

/**
 * Hook personnalisé pour gérer le menu contextuel
 * @returns {Object} - État et fonctions pour gérer le menu contextuel
 */
export function useContextMenu() {
  const [mousePos, setMousePos] = useState({ mouseX: 0, mouseY: 0 });
  const [activeMenu, setActiveMenu] = useState(false);

  /**
   * Gère l'ouverture du menu contextuel
   * @param {MouseEvent} event - L'événement de clic
   */
  const handleContextMenu = (event) => {
    event.preventDefault();
    setMousePos({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
    setActiveMenu(true);
  };

  /**
   * Ferme le menu contextuel
   */
  const closeMenu = () => {
    setActiveMenu(false);
  };

  return {
    mousePos,
    activeMenu,
    handleContextMenu,
    closeMenu
  };
} 