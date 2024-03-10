import { memo } from 'react';
import PropTypes from 'prop-types';
import { cn as bem } from '@bem-react/classname';
import numberFormat from '../../utils/number-format';
import './style.css';

function Item(props) {

  const cn = bem('Item');

  return (
    <div className={cn()}>
      <div className={cn('title')}>
        <p>{props.item.id}</p>
        <p>Бренд: {props.item.brand !== null ? props.item.brand : 'Неизвестен'}</p>
        <p>{props.item.product}</p>
      </div>
      <div className={cn('actions')}>
        <div className={cn('price')}>{numberFormat(props.item.price)} {props.labelCurr}</div>
      </div>
    </div>
  );
}

Item.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.number
  }).isRequired,
};

Item.defaultProps = {
  labelCurr: '₽',
}

export default memo(Item);
