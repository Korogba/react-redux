import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as authorActions from '../../actions/authorActions';
import {browserHistory} from 'react-router';
import AuthorList from "./AuthorList";
import toastr from "toastr";
import {formatAuthorName} from '../../selectors/authorFormatter';

class AuthorsPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.deleteAuthor = this.deleteAuthor.bind(this);
    this.redirectToAddAuthorPage = this.redirectToAddAuthorPage.bind(this);
    this.displaySuccessMessage = this.displaySuccessMessage.bind(this);
  }

  redirectToAddAuthorPage() {
    browserHistory.push('/author');
  }

  deleteAuthor(event, author){
    event.preventDefault();
    const authorName = formatAuthorName(author);

    this.setState({saving: true});

    this.props.actions.deleteAuthor(author)
      .then(() => this.displaySuccessMessage(authorName))
      .catch(error => {
        toastr.error(error);
        this.setState({saving: false});
      });
  }

  displaySuccessMessage(authorName) {
    toastr.success(`${authorName} deleted!`);
    this.setState({saving: false});
  }

  render() {
    const {authors, courses} = this.props;
    return (
      <div>
        <h1>Authors</h1>
        <input type="submit"
               value="Add Author"
               className="btn btn-primary"
               onClick={this.redirectToAddAuthorPage} />
        <AuthorList
          authors={authors}
          courses={courses}
          deleteAuthor={this.deleteAuthor} />
      </div>
    );
  }

}

AuthorsPage.propTypes = {
  authors: PropTypes.array.isRequired,
  courses: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    authors: state.authors,
    courses: state.courses
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(authorActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthorsPage);
