import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import './SpotDetails.css';
import { useState, useEffect } from "react";
import { getSpotDetailsThunk } from "../../store/spots";
import { FaStar } from "react-icons/fa";
import '../../vlib/proto/date.js';
import '../../vlib/proto/number.js';
import ReviewFormModal from "../ReviewFormModal/ReviewFormModal.jsx";
import OpenModalButton from "../OpenModalButton/OpenModalButton.jsx";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal.jsx";
import { getSpotReviewsThunk, getUserReviewsThunk, spotReviewsSelector, userReviewsSelector } from "../../store/reviews.js";

function SpotDetails() {
  const { id } = useParams();
  const [spotLoaded, setSpotLoaded] = useState(false);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const user = useSelector(state => state.session.user);
  const [preview, setPreview] = useState(null);
  const spot = useSelector(state => state.spots[id]);
  const reviews = useSelector(state => spotReviewsSelector(state, id));
  const userReviews = useSelector(state => userReviewsSelector(state, user?.id))
  const session = useSelector(state => state.session);
  const [displayRating, setDisplayRating] = useState(null);
  const [displayReviews, setDisplayReviews] = useState('- reviews');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSpotDetailsThunk(id)).then((spot) => {
      setSpotLoaded(true);

      const previewImage = spot.SpotImages?.find((img) => img.preview);
      if (previewImage) setPreview(previewImage);
    });

    dispatch(getSpotReviewsThunk(id)).then(() => {
      if (user) {
        dispatch(getUserReviewsThunk(user?.id)).then(() => setReviewsLoaded(true));
      } else {
        setReviewsLoaded(true);
      }
    });
  }, [dispatch, id]);

  useEffect(() => {
    if (!spot || !reviews) return setDisplayRating('-.--');

    if (!reviews.length) {
      setDisplayRating('New');
    } else {
      setDisplayRating(((reviews.reduce((sum, r) => sum + r.stars, 0)) / reviews.length)
        .toDynamic(2, 1));
    }

    setDisplayReviews(
      reviews.length === 1
        ? '1 review'
        : reviews.length + ' reviews'
    );
  }, [spot, reviews]);

  return spotLoaded
    ? spot && Object.entries(spot).length
      ? (
        <main className="spot-details">
          <h1>{spot.name}</h1>
          <span className="location">{spot.city}, {spot.state}, {spot.country}</span>
          <div className="spot-images">
            <div className="preview">
              <img src={preview?.url || spot.SpotImages[0].url} />
            </div>
            <div className="img-grid">
              {spot.SpotImages.map((img) => {
                if (img.preview) return;

                return <img key={img.id} src={img.url} />;
              })}
            </div>
          </div>
          <div className="details">
            <div className="desc">
              <h2>Hosted by {spot.Owner.firstName + ' ' + spot.Owner.lastName}</h2>
              <p>{spot.description}</p>
            </div>
            <div className="reserve-card">
              <div className="summary">
                <span className="price">
                  <span className="money">${parseFloat(spot.price).toFixed(2)}</span>
                  /night
                </span>
                <div className="rating-summary">
                  <span className="stars">
                    <FaStar />{displayRating}
                  </span>
                  {reviews.length > 0 && (
                    <>
                      <span className="dividot"> • </span>
                      <span className="review-count">{displayReviews}</span>
                    </>
                  )}
                </div>
              </div>
              <button
                className="reserve-btn"
                onClick={() => alert('Feature coming soon!')}
              >Reserve</button>
            </div>
          </div>
          <hr />
          <div className="review-container">
            <div className="rating-summary lg">
              <span className="stars lg">
                <FaStar />{displayRating}
              </span>
              {reviews.length > 0 && (
                <>
                  <span className="dividot lg"> • </span>
                  <span className="review-count lg">{displayReviews}</span>
                </>
              )}
            </div>
            {reviewsLoaded
              ? (
                <>
                  {!userReviews.find((r) => {
                    return r.userId === user?.id && r.spotId === spot.id
                  }) && (
                      <>
                        {!reviews.length && (
                          <div className="no-reviews">
                            <h3>No Reviews (yet)</h3>
                            {user
                              ? spot.ownerId !== user.id && (
                                <p>Be the first to post a review!</p>
                              ) : (
                                <p>Sign in and be the first to leave a review!</p>
                              )
                            }
                          </div>
                        )}
                        {(user && spot.ownerId !== user.id) && (
                          <div className="post-review">
                            <OpenModalButton
                              className="post-review"
                              modalComponent={<ReviewFormModal spotId={spot.id} />}
                              buttonText="Post Your Review"
                            />
                          </div>
                        )}
                      </>
                    )}
                  {reviews.length > 0 && (
                    <div className="reviews">
                      {reviews.map((review) => (
                        <div key={review.id} className="review">
                          <div className="review-header">
                            <h3>{review.User.firstName}</h3>
                            <span className="date">
                              {
                                new Date(review.createdAt).toLocaleString(
                                  'default',
                                  {
                                    month: 'long',
                                    year: 'numeric',
                                  }
                                )
                              }
                            </span>
                          </div>
                          <p>{review.review}</p>
                          {review.User.id === session.user?.id && (
                            <>
                              <OpenModalButton
                                modalComponent={
                                  <ReviewFormModal spotId={spot.id} reviewId={review.id} />
                                }
                                buttonText="Update"
                              />
                              <OpenModalButton
                                className="delete-btn"
                                modalComponent={<DeleteReviewModal review={review} />}
                                buttonText="Delete"
                              />
                            </>
                          )}
                          <hr />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <h2>Loading reviews...</h2>
              )
            }
          </div>
        </main >
      ) : ( // spot is null
        <h1>Spot not Found</h1>
      ) : ( // isLoaded is false
      <h2>Loading...</h2>
    );
}

export default SpotDetails;
