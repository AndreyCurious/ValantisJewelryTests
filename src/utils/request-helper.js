import arrayDuplicateFilter from "./array-dublicate-filter";
import objectDuplicateFilter from "./object-duplicate-filter";

/**
 * Получение корректных данных от апи, без дублей и ошибок
 * @param url {String}
 * @param body {Object}
 * @param token {String}
 * @param limit {Number}
 * @returns {Array}
 */

function getCorrectResponseItems(filtredArray, token) {
  const request = async (filtredArray) => {
    try {
      const getItems = await fetch('https://api.valantis.store:41000/', {
        method: "POST",
        headers: {
          "X-Auth": token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "action": "get_items",
          "params": { "ids": filtredArray }
        })
      })
      const getItemsJson = await getItems.json();
      console.log(getItemsJson)
      const filtredObject = objectDuplicateFilter(getItemsJson.result, 'id');
      console.log(filtredObject)
    } catch (e) {
      console.log(e);
      request(filtredArray);
    }
  }
  return request(filtredArray);
}

export default function getCorrectResponse(url, token, offset, limit) {
  const oldLimit = limit;
  const request = async (url, token, offset, limit) => {
    try {
      const data = await fetch(url, {
        method: "POST",
        headers: {
          "X-Auth": token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "action": "get_ids",
          "params": { "offset": offset, "limit": limit }
        })
      })
      const jsonData = await data.json();
      const filtredArray = arrayDuplicateFilter(jsonData.result);
      if (filtredArray.length < oldLimit) {
        return request(url, token, offset, limit + 1);
      } else {
        getCorrectResponseItems(filtredArray, token);
      }


    } catch (e) {
      request(url, token, offset, limit);
      console.log(e)
    }

  }
  return request(url, token, offset, limit);
}



