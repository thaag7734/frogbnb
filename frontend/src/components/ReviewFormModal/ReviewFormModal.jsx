import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useModal } from "../../context/Modal";
import { createReviewThunk, spotReviewsSelector, updateReviewThunk } from "../../store/reviews";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import ErrorSpan from "../ErrorSpan/ErrorSpan";
import { useSelector } from "react-redux";
import './ReviewFormModal.css';

function ReviewFormModal({ spotId, reviewId }) {
  const reviews = useSelector(state => spotReviewsSelector(state, spotId));
  const spots = useSelector(state => state.spots);
  const [stars, setStars] = useState([false, false, false, false, false]);
  const [hoveredStar, setHoveredStar] = useState(null);
  const [review, setReview] = useState('');
  const [spot, setSpot] = useState(null);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const selectStar = (idx) => setStars([...stars].map((_, i) => i <= idx));

  const hoverStar = (idx) => setHoveredStar(idx);

  const exitHoverStar = () => setHoveredStar(null);

  const getStarRating = () => {
    let starCount = 0;
    let starVal = stars[0];

    while (starVal) {
      starCount++;
      starVal = stars[starCount];
    }

    console.log('starCount ===>', starCount);
    return starCount;
  }

  useEffect(() => {
    const thisReview = reviews.find((r) => r.id === reviewId);

    setSpot(Object.values(spots).find((s) => s.id === spotId));

    setReview(thisReview?.review ?? '');
    selectStar((thisReview?.stars ?? 0) - 1);
  }, [reviews, spots]);

  useEffect(() => { }, [errors, stars]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    const thisReview = reviews.find((r) => r.id === reviewId);

    // this is deeply cursed but it worked fine (not fine) for updating spots
    let thunk;
    if (thisReview) {
      thunk = dispatch(updateReviewThunk({ ...thisReview, review, stars: getStarRating() }));
    } else {
      thunk = dispatch(createReviewThunk(spotId, { review, stars: getStarRating() }))
    }

    thunk.then(closeModal)
      .catch((body) => {
        console.log(body);
        const backendErrors = {};

        if (body.errors) {
          Object.entries(body.errors).forEach(([err, msg]) => {
            backendErrors[err] = <ErrorSpan msg={msg} />;
          });
        }

        console.log('res.errors ===>', body.errors);
        console.log('backendErrors ===>', backendErrors);

        setErrors(backendErrors);
      });
  };

  return spot && (
    <div className="review-modal modal-content">
      <h1>How was your stay at {spot.name}?</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="review" className="hidden">Review</label>
        <textarea
          className="noresize"
          value={review}
          placeholder="Leave your review here..."
          name="review"
          onChange={(e) => setReview(e.target.value)}
          required
        />
        {errors.review}
        <div className="star-choice">
          <div>
            {stars.map((starFilled, idx) => {
              return (
                <span
                  key={idx}
                  onClick={() => selectStar(idx)}
                  onMouseEnter={() => hoverStar(idx)}
                  onMouseLeave={exitHoverStar}
                >
                  {
                    starFilled
                      || (hoveredStar !== null && idx <= hoveredStar)
                      ? <FaStar />
                      : <FaRegStar />
                  }
                </span>
              );
            })}
          </div>
          <span>Stars</span>
        </div>
        {errors.stars}
        <button
          type="submit"
          disabled={review.length < 10 || !stars.find((star) => star)}
        >Submit Your Review</button>
      </form >
    </div>
  );
}

export default ReviewFormModal;
