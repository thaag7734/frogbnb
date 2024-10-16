import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import './SpotDetails.css';
import { useState, useEffect } from "react";
import { deleteReviewThunk, getSpotDetailsThunk, getSpotReviewsThunk } from "../../store/spots";
import { FaStar } from "react-icons/fa";
import '../../vlib/proto/date.js';
import '../../vlib/proto/number.js';
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem.jsx";
import ReviewFormModal from "../ReviewFormModal/ReviewFormModal.jsx";
import OpenModalButton from "../OpenModalButton/OpenModalButton.jsx";

function SpotDetails() {
  const { id } = useParams();
  const [spotLoaded, setSpotLoaded] = useState(false);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const [preview, setPreview] = useState(null);
  const spot = useSelector(state => state.spots[id]);
  const session = useSelector(state => state.session);
  const [displayRating, setDisplayRating] = useState(null);
  const [displayReviews, setDisplayReviews] = useState('- reviews');
  const [reviewErrors, setReviewErrors] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSpotDetailsThunk(id)).then((spot) => {
      setSpotLoaded(true);

      const previewImage = spot.SpotImages?.find((img) => img.preview);
      if (previewImage) setPreview(previewImage);
    });

    dispatch(getSpotReviewsThunk(id)).then(() => setReviewsLoaded(true));
  }, [dispatch, id]);

  useEffect(() => {
    if (!spot) return setDisplayRating('-.--');

    setDisplayRating(
      spot.avgStarRating == null
        ? 'New'
        : parseFloat(spot.avgStarRating).toDynamic(2, 1)
    );

    setDisplayReviews(
      spot.numReviews === 1
        ? '1 review'
        : spot.numReviews + ' reviews'
    );
  }, [spot]);

  const handleDeleteReview = (review) => {
    dispatch(deleteReviewThunk(review))
      .catch((body) => {
        setReviewErrors({
          ...reviewErrors,
          [review.id]: <ErrorSpan msg={body.message} />,
        });
      });
  };

  return spotLoaded
    ? spot
      ? (
        <main>
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
                  <span className="dividot">•</span>
                  <span className="review-count">{displayReviews}</span>
                </div>
              </div>
              <button className="reserve-btn">Reserve</button>
            </div>
          </div>
          <hr />
          <div className="review-container">
            <div className="rating-summary lg">
              <span className="stars lg">
                <FaStar />{displayRating}
              </span>
              <span className="dividot lg">•</span>
              <span className="review-count lg">{displayReviews}</span>
            </div>
            {reviewsLoaded
              ? spot.reviews?.length
                ? (
                  <div className="reviews">
                    {spot.reviews.map((review) => (
                      <div key={review.id} className="review">
                        <div className="review-header">
                          <h3>{review.User.firstName}</h3>
                          <span className="review-date">
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
                          <button
                            className="delete-review"
                            onClick={() => handleDeleteReview(review)}
                          >Delete</button>
                        )}
                        {reviewErrors[review.id]}
                      </div>
                    ))}
                  </div>
                ) : session.user
                  ? (
                    <div className="first-review">
                      <OpenModalButton
                        modalComponent={<ReviewFormModal spotId={spot.id} />}
                        buttonText="Post Your Review"
                      />
                      <p>Be the first to post a review!</p>
                    </div>
                  ) : (
                    <div className="no-reviews">
                      <h3>No Reviews (yet)</h3>
                      <p>Sign in and be the first to leave a review!</p>
                    </div>
                  ) : (
                <h2>Loading reviews...</h2>
              )
            }
          </div>
        </main>
      ) : ( // spot is null
        <h1>Spot not Found</h1>
      ) : ( // isLoaded is false
      <h2>Loading...</h2>
    );
}

export default SpotDetails;
