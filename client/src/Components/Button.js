import React from 'react';
import { Link } from 'react-router-dom';

const Button = (props) => (
    <Link to={props.action}>
      <button className={props.className} onClick={props.onClick} >
        {props.value}
      </button>
    </Link>
)

export default Button;
