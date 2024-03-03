import { memo } from 'react';
import PropTypes from 'prop-types';
import './style.css';

function Select(props) {
  const onSelect = (e) => {
    props.onChange(e.target.value);
  };

  return (
    <select className='Select' value={props.value} onChange={onSelect}>
      {props.options.map((item, index) => (
        <option key={index} value={item}>{item}</option>
      ))}
    </select>
  )
}

Select.propTypes = {
  options: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func
};

Select.defaultProps = {
  onChange: () => {
  }
}

export default memo(Select);
