import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as courseActions from '../../actions/courseActions';
import CourseList from './CourseList';
import {browserHistory} from 'react-router';
import toastr from "toastr";

class CoursesPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.deleteCourse = this.deleteCourse.bind(this);
    this.displaySuccessMessage = this.displaySuccessMessage.bind(this);
    this.redirectToAddCoursePage = this.redirectToAddCoursePage.bind(this);
  }

  deleteCourse(event, course){
    event.preventDefault();

    this.setState({saving: true});

    this.props.actions.deleteCourse(course)
      .then(() => this.displaySuccessMessage(course.title))
      .catch(error => {
        toastr.error(error);
        this.setState({saving: false});
      });
  }

  displaySuccessMessage(authorName) {
    toastr.success(`${authorName} deleted!`);
    this.setState({saving: false});
  }

  courseRow(course, index) {
    return <div key={index}>{course.title}</div>;
  }

  redirectToAddCoursePage() {
    browserHistory.push('/course');
  }

  render() {
    const {courses} = this.props;
    return (
      <div>
        <h1>Courses</h1>
        <input type="submit"
               value="Add Course"
               className="btn btn-primary"
               onClick={this.redirectToAddCoursePage}
        />
        <CourseList
          courses={courses}
          deleteCourse={this.deleteCourse}/>
      </div>
    );
  }
}

CoursesPage.propTypes = {
  courses: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    courses: state.courses
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(courseActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
