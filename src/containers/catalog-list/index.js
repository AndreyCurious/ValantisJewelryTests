import { memo, useCallback } from 'react';
import useStore from '../../hooks/use-store';
import useSelector from '../../hooks/use-selector';
import Item from '../../components/item';
import List from '../../components/list';
import Pagination from '../../components/pagination';
import Spinner from '../../components/spinner';
import useInit from '../../hooks/use-init';

function CatalogList() {
  const store = useStore();
  useInit(async () => {
    await Promise.all([
      store.actions.catalog.initParams(),
    ]);
  }, [], true);

  const select = useSelector(state => ({
    list: state.catalog.list,
    page: state.catalog.params.page,
    limit: state.catalog.params.limit,
    offset: state.catalog.params.offset,
    sort: state.catalog.params.sort,
    query: state.catalog.params.query,
    count: state.catalog.count,
    waiting: state.catalog.waiting,
  }));
  console.log(select)

  const callbacks = {
    // Пагинация
    onPaginate: useCallback(page => store.actions.catalog.setParams({ page }), [store]),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback((page) => {
      return `?${new URLSearchParams({
        page,
        limit: select.limit,
        sort: select.sort,
        query: select.query
      })}`;
    }, [select.limit, select.sort, select.query])
  }


  const renders = {
    item: useCallback(item => (
      <Item item={item} onAdd={callbacks.addToBasket} link={`/articles/${item._id}`} />
    ), [callbacks.addToBasket]),
  };

  return (
    <Spinner active={select.waiting}>
      <List list={select.list} renderItem={renders.item} />
      <Pagination count={select.count} page={select.page} limit={select.limit}
        onChange={callbacks.onPaginate} makeLink={callbacks.makePaginatorLink} />
    </Spinner>
  );
}

export default memo(CatalogList);
