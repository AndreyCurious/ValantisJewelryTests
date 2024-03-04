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
  useInit(async () => {
    await Promise.all([
      store.actions.catalog.setList(),
    ]);
  }, [select.page], true);

  const callbacks = {
    // Пагинация
    onPaginate: useCallback((page) => store.actions.catalog.changePage(page), [store]),
  }


  const renders = {
    item: useCallback(item => (
      <Item item={item} />
    )),
  };

  return (
    <Spinner active={select.waiting}>
      <List list={select.list} renderItem={renders.item} />
      <Pagination count={select.count} page={select.page} limit={select.limit}
        onChange={callbacks.onPaginate} />
    </Spinner>
  );
}

export default memo(CatalogList);
