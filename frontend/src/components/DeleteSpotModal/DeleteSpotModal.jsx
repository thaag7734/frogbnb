import { deleteSpotThunk } from "../../store/spots";
import ErrorSpan from "../ErrorSpan/ErrorSpan";
import { useModal } from '../../context/Modal.jsx';
import { useState } from "react";
import { useDispatch } from "react-redux";

function DeleteSpotModal({ spotId }) {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = () => {
    dispatch(deleteSpotThunk(spotId))
      .then(closeModal)
      .catch((eBody) => setError(<ErrorSpan msg={eBody.message} />))
  }

  return (
    <div className="delete-spot-modal">
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to remove this spot from the listings?</p>
      <button onClick={handleDelete}>Yes (Delete Spot)</button>
      <button onClick={closeModal}>No (Keep Spot)</button>
      {error}
    </div>
  );
}

export default DeleteSpotModal;
