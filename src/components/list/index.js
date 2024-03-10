import {memo} from 'react';
import PropTypes from 'prop-types';
import './style.css';

function List({list, renderItem, page}) {
    if (page === 'sortedPage' && list.length === 0) {
      return (<h2 className='Nothing'>Ничего не найдено</h2>)
    }
      
    return (
      <div className='List'>{
        list.map(item =>
          <div key={item.id} className='List-item'>
            {renderItem(item)}
          </div>
        )}
      </div>
    )
    }


List.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })).isRequired,
  renderItem: PropTypes.func,
  page: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

List.defaultProps = {
  renderItem: (item) => {
  },
}

export default memo(List);
