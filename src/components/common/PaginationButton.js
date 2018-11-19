import React, {PropTypes} from 'react';

const PaginationButton = ({number, onClick, active}) => {

  const handleClick = () => {
    onClick(number);
  };

  return (
    <button
      type="button"
      key={number}
      className= {active ? "btn btn-default active" : "btn btn-default"}
      onClick={handleClick}>
      {number}
    </button>
  );
};

PaginationButton.propTypes = {
  number: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired
};

export default PaginationButton;
