import StoreModule from '../module';
import exclude from '../../utils/exclude';
import md5 from 'md5';
import objectDuplicateFilter from '../../utils/object-duplicate-filter';
import arrayDuplicateFilter from '../../utils/array-dublicate-filter';
import getCorrectResponse from '../../utils/request-helper';

/**
 * Состояние каталога - параметры фильтра и список товара
 */
class CatalogState extends StoreModule {

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      list: [],
      params: {
        page: 1,
        limit: 50,
        sort: 'order',
        query: '',
        offset: 0
      },
      count: 0,
      waiting: false
    }
  }

  /**
   * Инициализация параметров.
   * Восстановление из адреса
   * @param [newParams] {Object} Новые параметры
   * @return {Promise<void>}
   */
  async initParams(newParams = {}) {
    const urlParams = new URLSearchParams(window.location.search);
    let validParams = {};
    if (urlParams.has('page')) validParams.page = Number(urlParams.get('page')) || 1;
    if (urlParams.has('limit')) validParams.limit = Math.min(Number(urlParams.get('limit')) || 0);
    if (urlParams.has('sort')) validParams.sort = urlParams.get('sort');
    if (urlParams.has('query')) validParams.query = urlParams.get('query');
    if (urlParams.has('offset')) validParams.query = urlParams.get('offset');
    await this.setParams({ ...this.initState().params, ...validParams, ...newParams }, true);
  }

  /**
   * Сброс параметров к начальным
   * @param [newParams] {Object} Новые параметры
   * @return {Promise<void>}
   */
  async resetParams(newParams = {}) {
    // Итоговые параметры из начальных, из URL и из переданных явно
    const params = { ...this.initState().params, ...newParams };
    // Установка параметров и загрузка данных
    await this.setParams(params);
  }

  /**
   * Установка параметров и загрузка списка товаров
   * @param [newParams] {Object} Новые параметры
   * @param [replaceHistory] {Boolean} Заменить адрес (true) или новая запись в истории браузера (false)
   * @returns {Promise<void>}
   */
  async setParams(newParams = {}, replaceHistory = false) {
    const params = { ...this.getState().params, ...newParams };

    // Установка новых параметров и признака загрузки
    this.setState({
      ...this.getState(),
      params,
      waiting: true
    }, 'Установлены параметры каталога');

    // Сохранить параметры в адрес страницы
    let urlSearch = new URLSearchParams(exclude(params, this.initState().params)).toString();
    const url = window.location.pathname + (urlSearch ? `?${urlSearch}` : '') + window.location.hash;
    if (replaceHistory) {
      window.history.replaceState({}, '', url);
    } else {
      window.history.pushState({}, '', url);
    }

    const apiParams = exclude({
      limit: params.limit,
      skip: (params.page - 1) * params.limit,
      fields: 'items(*),count',
      sort: params.sort,
      'search[query]': params.query,
      'search[category]': params.category
    }, {
      skip: 0,
      'search[query]': '',
      'search[category]': ''
    });

    const password = 'Valantis';
    const today = new Date().toISOString().slice(0, 10).split('-').join('');
    const xAuth = md5(`${password}_${today}`);
    const { page, limit, offset } = this.getState().params

    // Надо бы добавить на сервере отправку полного количества товаров, чтобы выводить последнюю страницу в пагинации
    // Понимаю, что делать такой запрос - плохая идея, но хотелось сделать пагинацию с полным количеством страниц
    this.setState({
      ...this.getState(),
      waiting: true,
    });
    const allCount = await fetch('https://api.valantis.store:41000/', {
      method: "POST",
      headers: {
        "X-Auth": xAuth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "action": "get_ids",
        "params": { "offset": 0, "limit": null }
      })
    })
    const allCountJson = await allCount.json();
    const filtredAllCount = arrayDuplicateFilter(allCountJson.result);
    this.setState({
      ...this.getState(),
      count: Math.ceil(filtredAllCount.length / limit),
    })

    const requestIds = async (filtredArray) => {
      try {
        const getItems = await fetch('https://api.valantis.store:41000/', {
          method: "POST",
          headers: {
            "X-Auth": xAuth,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "action": "get_items",
            "params": { "ids": filtredArray }
          })
        })
        const getItemsJson = await getItems.json();
        const filtredObject = objectDuplicateFilter(getItemsJson.result, 'id');
        this.setState({
          ...this.getState(),
          list: filtredObject,
          waiting: false,
        });
      } catch (e) {
        console.log(e);
        requestIds(filtredArray);
      }
    }


    const oldLimit = limit;
    const requestItems = async (limit) => {

      try {
        const data = await fetch('https://api.valantis.store:41000/', {
          method: "POST",
          headers: {
            "X-Auth": xAuth,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "action": "get_ids",
            "params": { "offset": offset, "limit": limit }
          })
        })
        const jsonData = await data.json();
        const filtredArray = arrayDuplicateFilter(jsonData.result);
        console.log(filtredArray)
        if (filtredArray.length < oldLimit) {
          requestItems(limit + 1);
        } else {
          console.log(limit)
          this.setState({
            ...this.getState(),
            params: {
              ...this.getState().params,
              offset: limit
            },
          });
          requestIds(filtredArray);

        }
      } catch (e) {
        requestItems(limit);
        console.log(e)
      }

    }
    await requestItems(limit);

  }

}


export default CatalogState;
