import StoreModule from '../module';
import md5 from 'md5';
import objectDuplicateFilter from '../../utils/object-duplicate-filter';
import arrayDuplicateFilter from '../../utils/array-dublicate-filter';

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
      offsets: [0],
      params: {
        page: 1,
        limit: 5,
        sort: 'order',
        query: '',
        offset: 0
      },
      count: 0,
      waiting: false
    }
  }

  async loadPage(page) {
    const { limit, offset } = this.getState().params
    this.setState({
      ...this.getState(),
      params: {
        ...this.getState().params,
        page: page
      },
      waiting: true
    });
    await this.setList(limit, offset)

  } 

  async setList(limit,offset) {
    const { page } = this.getState().params
    const password = 'Valantis';
    const today = new Date().toISOString().slice(0, 10).split('-').join('');
    const xAuth = md5(`${password}_${today}`);
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
          waiting: false
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
        if (filtredArray.length < oldLimit) {
          requestItems(limit + 1);
        } else {
          this.setState({
            ...this.getState(),
            params: {
              offsets: this.getState().offsets.push(limit),
              ...this.getState().params,
              offset: this.getState().offsets.slice(0, page).reduce((acc, number) => acc + number, 0)
            },
          });
          requestIds(filtredArray);

        }
      } catch (e) {
        requestItems(limit);
        console.log(e)
      }
    }

    requestItems(limit);
  }

  async loadProducts() {
    this.setState({
      ...this.getState(),
      waiting: true
    })
    const { limit, offset } = this.getState().params
    await this.setList(limit, offset);

  }

}


export default CatalogState;
