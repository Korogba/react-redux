import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as authorActions from '../../actions/authorActions';
import AuthorForm from './AuthorForm';
import toastr from 'toastr';

export class ManageAuthorPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      author: Object.assign({}, this.props.author),
      errors: {},
      saving: false,
      isDirty: false
    };

    this.saveAuthor = this.saveAuthor.bind(this);
    this.updateAuthorState = this.updateAuthorState.bind(this);
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
    if (this.props.author.id !== nextProps.author.id) {
      // Necessary to populate form when existing author is loaded directly.
      this.setState({author: Object.assign({}, nextProps.author)});
    }
  }

  updateAuthorState(event) {
    const field = event.target.name;
    let author = Object.assign({}, this.state.author);
    author[field] = event.target.value;
    return this.setState({
      author: author,
      isDirty: true
    });
  }

  authorFormIsValid() {
    let formIsValid = true;
    let errors = {};

    if (this.state.author.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters.';
      formIsValid = false;
    }

    if (this.state.author.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters.';
      formIsValid = false;
    }

    this.setState({errors: errors});
    return formIsValid;
  }

  saveAuthor(event) {
    event.preventDefault();

    if (!this.authorFormIsValid()) {
      return;
    }

    this.setState({
      saving: true,
      isDirty: false
    });

    this.props.actions.saveAuthor(this.state.author)
      .then(() => this.redirect())
      .catch(error => {
        toastr.error(error);
        this.setState({saving: false});
      });
  }

  redirect() {
    this.setState({saving: false});
    toastr.success('Author saved.');
    this.context.router.push('/authors');
  }

  render(){
    return(
      <AuthorForm
        author={this.state.author}
        onSave={this.saveAuthor}
        onChange={this.updateAuthorState}
        errors={this.state.errors}
        saving={this.state.saving} />
    );
  }
}

ManageAuthorPage.propTypes = {
  author: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

//Pull in the React Router context so router is available on this.context.router.
ManageAuthorPage.contextTypes = {
  router: PropTypes.object
};

function getAuthorById(authors, authorId) {
  const author = authors.filter(author => author.id === authorId);
  if (author.length) return author[0]; //since filter returns an array, have to grab the first.
  return null;
}

function mapStateToProps(state, ownProps) {
  const authorId = ownProps.params.id; // from the path `course/:id`

  let author = {id: '', firstName: '', lastName: ''};

  if(authorId && state.authors.length > 0) {
    author = getAuthorById(state.authors, authorId);
  }

  return {
    author: author
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(authorActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageAuthorPage);
