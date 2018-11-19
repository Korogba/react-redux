import React, {PropTypes} from 'react';
import PaginationButton from './PaginationButton';

const Pagination =({count, active, onClick}) => {

  let buttons = [];
  for(let i = 0; i < count; i++) {
    buttons.push(
      <PaginationButton
        key={i + 1}
        active={(i + 1) === active}
        number={i + 1}
        onClick={onClick}
      />
    );
  }

  return (
  <div className="row">
      <div className="col-md-6 col-md-offset-5">
        <div className="btn-group center-block" role="toolbar" aria-label="Page Numbers">
          {buttons}
        </div>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  count: PropTypes.number.isRequired,
  active: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
};

export default Pagination;
