import axios from 'axios';
import {URL} from './urlAPI';

export function getApiData() {
  return axios
      .get(URL + '/items')
      .then((res) => {
      // console.log(res.data.Items);
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
        .put(URL + '/items', {
          date: item.date,
          id: item.id,
          abr: item.abr,
          duree: item.duree,
        })
        .catch((err) => {
          console.log(err);
        });
  });
}

export function deleteApiData(data) {
  data.forEach((item) => {
    axios
        .delete(URL + '/items/' + item.id)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
  });
}
