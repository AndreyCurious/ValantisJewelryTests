import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { cn as bem } from '@bem-react/classname';

import './style.css';

function Form(props) {
  const cn = bem('Form');
  return (
		<form className={cn()}>
			 {React.Children.map(props.children, (child) => (
        <div key={child.key} className={cn('item')}>{child}</div>
      ))}
			<button className={cn('btn')} disabled={(props.query === '' || props.sort === '---') || props.waiting === true} onClick={props.onSetList}>Найти</button>
			<button className={cn('btn')} onClick={() => props.onReset()} type='reset'>Сбросить</button>
		</form>
  )
}

Form.propTypes = {
  children: PropTypes.node,
  query: PropTypes.string,
  sort: PropTypes.string,
  wating: PropTypes.bool,
  onReset: PropTypes.func,
}

export default memo(Form);