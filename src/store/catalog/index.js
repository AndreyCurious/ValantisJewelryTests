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
    // в последствии params забиваются в строку url, чтобы при перезагрузке страницы вернуться к той же странице с товарами
    return {
      list: [],
      offsets: [0],
      params: {
        page: 1,
        limit: 50,
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
  resetFilter() {
    this.setState({
      ...this.getState(),
      offsets: [0],
      params: {
        ...this.getState().params,
        query: '',
        page: 1,
        offset: 0,
        sort: '---'
      }
    });
  }
  changePage(page) {
      if (this.getState().params.page < page) {
        this.setState({
          ...this.getState(),
          params: {
            ...this.getState().params,
            decrement: false,
            page: page,
          }
        });
      } else {
        this.setState({
          ...this.getState(),
          offsets: [0, ...this.getState().offsets.slice(1, -1)],
          params: {
            ...this.getState().params,
            decrement: true,
            offset: this.getState().offsets.slice(0, page).reduce((acc, number) => acc + number, 0),
            page: page,
          },
        });
      }
  }

  async setList() {
    // задача стояла выводить 50 продуктов
    // так как попадаются одинаковые id, я сделал так - если после фильтрации айтемов меньше 50, то запрос перевыполняется, добирая необходимое до лимита количество айтемов, след страницы будут выполнять запрос, учитвая, что кроме 50 айтемов с предыдущей страницы нужно оффсетнуть еще и повторяющиейся
    const { decrement, page, limit, offset, sort, query } = this.getState().params;
    const password = 'Valantis';
    const today = new Date().toISOString().slice(0, 10).split('-').join('');
    const xAuth = md5(`${password}_${today}`);
    // почему то на vercel не перезаписывает запрос на прокси, хотя конфиг я написал - vercel.json (выдает 405 ошибку), 
    // так бы можно было использовать url для запроса - "/"
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
    if (sort === '---' && query === "" ) {
      await requestItems(limit);
    } else {
      this.setState({
        ...this.getState(),
        params: {
          ...this.getState().params, 
          page: 'sortedPage'
        }
      })
      await requestSort(sort, query)
    }
  }
}


export default CatalogState;
