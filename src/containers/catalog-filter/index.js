import { memo, useCallback, useMemo } from 'react';
import useStore from '../../hooks/use-store';
import useSelector from '../../hooks/use-selector';
import Select from '../../components/select';
import Input from '../../components/input';
import SideLayout from '../../components/side-layout';

function CatalogFilter() {

  const store = useStore();

  const select = useSelector(state => ({
    query: state.catalog.params.query,
    category: state.catalog.params.category,
  }));

  const callbacks = {
    onCategory: useCallback(category => store.actions.catalog.changeCategory(category), [store]),
  };

  const categories = ["---", "Бренд", "Цена", "Название продукта"]

  return (
    <SideLayout padding='medium'>
      <Select options={categories} value={select.category} onChange={callbacks.onCategory} />
      <Input value={select.query} onChange={callbacks.onSearch} placeholder={'Поиск'}
        delay={1000} />
      <button onClick={callbacks.onReset}>Найти</button>
    </SideLayout>
  )
}

export default memo(CatalogFilter);
