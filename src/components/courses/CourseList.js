import React, {PropTypes} from 'react';
import CourseListRow from './CourseListRow';

const CourseList = ({courses, deleteCourse}) => {

  const numberOfCourses = courses.length;

  if(numberOfCourses > 0) {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Length</th>
          </tr>
        </thead>
        <tbody>
        {courses.map(course =>
          <CourseListRow
            key={course.id}
            course={course}
            onDelete={deleteCourse}/>)
        }
        </tbody>
      </table>
      );
  } else {
    return (
      <div>
        <h5>There are no courses. Click the link above to add one.</h5>
      </div>
    );
  }

};

CourseList.propTypes = {
  courses: PropTypes.array.isRequired,
  deleteCourse: PropTypes.func.isRequired
};

export default CourseList;
