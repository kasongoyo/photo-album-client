/**
 * @file
 * @description API client file, it's an API layer to connect to the backend
 */

//  dependencies
import Axios from 'axios';
Axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8181';


/**
 * Axios public instance
 */
const axios = Axios.create({
    headers: {
        Accept: 'application/json',
    },
});

/**
 * Create new album
 * @param {Object} payload - Album data 
 */
export const createAlbum = payload =>
    axios.post('/albums', payload).then(response => response.data);

/**
 * Add photos in the album
 * @param {Object} payload - Photo  
 */
export const addPhotos = payload =>
    axios.post('/photos', payload).then(response => response.data);

/**
 * Retrieve albums 
 * @param {Object} params - Query string params 
 */
export const findAlbums = (params) =>
    axios.get('/albums', { params }).then(response => response.data);

/**
 * Retrieve album by Id
 * @param {string} albumId - album Id 
 */
export const findAlbumById = albumId =>
    axios.get(`/albums/${albumId}`).then(response => response.data);
/**
 * Retrieve photos
 * @param {Object} params - Query string params 
 */
export const findPhotos = (params) =>
    axios.get('/photos', { params }).then(response => response.data);

/**
 * Search photos using keyword
 * @param {object} params - query string params 
 */
export const searchPhotos = (params) =>
    axios.get('/photos/search', { params }).then(response => response.data);

/**
 * Search albums using keyword
 * @param {object} params - query string params 
 */
export const searchAlbums = params =>
    axios.get('/albums/search', { params }).then(response => response.data);
