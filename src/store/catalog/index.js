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
        limit: 2,
        sort: '---',
        sorts: {
          'Цена': "price",
          "Бренд": "brand",
          "Название": "product"
        },
        query: '',
        decrement: false,
        offset: 0
      },
      count: 0,
      waiting: false
    }
  }
  changeCategory(category) {
    this.setState({
      ...this.getState(),
      params: {
        ...this.getState().params,
        sort: category,
      }
    });
  }
  changeQuery(string) {
    this.setState({
      ...this.getState(),
      params: {
        ...this.getState().params,
        query: string
      }
    });
  }
  changePage(page) {
    if (page === 1) {
      this.setState({
        ...this.getState(),
        offsets: [0],
        params: {
          ...this.getState().params,
          offset: 0,
          page: 1,
        },
      });
    } else {
      if (this.getState().params.page < page) {
        this.setState({
          ...this.getState(),
          params: {
            ...this.getState().params,
            decrement: false
          }
        });
      } else {
        this.setState({
          ...this.getState(),
          params: {
            ...this.getState().params,
            decrement: true
          }
        });
        this.setState({
          ...this.getState(),
          offsets: [0, ...this.getState().offsets.slice(1, -2)],
          params: {
            ...this.getState().params,
            offset: this.getState().offsets.slice(0, page).reduce((acc, number) => acc + number, 0),
            page: page,
          },
        });
      }


    }
    this.setState({
      ...this.getState(),
      params: {
        ...this.getState().params,
        page: page,
      }
    });
  }

  async setList() {
    const { decrement, page, limit, offset, sort, query } = this.getState().params;
    const password = 'Valantis';
    const today = new Date().toISOString().slice(0, 10).split('-').join('');
    const xAuth = md5(`${password}_${today}`);
    // почему то на vercel не перезаписывает запрос на прокси, хотя конфиг я написал - vercel.json (выдает 405 ошибку), 
    // так бы можно было использовать сокращенный url для запроса - "/"
    // в вебпаке прокси работает нормально
    const requestSort = async (sort, query) => {
      // не понимаю, почему не сделали в методе фильтр параметры на limit и offset, чтобы точно также постранично делать запросы, как с обычным выводом товара
      // я вывел все фильтрованные товары на одну страницу
      // можно было бы сделать постранично, записывая все товары в лист и разбивая этот массив на лимит, но мне кажется это неправильной практикой
      try {
        const param = this.getState().params.sorts[sort];
        const getItems = await fetch('https://api.valantis.store:41000/', {
          method: "POST",
          headers: {
            "X-Auth": xAuth,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "action": "filter",
            "params": { [param]: param === "price" ? Number(query) : String(query) }
          })
        })
        const getItemsJson = await getItems.json();
        const filtredArray = arrayDuplicateFilter(getItemsJson.result, 'id');
        await requestIds(filtredArray);
      } catch (e) {
        console.log(e);
        await requestSort(sort, query)
      }
    }
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
        await requestIds(filtredArray);
      }
    }
    const oldLimit = limit;
    const requestItems = async (limit) => {
      if (decrement) {

      }
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
          await requestItems(limit + 1);
        } else {
          if (!decrement || page === 1) {
            this.setState({
              ...this.getState(),
              offsets: [...this.getState().offsets, limit],
            });
            this.setState({
              ...this.getState(),
              params: {
                ...this.getState().params,
                offset: this.getState().offsets.slice(0, page + 1).reduce((acc, number) => acc + number, 0)
              },
            });
          }

          console.log(this.getState().params)
          console.log(this.getState().offsets)
          await requestIds(filtredArray);

        }
      } catch (e) {
        await requestItems(limit)
        console.log(e)
      }
    }
    this.setState({
      ...this.getState(),
      waiting: true
    });
    if (sort === '---' && query === "") {
      await requestItems(limit);
    } else {
      await requestSort(sort, query)
    }
  }
}


export default CatalogState;
