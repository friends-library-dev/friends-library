import React from 'react';

interface Props {
  id: string;
}

const ErrorMsg: React.FC<Props> = ({ id }) => {
  return <h1>ErrorMsg: {id}</h1>;
};

export default ErrorMsg;

// const USER_ERRORS = ['shipping_not_possible'];
