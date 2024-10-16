import { csrfFetch } from './csrf.js';

/**
 * @import { User } from './session.js'
 */

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
 * @typedef {{ id: number, url: string }} ReviewImage
 */

/**
 * @typedef { Object } Review
 * @property { number } id The ID of the review
 * @property { number } spotId The ID of the spot
 * @property { number } userId The ID of the user who created the review
 * @property { string } review The review text
 * @property { number } stars The star rating on the review
 * @property { string } createdAt The ISO 8601 datetime at which the review was created
 * @property { string } updatedAt The ISO 8601 datetime at which the review was last updated
 * @property { User } User The user who created the review
 * @property { ReviewImage[] } ReviewImages Array containing all images attached to the review
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
const GET_SPOT_DETAILS = 'spots/getSpotDetails';
const GET_SPOT_REVIEWS = 'spots/getSpotReviews';

/**
 * Add all spots to state
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
 * Add/update a Spot in the state
 * @param { Spot } spot The Spot to add/update
 * @returns {{ type: string, spot: Spot }}
 */
export const getSpotDetails = (spot) => {
  return {
    type: GET_SPOT_DETAILS,
    spot,
  };
};

/**
 * Add an array of Reviews to a Spot in the state
 * @param { number } spotId The ID of the Spot to add the reviews to
 * @param { Review[] } reviews Array of reviews to add to the Spot in the state
 */
export const getSpotReviews = (spotId, reviews) => {
  return {
    type: GET_SPOT_REVIEWS,
    spotId,
    reviews,
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
};

/**
 * Send a request to the GET /spots/:id endpoint and return the spot details
 * @param { number } id The Spot's ID
 * @returns { Spot }
 */
export const getSpotDetailsThunk = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${id}`);

  if (res.ok) {
    const spot = await res.json();
    dispatch(getSpotDetails(spot));

    return spot;
  }
};

/**
 * Send a request to the GET /spots/:id/reviews endpoint and return the reviews
 * @param { number } id The Spot's ID
 * @returns { Review[] }
 */
export const getSpotReviewsThunk = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${id}/reviews`);

  if (res.ok) {
    const reviews = await res.json();
    dispatch(getSpotReviews(id, reviews?.Reviews));

    return reviews;
  }
};

/**
 * @param { SpotCollection } state
 * @returns { SpotCollection }
 */
const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS:
      return { ...state, ...action.spots };
    case GET_SPOT_DETAILS:
      return {
        ...state,
        [action.spot.id]: {
          ...state[action.spot.id],
          ...action.spot,
        }
      };
    case GET_SPOT_REVIEWS:
      return {
        ...state,
        [action.spotId]: {
          ...state[action.spotId],
          reviews: action.reviews,
        }
      };
    default:
      return state;
  }
};

export default spotsReducer;
