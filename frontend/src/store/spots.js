import { csrfFetch } from './csrf.js';

/**
 * @import { User } from './session.js'
 */

/**
 * @typedef { Object } SpotImage
 * @property { number } [id] The ID of the SpotImage
 * @property { number } spotId The ID of the Spot this image is attached to
 * @property { string } url The URL of the image file
 * @property { boolean } preview Whether the image should be used as the preview for its Spot
 */

/**
 * @typedef { Object } Spot
 * @property { number } [id] The ID of the Spot
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
 * @property { number } [numReviews] The number of Reviews attached to the Spot
 * @property { number } [avgRating] The average star rating of the spot
 * @property { string } [previewImage] The URL for the preview image assigned to the spot
 * @property { SpotImage[] } [SpotImages] Array containing all images attached to the Spot
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
    delete collection[spot.id].numReviews;
    delete collection[spot.id].avgRating;
    return collection;
  }, {});
}

/**
 * Removes the `numReviews` and `avgRating` properties from a Spot and returns the Spot
 * @param { Spot } spot
 * @returns { Spot }
 */
const stripSpot = (spot) => {
  delete spot.numReviews;
  delete spot.avgRating;

  return spot;
}

const GET_ALL_SPOTS = 'spots/getAllSpots';
const GET_SPOT_DETAILS = 'spots/getSpotDetails';
const GET_USER_SPOTS = 'spots/getUserSpots';

const CREATE_SPOT = 'spots/createSpot';
const CREATE_SPOT_IMAGE = 'spots/createSpotImage';

const DELETE_SPOT = 'spots/deleteSpot';
const DELETE_SPOT_IMAGE = 'spots/deleteSpotImage';

const UPDATE_SPOT = 'spots/updateSpot';
const UPDATE_SPOT_IMAGE = 'spots/updateSpotImage';

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
 * Add all the current user's Spots to the state
 * @param { Spot[] } spots
 * @returns {{ type: string, spots: Spot[] }}
 */
export const getUserSpots = (spots) => {
  return {
    type: GET_USER_SPOTS,
    spots: normalizeSpots(spots),
  };
};

/**
 * Add a new Spot to the state
 * @param { Spot } spot The created Spot, returned from the backend
 * @returns {{ type: string, spot: Spot }}
 */
export const createSpot = (spot) => {
  return {
    type: CREATE_SPOT,
    spot,
  };
};

/**
 * Add a new SpotImage to a Spot in the state
 * @param { SpotImage } img The created SpotImage, returned from the backend
 * @returns {{ type: string, img: SpotImage }}
 */
export const createSpotImage = (img) => {
  return {
    type: CREATE_SPOT_IMAGE,
    img,
  };
};

/**
 * Remove a Spot from the state
 * @param { number } id
 * @returns {{ type: string, id: number }}
 */
export const deleteSpot = (id) => {
  return {
    type: DELETE_SPOT,
    id,
  };
};

/**
 * Update a Spot in the state
 * @param { Spot } spot The updated spot
 */
export const updateSpot = (spot) => {
  return {
    type: UPDATE_SPOT,
    spot,
  };
};

/**
 * Update a SpotImage in the state
 * @param { SpotImage } image The updated image
 */
export const updateSpotImage = (image) => {
  return {
    type: UPDATE_SPOT_IMAGE,
    image,
  };
};

/**
 * Remove a SpotImage from the state
 * @param { SpotImage } image The image to remove
 */
export const deleteSpotImage = (image) => {
  return {
    type: DELETE_SPOT_IMAGE,
    image,
  };
};

/**
 * Send a request to the GET /spots endpoint and return the spots as an array
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
 * Send a request to the GET /spots/current endpoint and return the spots as an array
 */
export const getUserSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/current`);

  if (res.ok) {
    const body = await res.json();

    dispatch(getUserSpots(body.Spots));

    return body.Spots;
  }

  return res.json();
}

/**
 * Send a request to the POST /spots endpoint and return the new Spot
 * (or the errors, if present)
 * @param { Spot } spot
 */
export const createSpotThunk = (spot) => async (dispatch) => {
  const res = await csrfFetch('/api/spots', {
    method: 'POST',
    body: JSON.stringify(spot),
  });

  const body = await res.json();

  if (body.errors) return body;

  dispatch(createSpot(body));

  return body;
}

/**
 * Send a request to the POST /spots/:spotId/images endpoint and return the new SpotImage
 * @param { SpotImage } img The image to create
 */
export const createSpotImageThunk = (img) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${img.spotId}/images`, {
    method: 'POST',
    body: JSON.stringify(img),
  });

  const body = await res.json();

  if (body.errors) return body;

  dispatch(createSpotImage(body));

  return body;
}

/**
 * Send a request to the DELETE /spots/:spotId endpoint and return the success message/errors
 * @param { number } id The ID of the Spot to delete
 */
export const deleteSpotThunk = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${id}`, {
    method: 'DELETE',
  });

  if (res.status >= 400) {
    return await res.json();
  }

  dispatch(deleteSpot(id));

  return await res.json();
}

/**
 * Send a request to the PUT /spots/:spotId route and return the updated Spot
 * @param { Spot } spot The updated spot to persist to the DB
 */
export const updateSpotThunk = (spot) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spot.id}`, {
    method: 'PUT',
    body: JSON.stringify(spot),
  });

  const body = await res.json();

  if (res.status >= 400) return body;

  dispatch(updateSpot(body));

  return body;
}

/**
 * Send a request to the PUT /spot-images/:imageId endpoint and return the updated SpotImage
 * @param { SpotImage } image
 */
export const updateSpotImageThunk = (image) => async (dispatch) => {
  const res = await csrfFetch(`/api/spot-images/${image.id}`, {
    method: 'PUT',
    body: JSON.stringify(image),
  });

  const body = await res.json();

  if (res.status >= 400) return body;

  dispatch(updateSpotImage(body));

  return body;
}

/**
 * Send a request to the DELETE /spot-images/:imageId endpoint and return the success/errors
 * @param { SpotImage } image The SpotImage to delete
 */
export const deleteSpotImageThunk = (image) => async (dispatch) => {
  const res = await csrfFetch(`/api/spot-images/${image.id}`, {
    method: 'DELETE',
  });

  const body = await res.json();

  if (res.status >= 400) return body;

  dispatch(deleteSpotImage(image.id));

  return body;
}

/**
 * @param { SpotCollection } state
 * @returns { SpotCollection }
 */
const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS:
    case GET_USER_SPOTS:
      return { ...state, ...action.spots };
    case GET_SPOT_DETAILS:
      return {
        ...state,
        [action.spot.id]: {
          ...state[action.spot.id],
          ...stripSpot(action.spot),
        },
      };
    case CREATE_SPOT:
    case UPDATE_SPOT:
      return {
        ...state,
        [action.spot.id]: {
          ...stripSpot(action.spot),
        },
      };
    case CREATE_SPOT_IMAGE:
      return {
        ...state,
        [action.img.spotId]: {
          ...state[action.img.spotId],
          SpotImages: [
            ...state[action.img.spotId]?.SpotImages ?? [],
            action.img,
          ],
        },
      };
    case DELETE_SPOT:
      return Object.fromEntries(
        Object.entries(state).filter(([id]) => id != action.id)
      );
    case UPDATE_SPOT_IMAGE:
      return {
        ...state,
        [action.image.spotId]: {
          ...state[action.image.spotId],
          SpotImages: [
            ...state[action.image.spotId]
              ?.SpotImages ?? []
                .filter((i) => i.id !== action.image.id),
            action.image,
          ],
        },
      };
    case DELETE_SPOT_IMAGE:
      return {
        ...state,
        [action.image.spotId]: {
          ...state[action.image.spotId],
          SpotImages: [
            ...(state[action.image.spotId]
              ?.SpotImages ?? [])
              .filter((i) => i.id !== action.image.id),
          ],
        },
      };
    default:
      return state;
  }
};

export default spotsReducer;
