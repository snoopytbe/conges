import React from "react";

/**
 * Hook qui renvoie le nombre de mois qui doivent être affichés dans le calendrier, en fonction
 * de la largeur de la fenêtre actuelle
 * @returns Le nombre de mois à afficher.
 */
export const useWindowWidth = () => {
  const MONTH_WIDTH = 139;

  const [nbMonths, setNbMonths] = React.useState();

  React.useEffect(() => {
    const handleWindowResize = () => {
      setNbMonths(Math.floor(window.innerWidth / MONTH_WIDTH));
    };

    handleWindowResize();

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return nbMonths;
};
