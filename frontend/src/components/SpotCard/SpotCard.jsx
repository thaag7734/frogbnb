import { FaStar } from "react-icons/fa";
import './SpotCard.css';
import { useNavigate } from "react-router-dom";
import '../../vlib/proto/number.js';
import { useEffect } from 'react';
import OpenModalButton from "../OpenModalButton/OpenModalButton.jsx";
import DeleteSpotModal from "../DeleteSpotModal/DeleteSpotModal.jsx";
import { useSelector } from "react-redux";
import { getSpotReviewsThunk, spotReviewsSelector } from "../../store/reviews.js";
import { useDispatch } from "react-redux";

/**
 * @import { Spot } from '../../store/spots.js'
 */

/**
 * @param {{ spot: Spot, manage?: boolean }}
 * @returns { Component }
 */
function SpotCard({ spot, manage }) {
  const reviews = useSelector(state => spotReviewsSelector(state, spot.id))
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleUpdate = (e) => {
    e.stopPropagation();

    navigate(`/spots/${spot.id}/update`);
  }

  const navToSpot = () => {
    navigate(`/spots/${spot.id}`);
  }

  useEffect(() => { dispatch(getSpotReviewsThunk(spot.id)) }, []);

  return (
    <div className="spot-card" onClick={navToSpot} title={spot.name}>
      <div className="preview">
        <img src={spot.previewImage} alt={spot.name} />
      </div>
      <div className="loc-rvw">
        <span>{spot.city}, {spot.state}</span>
        <span>
          <FaStar /> {
            reviews.length
              ? (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length)
                .toDynamic(2, 1)
              : 'New'
          }
        </span>
      </div>
      <div className="spot-price">
        <span className="money">${parseFloat(spot.price).toFixed(2)}</span><span> / night</span>
      </div>
      {
        manage && (
          <>
            <div className="manage-buttons">
              <button
                onClick={handleUpdate}>Update</button>
              <OpenModalButton
                className="delete-btn"
                modalComponent={<DeleteSpotModal spotId={spot.id} />}
                buttonText="Delete"
              />
            </div>
          </>
        )
      }
    </div >
  );
}

export default SpotCard;
