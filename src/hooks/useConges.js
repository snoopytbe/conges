import { useState, useEffect, useCallback, useRef } from "react";
import { getApiRangeData, formatMoment, modifieConges } from "../services";
import { precedent1ermai, prochain30avril } from "../services/vacances";
import moment from "moment";

/**
 * Hook personnalisé pour gérer les congés
 * @param {moment} dateDebut - Date de début pour le chargement des congés
 * @param {number} nbMonths - Nombre de mois à afficher
 * @param {Function} setSnackbar - Fonction pour afficher les notifications
 * @returns {Object} - État et fonctions pour gérer les congés
 */

// Cache pour stocker les données des congés
const congesCache = new Map();

export function useConges(dateDebut, nbMonths, setSnackbar) {
  const [conges, setConges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlighted, setHighlighted] = useState(null);
  const clickedRef = useRef(false);
  const startDateHighlightRef = useRef(null);

  // Génère une clé unique pour le cache basée sur la période
  const getCacheKey = useCallback((startDate, endDate) => {
    return `${startDate.format('YYYY-MM')}-${endDate.format('YYYY-MM')}`;
  }, []);

  const fetchConges = useCallback(async () => {
    try {
      // Calcul des dates de début et fin pour le chargement des données
      const dateDebutData = moment.min(
        moment([dateDebut.year(), 0, 1]),
        precedent1ermai(dateDebut)
      );

      const dateFinData = prochain30avril(
        dateDebut.clone().add(nbMonths + 1, "months")
      );

      const cacheKey = getCacheKey(dateDebutData, dateFinData);

      // Vérifie si les données sont déjà en cache
      if (congesCache.has(cacheKey)) {
        setConges(congesCache.get(cacheKey));
        return;
      }

      //setLoading(true);
      try {
        const data = await getApiRangeData(
          formatMoment(dateDebutData),
          formatMoment(dateFinData)
        );
        
        // Mise en cache des données
        congesCache.set(cacheKey, data);
        
        setConges(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des congés:", error);
        setSnackbar({
          open: true,
          message: "Erreur lors de la récupération des congés",
          severity: "error"
        });
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des congés:", error);
      setSnackbar({
        open: true,
        message: "Erreur lors du chargement des congés",
        severity: "error"
      });
      setLoading(false);
    }
  }, [dateDebut, nbMonths, getCacheKey, setSnackbar]);

  useEffect(() => {
    fetchConges();
  }, [fetchConges]);

  // Gestion du clic sur une date
  const handleClick = useCallback((event, myDate) => {
    event.preventDefault();
    
    if (!clickedRef.current) {
      startDateHighlightRef.current = myDate;
      setHighlighted(moment.range(myDate, myDate));
      clickedRef.current = true;
    } else {
      if (startDateHighlightRef.current) {
        setHighlighted(
          moment.range(
            moment.min(startDateHighlightRef.current, myDate),
            moment.max(startDateHighlightRef.current, myDate)
          )
        );
      }
      clickedRef.current = false;
    }
  }, [highlighted]);

  // Gestion du menu contextuel
  const handleContextMenu = useCallback((event, myDate) => {
    event.preventDefault();
    if (highlighted?.contains(myDate)) {
      setHighlighted(null);
    } else {
      setHighlighted(moment.range(startDateHighlightRef.current, myDate));
    }
    clickedRef.current = false;
  }, [highlighted]);

  // Modification des congés
  const handleModifyConges = useCallback(async (abr, duree) => {
    if (!highlighted) return;

    try {
      setConges(modifieConges(abr, duree, highlighted, conges));
      setHighlighted(null);
      
      // Invalide le cache pour la période concernée
      const cacheKey = getCacheKey(
        moment(highlighted.start).startOf('month'),
        moment(highlighted.end).endOf('month')
      );
      congesCache.delete(cacheKey);
      
      setSnackbar({
        open: true,
        message: "Congés mis à jour avec succès",
        severity: "success"
      });
    } catch (error) {
      console.error("Erreur lors de la modification des congés:", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la modification des congés",
        severity: "error"
      });
    }
  }, [highlighted, conges, getCacheKey, setSnackbar]);

  return {
    conges,
    loading,
    highlighted,
    handleClick,
    handleContextMenu,
    handleModifyConges,
  };
} 