import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {formatAuthorName} from '../../selectors/authorFormatter';

const AuthorListRow = ({author, disable, courseCount, onDelete}) => {
  return (
    <tr>
      <td><Link to={'/author/' + author.id}>{author.id}</Link></td>
      <td>{formatAuthorName(author)}</td>
      <td>{courseCount}</td>
      <td>
        <input
          type="submit"
          disabled={disable}
          value="Delete"
          className="btn btn-danger btn-sm"
          onClick={onDelete} />
      </td>
    </tr>
  );
};

AuthorListRow.propTypes = {
  author: PropTypes.object.isRequired,
  disable: PropTypes.bool.isRequired,
  courseCount: PropTypes.number.isRequired,
  onDelete: PropTypes.func
};

export default AuthorListRow;
