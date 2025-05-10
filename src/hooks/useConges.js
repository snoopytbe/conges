import { useState, useEffect, useCallback, useRef } from "react";
import { getApiRangeData, modifieConges } from "../services";
import { precedent1ermai, prochain30avril } from "../services/vacances";
import {
  min as dateMin,
  max as dateMax,
  addMonths,
  startOfYear,
  startOfMonth,
  endOfMonth,
  format,
  isWithinInterval
} from "date-fns";

/**
 * Hook personnalisé pour gérer les congés
 * @param {Date} dateDebut - Date de début pour le chargement des congés
 * @param {number} nbMonths - Nombre de mois à afficher
 * @param {Function} setSnackbar - Fonction pour afficher les notifications
 * @returns {Object} - État et fonctions pour gérer les congés
 */

// Cache pour stocker les données des congés
const congesCache = new Map();

export function useConges(dateDebut, nbMonths, setSnackbar, user) {
  const [conges, setConges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlighted, setHighlighted] = useState(null); // { start: Date, end: Date } ou null
  const clickedRef = useRef(false);
  const startDateHighlightRef = useRef(null);

  // Génère une clé unique pour le cache basée sur la période
  const getCacheKey = useCallback((startDate, endDate) => {
    return `${format(startDate, 'yyyy-MM')}-${format(endDate, 'yyyy-MM')}`;
  }, []);

  const fetchConges = useCallback(async () => {
    try {
      // Calcul des dates de début et fin pour le chargement des données
      const dateDebutData = dateMin([
        startOfYear(dateDebut),
        precedent1ermai(dateDebut)
      ]);

      const dateFinData = prochain30avril(
        addMonths(dateDebut, nbMonths + 1)
      );

      const cacheKey = getCacheKey(dateDebutData, dateFinData);

      // Vérifie si les données sont déjà en cache
      if (congesCache.has(cacheKey)) {
        setConges(congesCache.get(cacheKey));
        return;
      }

      try {
        const data = await getApiRangeData(
          format(dateDebutData, 'yyyy-MM-dd'),
          format(dateFinData, 'yyyy-MM-dd')
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
  }, [dateDebut, nbMonths, getCacheKey, setSnackbar, user]);

  useEffect(() => {
    fetchConges();
  }, [fetchConges]);

  // Gestion du clic sur une date
  const handleClick = useCallback((event, myDate) => {
    event.preventDefault();
    if (!clickedRef.current) {
      startDateHighlightRef.current = myDate;
      setHighlighted({ start: myDate, end: myDate });
      clickedRef.current = true;
    } else {
      if (startDateHighlightRef.current) {
        const start = dateMin([startDateHighlightRef.current, myDate]);
        const end = dateMax([startDateHighlightRef.current, myDate]);
        setHighlighted({ start, end });
      }
      clickedRef.current = false;
    }
  }, []);

  // Gestion du menu contextuel
  const handleContextMenu = useCallback((event, myDate) => {
    event.preventDefault();
    // Si la date est déjà dans la sélection, ne rien faire
    if (
      highlighted &&
      isWithinInterval(myDate, { start: highlighted.start, end: highlighted.end })
    ) {
      return;
    }
    setHighlighted({ start: startDateHighlightRef.current, end: myDate });
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
        startOfMonth(highlighted.start),
        endOfMonth(highlighted.end)
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
  }, [highlighted, conges, getCacheKey, setSnackbar, user]);

  return {
    conges,
    loading,
    highlighted,
    handleClick,
    handleContextMenu,
    handleModifyConges,
  };
} 