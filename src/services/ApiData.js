import axios from "axios";
import { URL } from "./urlAPI";

/**
 * Récupère toutes les données de l'API
 * @returns {Promise<Array>} Liste des données récupérées
 */
export function getApiData() {
  return axios
    .get(URL)
    .then((res) => res.data.Items)
    .catch((err) => {
      console.error("Erreur lors de la récupération des données:", err);
      return [];
    });
}

/**
 * Récupère les données de l'API dans une plage de dates spécifiée
 * @param {string} begin - Date de début au format YYYY-MM-DD
 * @param {string} end - Date de fin au format YYYY-MM-DD
 * @returns {Promise<Array>} Liste des données récupérées
 */
export function getApiRangeData(begin, end) {
  return axios
    .get(`${URL}?begin=${begin}&end=${end}`)
    .then((res) => res.data.Items)
    .catch((err) => {
      console.error("Erreur lors de la récupération des données par plage:", err);
      return [];
    });
}

/**
 * Met à jour ou crée des données dans l'API
 * @param {Array<Object>} data - Liste des données à mettre à jour
 * @returns {Promise<void>}
 */
export function putApiData(data) {
  const promises = data.map((item) =>
    axios
      .put(
        `${URL}?date=${item.date}&id=${item.id}&abr=${item.abr}&duree=${item.duree}`
      )
      .catch((err) => {
        console.error("Erreur lors de la mise à jour des données:", err);
      })
  );
  return Promise.all(promises);
}

/**
 * Supprime des données de l'API
 * @param {Array<Object>} data - Liste des données à supprimer
 * @returns {Promise<void>}
 */
export function deleteApiData(data) {
  const promises = data.map((item) =>
    axios
      .delete(`${URL}?id=${item.id}`)
      .catch((err) => {
        console.error("Erreur lors de la suppression des données:", err);
      })
  );
  return Promise.all(promises);
}
