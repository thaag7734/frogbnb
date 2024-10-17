import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useModal } from "../../context/Modal";
import { createSpotReviewThunk } from "../../store/spots";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

function ReviewFormModal({ spotId }) {
  const [stars, setStars] = useState([false, false, false, false, false]);
  const [hoveredStar, setHoveredStar] = useState(null);
  const [review, setReview] = useState('');
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const selectStar = (idx) => setStars(stars.map((_, i) => i <= idx));

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

  useEffect(() => { }, [errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    return dispatch(createSpotReviewThunk(spotId, { review, stars: getStarRating() }))
      .then(closeModal)
      .catch((res) => res.json().then((body) => {
        const backendErrors = {};

        if (body.errors) {
          Object.entries(body.errors).forEach(([err, msg]) => {
            backendErrors[err] = <ErrorSpan msg={msg} />;
          });
        }

        console.log('res.errors ===>', body.errors);
        console.log('backendErrors ===>', backendErrors);

        setErrors(backendErrors);
      }));
  };

  return (
    <>
      <h1>How was your stay?</h1>
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
    </>
  );
}

export default ReviewFormModal;
