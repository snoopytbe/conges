import React from 'react';
import axios from 'axios';

const URL = 'https://6wgag8geol.execute-api.eu-west-1.amazonaws.com/';

export function getApiData() {
  return axios
    .get(URL + '/items')
    .then((res) => {
      console.log(res.data.Items);
      return res.data.Items;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
}
