import { useSelector } from "react-redux";
import { getUserReviewsThunk, userReviewsSelector } from "../../store/reviews";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ReviewFormModal from "../ReviewFormModal/ReviewFormModal";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";
import { getSpotDetailsThunk } from "../../store/spots";
import './ManageReviews.css';


function ManageReviews() {
  const user = useSelector(state => state.session.user);
  const reviews = useSelector(state => userReviewsSelector(state, user.id));
  const spots = useSelector(state => state.spots);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserReviewsThunk(user.id));
  }, [user]);

  useEffect(() => {
    reviews.forEach((review) => dispatch(getSpotDetailsThunk(review.spotId)));
  }, [reviews]);

  return (
    <main className="manage-reviews">
      <h1>Manage Reviews</h1>
      {reviews.map((review) => (
        <>
          <div key={review.id} className="review">
            <h3>{Object.values(spots).find((s) => s.id === review.spotId)?.name}</h3>
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
            <p>{review.review}</p>
            <div className="manage-buttons">
              <OpenModalButton
                modalComponent={
                  <ReviewFormModal
                    spotId={review.spotId}
                    reviewId={review.id}
                  />
                }
                buttonText="Update"
              />
              <OpenModalButton
                className="delete-btn"
                modalComponent={<DeleteReviewModal review={review} />}
                buttonText="Delete"
              />
            </div>
          </div>
          <hr />
        </>
      ))}
    </main>
  )
}

export default ManageReviews;
