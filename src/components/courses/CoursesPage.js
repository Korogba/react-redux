import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as courseActions from '../../actions/courseActions';
import CourseList from './CourseList';
import {browserHistory} from 'react-router';
import Pagination from '../common/Pagination';
import toastr from "toastr";

class CoursesPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      courses: [...this.props.courses.map(i => Object.assign({}, i))],
      activePage: 1
    };

    this.handlePagination =  this.handlePagination.bind(this);
    this.deleteCourse = this.deleteCourse.bind(this);
    this.displaySuccessMessage = this.displaySuccessMessage.bind(this);
    this.redirectToAddCoursePage = this.redirectToAddCoursePage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.courses.length !== nextProps.courses.length) {
      // Necessary to update courses
      this.setState({
        courses: [...this.props.courses.map(i => Object.assign({}, i))],
        pageCount: Math.ceil(this.props.courses.length/4)
    });
    }
  }

  handlePagination(number) {
    const start = (number - 1) * this.props.itemsPerPage;
    const end = Math.min((number) * this.props.itemsPerPage, this.props.allCourses.length);

    this.setState({
      activePage: number,
      courses: [...this.props.allCourses.slice(start, end)]
    });
  }

  deleteCourse(event, course){
    event.preventDefault();
    let start = (this.state.activePage - 1) * this.props.itemsPerPage;
    let end = Math.min((this.state.activePage) * this.props.itemsPerPage,
      this.props.allCourses.length);

    this.setState({saving: true});

    this.props.actions.deleteCourse(course)
      .then(() => {
        this.displaySuccessMessage(course.title);
        const courses = [...this.props.allCourses.slice(start, end)];
        if(courses.length <= 0 && this.state.activePage > 1){
          start = (this.state.activePage - 2) * this.props.itemsPerPage;
          end = Math.min((this.state.activePage - 1) * this.props.itemsPerPage,
            this.props.allCourses.length);
        }
        this.setState({
          saving: false,
          courses: [...this.props.allCourses.slice(start, end)]
        });
      })
      .catch(error => {
        toastr.error(error);
        this.setState({
          saving: false
        });
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
    const {allCourses, pageCount, itemsPerPage} = this.props;
    return (
      <div>
        <h1>Courses<small>: {allCourses.length}</small></h1>
        <input type="submit"
               value="Add Course"
               className="btn btn-primary"
               onClick={this.redirectToAddCoursePage}/>
        <CourseList
          courses={this.state.courses}
          deleteCourse={this.deleteCourse}/>
        {allCourses.length > itemsPerPage && pageCount > 0 ?
          <Pagination
            active={this.state.activePage}
            count={pageCount}
            onClick={this.handlePagination}/> :
          <span/>
        }
      </div>
    );
  }
}

CoursesPage.propTypes = {
  allCourses: PropTypes.array.isRequired,
  courses: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired
};

function mapStateToProps(state, ownProps) {
  const itemsPerPage = 4;
  const stop = Math.min(itemsPerPage, state.courses.length);
  let allCourses = [...state.courses].sort((i, j) => {
    return i.title.localeCompare(j.title);
  });

  return {
    allCourses: allCourses,
    courses: [...allCourses.slice(0, stop)],
    itemsPerPage: itemsPerPage,
    pageCount: Math.ceil(state.courses.length/itemsPerPage)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(courseActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
