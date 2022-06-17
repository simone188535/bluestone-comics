import axios from "axios";
import { configObjects } from "../utils/configObjects";

function createBookmark(bookId) {
  return axios.post(
    `/api/v1/bookmark/book/${bookId}/create`,
    {},
    configObjects()
  );
}

function getBookmark(bookId) {
  return axios.get(`/api/v1/bookmark/book/${bookId}`, configObjects());
}

function getAllBookmarks(subscriberId) {
  return axios.get(`/api/v1/bookmark/get-all/subscriber/${subscriberId}`);
}

function deleteBookmark(bookId) {
  return axios.delete(
    `/api/v1/bookmark/book/${bookId}/delete`,
    configObjects()
  );
}

export { createBookmark, getBookmark, getAllBookmarks, deleteBookmark };
