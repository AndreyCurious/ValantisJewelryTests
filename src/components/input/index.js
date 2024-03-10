import { memo, useCallback, useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { cn as bem } from '@bem-react/classname';

import './style.css';

function Input(props) {
  const [value, setValue] = useState(props.value);


  // Обработчик изменений в поле
  const onChange = (event) => {
    setValue(event.target.value.trim());
    props.onChange(event.target.value.trim());
  };

  // Обновление стейта, если передан новый value
  useLayoutEffect(() => setValue(props.value), [props.value]);

  const cn = bem('Input');

  return (
    <input
      className={cn()}
      value={value}
      type={props.typeSort === 'Цена' ? 'number' : 'text'}
      placeholder={props.placeholder}
      onChange={onChange}
    />
  )
}

Input.propTypes = {
  value: PropTypes.string,
  typeSort: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
}

export default memo(Input);
