import { csrfFetch } from './csrf.js';

/**
 * @typedef { Object } Spot
 * @property { number } ownerId The ID of the spot's owner
 * @property { string } address The address of the spot
 * @property { string } city The city in which the spot is located
 * @property { string } state The state in which the spot is located
 * @property { string } country The country in which the spot is located
 * @property { number } lat The latitude of the spot
 * @property { number } lng The longitude of the spot
 * @property { string } name The name of the spot
 * @property { string } description The description for the spot
 * @property { number } price The price of the spot
 * @property { number } avgRating The average star rating of the spot
 * @property { string } previewImage The URL for the preview image assigned to the spot
 */

/**
 * An object containing many Spots keyed by their IDs
 * @typedef { Object<string, Spot> } SpotCollection
 */

/**
 * Normalizes an array of Spots to an object keyed by id
 * @param { Spot[] } spots An array of Spot objects
 * @returns { SpotCollection }
 */
const normalizeSpots = (spots) => {
  return spots.reduce((collection, spot) => {
    collection[spot.id] = spot;
    return collection;
  }, {});
}

const GET_ALL_SPOTS = 'spots/getAllSpots';

/**
 * Get all spots
 * @param { Spot[] } spots
 * @returns {{ type: string }}
 */
export const getAllSpots = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    spots: normalizeSpots(spots),
  };
};

/**
 * Send a request to the GET /spots endpoint and return the spots as an array
 * @returns { Spot[] }
 */
export const getAllSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch('/api/spots');

  if (res.ok) {
    const spots = (await res.json()).Spots;
    dispatch(getAllSpots(spots));

    return spots;
  }
}

/**
 * @param { SpotCollection } state
 * @returns { SpotCollection }
 */
const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS:
      return { ...state, ...action.spots }
    default:
      return state;
  }
};

export default spotsReducer;
