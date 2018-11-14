import React, {PropTypes} from 'react';
import {Link} from 'react-router';

const CourseListRow = ({course, onDelete}) => {

  const deleteAuthor = () => {
    onDelete(event, course);
  };

  return (
    <tr>
      <td><a href={course.watchHref} target="_blank">Watch</a></td>
      <td><Link to={'/course/' + course.id}>{course.title}</Link></td>
      <td>{course.authorId}</td>
      <td>{course.category}</td>
      <td>{course.length}</td>
      <td>
        <input
          type="submit"
          value="Delete"
          className="btn btn-danger btn-sm"
          onClick={deleteAuthor} />
      </td>
    </tr>
  );
};

CourseListRow.propTypes = {
  course: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default CourseListRow;
