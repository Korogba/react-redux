import React, {PropTypes} from 'react';
import AuthorListRow from "./AuthorListRow";
import {courseDetails} from '../../selectors/authorCourseDetails';

const AuthorList = ({authors, courses, deleteAuthor}) => {

  const numberOfAuthors = authors.length;

  if(numberOfAuthors > 0) {
    return (
      <table className="table">
        <thead>
        <tr>
          <th>ID</th>
          <th>Full Name</th>
          <th>Course Count</th>
        </tr>
        </thead>
        <tbody>
        {authors.map(author => {
          const details = courseDetails(author.id, courses);
          return (<AuthorListRow key={author.id}
                                 author={author}
                                 disable={details.disabled}
                                 onDelete={deleteAuthor}
                                 courseCount={details.courseCount}/>);
        })
        }
        </tbody>
      </table>
    );
  } else {
    return (
      <div>
        <h5>There are no authors. Click the link above to add one.</h5>
      </div>
    );
  }
};

AuthorList.propTypes = {
  authors: PropTypes.array.isRequired,
  courses: PropTypes.array.isRequired,
  deleteAuthor: PropTypes.func.isRequired
};

export default AuthorList;
