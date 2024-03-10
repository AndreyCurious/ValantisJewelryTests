import { memo, useCallback } from 'react';
import useStore from '../../hooks/use-store';
import useSelector from '../../hooks/use-selector';
import Select from '../../components/select';
import Input from '../../components/input';
import SideLayout from '../../components/side-layout';
import Form from '../../components/form';

function CatalogFilter() {

  const store = useStore();

  const select = useSelector(state => ({
    query: state.catalog.params.query,
    sort: state.catalog.params.sort,
    waiting: state.catalog.waiting,
    page: state.catalog.params.page
  }));

  const callbacks = {
    onCategory: useCallback(category => store.actions.catalog.changeCategory(category), [store]),
    onSetList: useCallback(() => store.actions.catalog.setList(), [store]),
    onQuery: useCallback((query) => store.actions.catalog.changeQuery(query), [store]),
    onResetFilters: useCallback(() => store.actions.catalog.resetFilter(), [store])
  };

  const categories = ["---", "Бренд", "Цена", "Название"]

  return (
    <SideLayout padding='medium'>
      <Form onReset={callbacks.onResetFilters} query={select.query} sort={select.sort} waiting={select.waiting} onSetList={callbacks.onSetList}>
        <Select options={categories} value={select.category} onChange={callbacks.onCategory} />
        <Input typeSort={select.sort} value={select.query} onChange={callbacks.onQuery} placeholder={'Поиск'}
      />
      </Form>
    </SideLayout>
  )
}

export default memo(CatalogFilter);
