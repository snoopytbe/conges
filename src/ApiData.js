import axios from "axios";
import { URL } from "./urlAPI";

export function getApiData() {
  return axios
    .get(URL)
    .then((res) => {
      return res.data.Items;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
}

export function getApiRangeData(begin, end) {
  return axios
    .get(URL + "?begin=" + begin + "&end=" + end)
    .then((res) => {
      return res.data.Items;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
}

export function putApiData(data) {
  data.forEach((item) => {
    console.log(item);
    axios
      .put(
        URL +
          "?date=" +
          item.date +
          "&id=" +
          item.id +
          "&abr=" +
          item.abr +
          "&duree=" +
          item.duree
      )
      .catch((err) => {
        console.log(err);
      });
  });
}

export function deleteApiData(data) {
  data.forEach((item) => {
    axios
      .delete(URL + "?id=" + item.id)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  });
}
