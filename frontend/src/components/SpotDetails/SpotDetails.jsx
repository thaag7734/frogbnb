import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import './SpotDetails.css';
import { useState, useEffect } from "react";
import { getSpotDetailsThunk, getSpotReviewsThunk } from "../../store/spots";
import { FaStar } from "react-icons/fa";
import '../../vlib/date.js';
import '../../vlib/number.js';

/**
 * @import { Maybe } from '../../vlib/types.js'
 */

function SpotDetails() {
  const { id } = useParams();
  const [spotLoaded, setSpotLoaded] = useState(false);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const [preview, setPreview] = useState(null);
  const spot = useSelector(state => state.spots[id]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSpotDetailsThunk(id)).then((spot) => {
      setSpotLoaded(true);

      const previewImage = spot.SpotImages?.find((img) => img.preview);
      if (previewImage) setPreview(previewImage);
    });

    dispatch(getSpotReviewsThunk(id)).then(() => setReviewsLoaded(true));
  }, [dispatch, id]);

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
                    <FaStar />{parseFloat(spot.avgStarRating).toDynamic(2, 1) || 'New'}
                  </span>
                  <span className="dividot">•</span>
                  <span className="review-count">{spot.numReviews} reviews</span>
                </div>
              </div>
              <button className="reserve-btn">Reserve</button>
            </div>
          </div>
          <hr />
          <div className="review-container">
            <div className="rating-summary lg">
              <span className="stars lg">
                <FaStar />{parseFloat(spot.avgStarRating).toDynamic(2, 1) || 'New'}
              </span>
              <span className="dividot lg">•</span>
              <span className="review-count lg">{spot.numReviews} reviews</span>
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
                              new Date(review.createdAt).getMonthString()
                              + ' '
                              + new Date(review.createdAt).getFullYear()
                            }
                          </span>
                        </div>
                        <p>{review.review}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="first-review">
                    <button>Post Your Review</button> {/* TODO make this a component */}
                    <span>Be the first to post a review!</span>
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
