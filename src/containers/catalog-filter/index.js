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
    category: state.catalog.params.category,
    waiting: state.catalog.waiting
  }));

  const callbacks = {
    onCategory: useCallback(category => store.actions.catalog.changeCategory(category), [store]),
    onSetList: useCallback(() => store.actions.catalog.setList(), [store]),
    onQuery: useCallback((query) => store.actions.catalog.changeCategory(query),[store])
  };

  const categories = ["---", "Бренд", "Цена", "Название продукта"]

  return (
    <Spinner active={select.waiting}>
      <SideLayout padding='medium'>
      <Select options={categories} value={select.category} onChange={callbacks.onCategory} />
      <Input value={select.query} onChange={callbacks.onQuery} placeholder={'Поиск'}
      />
      <button disabled={} onClick={() => {}}>Найти</button>
    </SideLayout>
    </Spinner>
  )
}

export default memo(CatalogFilter);
