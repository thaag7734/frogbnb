import { deleteReviewThunk } from "../../store/reviews";
import ErrorSpan from "../ErrorSpan/ErrorSpan";
import { useModal } from '../../context/Modal.jsx';
import { useState } from "react";
import { useDispatch } from "react-redux";
import './DeleteReviewModal.css';

function DeleteReviewModal({ review }) {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = () => {
    dispatch(deleteReviewThunk(review))
      .then(closeModal)
      .catch((eBody) => setError(<ErrorSpan msg={eBody.message} />))
  }

  return (
    <div className="delete-review-modal modal-content">
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to delete this review?</p>
      <div class="buttons">
        <button className="delete-btn" onClick={handleDelete}>Yes (Delete Review)</button>
        <button onClick={closeModal}>No (Keep Review)</button>
      </div>
      {error}
    </div>
  );
}

export default DeleteReviewModal;
