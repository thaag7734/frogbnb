import { createSelector } from 'reselect';
import { csrfFetch } from './csrf';

/**
 * @typedef {{ id: number, url: string }} ReviewImage
 */

/**
 * @typedef { Object } Review
 * @property { number } [id] The ID of the review
 * @property { number } spotId The ID of the spot
 * @property { number } userId The ID of the user who created the review
 * @property { string } review The review text
 * @property { number } stars The star rating on the review
 * @property { string } createdAt The ISO 8601 datetime at which the review was created
 * @property { string } updatedAt The ISO 8601 datetime at which the review was last updated
 * @property { User } User The user who created the review
 * @property { ReviewImage[] } ReviewImages Array containing all images attached to the review
 */

const GET_SPOT_REVIEWS = 'reviews/getSpotReviews';
const GET_USER_REVIEWS = 'reviews/getUserReviews';
const CREATE_REVIEW = 'reviews/createReview';
const DELETE_REVIEW = 'reviews/deleteReview';
const UPDATE_REVIEW = 'reviews/updateReview';

/**
 * Normalizes an array of Reviews to an object keyed by id
 * @param { Review[] } reviews An array of Review objects
 * @returns { ReviewCollection }
 */
const normalizeReviews = (reviews) => {
  return reviews.reduce((collection, review) => {
    collection[review.id] = review;

    delete collection[review.id].numReviews;
    delete collection[review.id].avgRating;

    return collection;
  }, {});
}

/**
 * Add an array of Reviews to the state
 * @param { Review[] } reviews Array of reviews to add to the state
 * @returns {{ type: string, reviews: Review[] }}
 */
export const getSpotReviews = (reviews) => {
  return {
    type: GET_SPOT_REVIEWS,
    reviews: normalizeReviews(reviews),
  };
};

/**
 * Add an array of Reviews to the state
 * @param { Review[] } reviews Array of reviews to add to the state
 * @returns {{ type: string, reviews: Review[] }}
 */
export const getUserReviews = (reviews) => {
  return {
    type: GET_USER_REVIEWS,
    reviews: normalizeReviews(reviews),
  };
};

/**
 * Add a Review to the state
 * @param { Review } review The Review object to add to the Spot
 * @returns {{ type: string, spotId: number, review: Review }}
 */
export const createReview = (review) => {
  return {
    type: CREATE_REVIEW,
    review,
  };
};

/**
 * Update a Review in the state
 * @param { Review } review The Review object to update
 * @returns {{ type: string, review: Review }}
 */
export const updateReview = (review) => {
  return {
    type: UPDATE_REVIEW,
    review,
  };
};

/**
 * Remove a review from the state
 * @param { Review } review The review to remove
 */
export const deleteReview = (review) => {
  return {
    type: DELETE_REVIEW,
    review,
  };
}

/**
 * Send a request to the GET /spots/:id/reviews endpoint and return the reviews
 * @param { number } id The Spot's ID
 */
export const getSpotReviewsThunk = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${id}/reviews`);

  if (res.ok) {
    const reviews = await res.json();
    dispatch(getSpotReviews(reviews?.Reviews));

    return reviews;
  }
};

/**
 * Send a request to the GET /reviews/current endpoint and return the reviews
 */
export const getUserReviewsThunk = () => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/current`);

  if (res.ok) {
    const reviews = await res.json();
    dispatch(getUserReviews(reviews?.Reviews));

    return reviews;
  }

  return await res.json();
}

/**
 * Send a request to the POST /spots/:spotId/reviews endpoint and return the review
 * @param { number } spotId The ID of the Spot to add the review to
 * @param { Review } review The Review object to be created
 */
export const createReviewThunk = (spotId, review) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(review),
  });

  const body = await res.json();

  if (body.errors) return body;

  console.log('body in thunk ===>', body);

  dispatch(createReview(body));

  return body;
}

/**
 * Send a request to the PUT /reviews/:reviewId endpoint and return the review
 * @param { Review } review The updated Review object to persist in the db
 */
export const updateReviewThunk = (review) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${review.id}`, {
    method: 'PUT',
    body: JSON.stringify(review),
  });

  if (res.ok) {
    const newReview = await res.json();
    dispatch(updateReview(newReview));

    return newReview;
  }

  return await res.json();
}

/**
 * Send a request to the DELETE /reviews/:reviewId endpoint and return the success message
 * or errors if present
 * @param { Review } review The review to be deleted
 */
export const deleteReviewThunk = (review) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${review.id}`, {
    method: 'DELETE',
  });

  if (res.status >= 400) {
    return await res.json();
  }

  dispatch(deleteReview(review));

  return await res.json();
}

export const allReviewsSelector = createSelector(
  [(state) => state.reviews],
  (reviews) => Object.values(reviews)
);

export const spotReviewsSelector = createSelector(
  [(state) => state.reviews, (_state, spotId) => spotId],
  // TODO refactor components so we can use a strict comparison here vv
  (reviews, spotId) => Object.values(reviews).filter((r) => r.spotId == spotId)
);

export const userReviewsSelector = createSelector(
  [(state) => state.reviews, (_state, userId) => userId],
  (reviews, userId) => {
    console.log('reviews ===>', reviews);
    console.log('userId ===>', userId);
    return Object.values(reviews).filter((r) => r.userId === userId)
  }
);

/**
 * @param { ReviewCollection } state
 * @returns { ReviewCollection }
 */
const reviewsReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_SPOT_REVIEWS:
    case GET_USER_REVIEWS:
      return { ...state, ...action.reviews };
    case CREATE_REVIEW:
    case UPDATE_REVIEW:
      return { ...state, [action.review.id]: action.review };
    case DELETE_REVIEW:
      delete state[action.review.id];
      return { ...state };
    default:
      return state;
  }
}

export default reviewsReducer;
