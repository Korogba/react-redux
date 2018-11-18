import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {authorsFormattedForDropdown} from '../../selectors/selectors';
import * as courseActions from '../../actions/courseActions';
import CourseForm from './CourseForm';
import Page404 from '../common/Page404';
import toastr from 'toastr';

export class ManageCoursePage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      course: Object.assign({}, this.props.course),
      errors: {},
      saving: false,
      isDirty: false
    };

    this.saveCourse = this.saveCourse.bind(this);
    this.updateCourseState = this.updateCourseState.bind(this);
  }

  componentDidMount() {
    this.context.router.setRouteLeaveHook(this.props.route, () => {
      if(this.state.isDirty) {
        return 'You have unsaved changes. Do you still want to leave?';
      }
      return true;
    });
  }

  componentWillReceiveProps(nextProps) {
    if(!this.props.isCourseValid){
      return;
    }
    if (this.props.course.id !== nextProps.course.id) {
      // Necessary to populate form when existing course is loaded directly.
      this.setState({course: Object.assign({}, nextProps.course)});
    }
  }

  updateCourseState(event) {
    const field = event.target.name;
    let course = Object.assign({}, this.state.course);
    course[field] = event.target.value;
    return this.setState({
      course: course,
      isDirty: true
    });
  }

  courseFormIsValid() {
    let formIsValid = true;
    let errors = {};

    if (this.state.course.title.length < 5) {
      errors.title = 'Title must be at least 5 characters.';
      formIsValid = false;
    }

    if (this.state.course.category.length <= 0) {
      errors.category = 'Category must not be empty.';
      formIsValid = false;
    }

    const validDurationFormat = /^[0-9]?[0-9]:[0-9]?[0-9]$/;
    if (!validDurationFormat.test(this.state.course.length)) {
      errors.length = 'Length must have the format "--:--" where "-" represents a number.';
      formIsValid = false;
    }

    this.setState({errors: errors});
    return formIsValid;
  }

  saveCourse(event) {
    event.preventDefault();

    if (!this.courseFormIsValid()) {
      return;
    }

    this.setState({
      saving: true,
      isDirty: false
    });

    this.props.actions.saveCourse(this.state.course)
      .then(() => this.redirect())
      .catch(error => {
        toastr.error(error);
        this.setState({saving: false});
      });
  }

  redirect() {
    this.setState({saving: false});
    toastr.success('Course saved.');
    this.context.router.push('/courses');
  }

  render(){
    if(this.props.isCourseValid) {
      return(
        <CourseForm
          course={this.state.course}
          onChange={this.updateCourseState}
          onSave={this.saveCourse}
          errors={this.state.errors}
          allAuthors={this.props.authors}
          saving={this.state.saving} />
      );
    } else {
      return (
        <Page404 />
      );
    }
  }
}

ManageCoursePage.propTypes = {
  course: PropTypes.object.isRequired,
  authors: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  isCourseValid: PropTypes.bool.isRequired
};

//Pull in the React Router context so router is available on this.context.router.
ManageCoursePage.contextTypes = {
  router: PropTypes.object
};

function getCourseById(courses, courseId) {
  const course = courses.filter(course => course.id === courseId);
  if (course.length) return course[0]; //since filter returns an array, have to grab the first.
  return null;
}

function mapStateToProps(state, ownProps) {
  const courseId = ownProps.params.id; // from the path `course/:id`
  let isCourseValid = true;

  let course = {id: '', watchHref: '', title: '', authorId: '', length: '', category: ''};

  if(courseId && state.courses.length > 0) {
    course = getCourseById(state.courses, courseId);

    if(!course) {
      isCourseValid = false;
      course = {id: '', watchHref: '', title: '', authorId: '', length: '', category: ''};
    }
  }

  return {
    course: course,
    isCourseValid: isCourseValid,
    authors: authorsFormattedForDropdown(state.authors)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(courseActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);
