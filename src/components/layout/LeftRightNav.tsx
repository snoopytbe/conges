import React from "react";

// Import des composants Material UI
import Fab from "@mui/material/Fab";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";

/**
 * Composant pour l'icône de flèche simple vers la gauche
 * @param {Object} props - Les propriétés du composant
 * @returns {JSX.Element} L'icône SVG
 */
function SimpleLeftArrowIcon(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon viewBox="0 0 15 15" {...props}>
      <path d="M8.842 3.135a.5.5 0 0 1 .023.707L5.435 7.5l3.43 3.658a.5.5 0 0 1-.73.684l-3.75-4a.5.5 0 0 1 0-.684l3.75-4a.5.5 0 0 1 .707-.023Z"></path>
    </SvgIcon>
  );
}

/**
 * Composant pour l'icône de double flèche vers la gauche
 * @param {Object} props - Les propriétés du composant
 * @returns {JSX.Element} L'icône SVG
 */
function DoubleLeftArrowIcon(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon viewBox="0 0 15 15" {...props}>
      <path d="M6.854 3.854a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L3.207 7.5l3.647-3.646Zm6 0a.5.5 0 0 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L9.207 7.5l3.647-3.646Z"></path>
    </SvgIcon>
  );
}

/**
 * Composant pour l'icône de flèche simple vers la droite
 * @param {Object} props - Les propriétés du composant
 * @returns {JSX.Element} L'icône SVG
 */
function SimpleRightArrowIcon(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon viewBox="0 0 15 15" {...props}>
      <path d="M6.158 3.135a.5.5 0 0 1 .707.023l3.75 4a.5.5 0 0 1 0 .684l-3.75 4a.5.5 0 1 1-.73-.684L9.566 7.5l-3.43-3.658a.5.5 0 0 1 .023-.707Z"></path>
    </SvgIcon>
  );
}

/**
 * Composant pour l'icône de double flèche vers la droite
 * @param {Object} props - Les propriétés du composant
 * @returns {JSX.Element} L'icône SVG
 */
function DoubleRightArrowIcon(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon viewBox="0 0 15 15" {...props}>
      <path d="M2.146 11.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 1 0-.708.708L5.793 7.5l-3.647 3.646Zm6 0a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 1 0-.708.708L11.793 7.5l-3.647 3.646Z"></path>
    </SvgIcon>
  );
}

type Position = 'doubleleft' | 'simpleleft' | 'doubleright' | 'simpleright';

interface MyFabProps {
  children: React.ReactNode;
  onClick: () => void;
  position: Position;
  myWidth: number; // Gardé pour la compatibilité avec la signature mais non utilisé
}

/**
 * Composant Fab personnalisé avec positionnement absolu
 * @param {Object} params - Les paramètres du composant
 * @param {React.ReactNode} params.children - Le contenu du bouton
 * @param {Function} params.onClick - La fonction de callback au clic
 * @param {string} params.position - La position du bouton ('doubleleft', 'simpleleft', 'doubleright', 'simpleright')
 * @param {number} params.myWidth - La largeur du conteneur parent (non utilisé actuellement)
 * @returns {JSX.Element} Le bouton Fab positionné
 */
const MyFab = ({ children, onClick, position }: MyFabProps): JSX.Element => {
  // Définition des positions en fonction du type de bouton
  const POSITIONS: Record<Position, { left?: number; right?: number }> = {
    doubleleft: { left: 5 },
    simpleleft: { left: 50 },
    doubleright: { right: 5 },
    simpleright: { right: 50 },
  };

  return (
    <Fab
      color="primary"
      size="small"
      sx={{
        position: "absolute",
        top: 5,
        ...POSITIONS[position]
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </Fab>
  );
};

interface LeftRightNavProps {
  myWidth: number;
  onClickLeft: () => void;
  onFastClickLeft: () => void;
  onClickRight: () => void;
  onFastClickRight: () => void;
}

/**
 * Composant principal de navigation avec boutons de défilement
 * @param {Object} params - Les paramètres du composant
 * @param {number} params.myWidth - La largeur du conteneur
 * @param {Function} params.onClickLeft - Callback pour le clic sur la flèche simple gauche
 * @param {Function} params.onFastClickLeft - Callback pour le clic sur la double flèche gauche
 * @param {Function} params.onClickRight - Callback pour le clic sur la flèche simple droite
 * @param {Function} params.onFastClickRight - Callback pour le clic sur la double flèche droite
 * @returns {JSX.Element} La barre de navigation
 */
const LeftRightNav = ({
  myWidth,
  onClickLeft,
  onFastClickLeft,
  onClickRight,
  onFastClickRight,
}: LeftRightNavProps): JSX.Element => {
  return (
    <>
      <MyFab position="doubleleft" onClick={onFastClickLeft} myWidth={myWidth}>
        <DoubleLeftArrowIcon htmlColor="#FFFFFF" />
      </MyFab>
      <MyFab position="simpleleft" onClick={onClickLeft} myWidth={myWidth}>
        <SimpleLeftArrowIcon htmlColor="#FFFFFF" />
      </MyFab>
      <MyFab position="simpleright" onClick={onClickRight} myWidth={myWidth}>
        <SimpleRightArrowIcon htmlColor="#FFFFFF" />
      </MyFab>
      <MyFab position="doubleright" onClick={onFastClickRight} myWidth={myWidth}>
        <DoubleRightArrowIcon htmlColor="#FFFFFF" />
      </MyFab>
    </>
  );
};

export default LeftRightNav; 