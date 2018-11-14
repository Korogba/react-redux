import AuthorApi from '../api/mockAuthorApi';
import * as types from './actionTypes';
import {ajaxCallError, beginAjaxCall} from "./ajaxStatusActions";

export function loadAuthorsSuccess(authors) {
  return { type: types.LOAD_AUTHORS_SUCCESS, authors};
}

export function createAuthorSuccess(author) {
  return {type: types.CREATE_AUTHOR_SUCCESS, author};
}

export function updateAuthorSuccess(author) {
  return {type: types.UPDATE_AUTHOR_SUCCESS, author};
}

export function deleteAuthorSuccess(author) {
  return {type: types.DELETE_AUTHOR_SUCCESS, author};
}

export function loadAuthors() {
  return function(dispatch){
    dispatch(beginAjaxCall());

    return AuthorApi.getAllAuthors().then(authors => {
      dispatch(loadAuthorsSuccess(authors));
    }).catch(error => {
      throw(error);
    });
  };
}

export function saveAuthor(author) {
  return function(dispatch, getState){
    dispatch(beginAjaxCall());

    return AuthorApi.saveAuthor(author).then(author => {
      author.id ? dispatch(updateAuthorSuccess(author)) : dispatch(createAuthorSuccess(author));
    }).catch(error => {
      dispatch(ajaxCallError(error));
      throw(error);
    });
  };
}

export function deleteAuthor(author) {
  return function(dispatch, getState){
    dispatch(beginAjaxCall());

    return AuthorApi.deleteAuthor(author.id).then(() => {
      dispatch(deleteAuthorSuccess(author));
    }).catch(error => {
      dispatch(ajaxCallError(error));
      throw(error);
    });
  };
}
