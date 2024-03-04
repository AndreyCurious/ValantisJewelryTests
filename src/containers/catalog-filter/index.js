import { memo, useCallback, useMemo } from 'react';
import useStore from '../../hooks/use-store';
import useSelector from '../../hooks/use-selector';
import Select from '../../components/select';
import Input from '../../components/input';
import SideLayout from '../../components/side-layout';
import Spinner from '../../components/spinner';

function CatalogFilter() {

  const store = useStore();

  const select = useSelector(state => ({
    query: state.catalog.params.query,
    sort: state.catalog.params.sort,
    waiting: state.catalog.waiting
  }));

  const callbacks = {
    onCategory: useCallback(category => store.actions.catalog.changeCategory(category), [store]),
    onSetList: useCallback(() => store.actions.catalog.setList(), [store]),
    onQuery: useCallback((query) => store.actions.catalog.changeQuery(query), [store])
  };

  const categories = ["---", "Бренд", "Цена", "Название"]

  return (
    <SideLayout padding='medium'>
      <Select options={categories} value={select.category} onChange={callbacks.onCategory} />
      <Input typeSort={select.sort} value={select.query} onChange={callbacks.onQuery} placeholder={'Поиск'}
      />
      <button disabled={(select.query === '' || select.sort === '---') || select.waiting === true} onClick={callbacks.onSetList}>Найти</button>
    </SideLayout>
  )
}

export default memo(CatalogFilter);
