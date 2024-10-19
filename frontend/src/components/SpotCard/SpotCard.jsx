import { FaStar } from "react-icons/fa";
import './SpotCard.css';
import { useNavigate, Link } from "react-router-dom";
import '../../vlib/proto/number.js';
import { useState, useEffect } from 'react';
import OpenModalButton from "../OpenModalButton/OpenModalButton.jsx";
import DeleteSpotModal from "../ManageSpots/DeleteSpotModal.jsx";
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
  const [error, setError] = useState('');
  const reviews = useSelector(state => spotReviewsSelector(state, spot.id))
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleUpdate = (e) => {
    navigate(`/spots/${spot.id}/update`);
  }

  useEffect(() => { dispatch(getSpotReviewsThunk(spot.id)) }, []);

  return (
    <div className="spot-card">
      <Link to={`/spots/${spot.id}`}>
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
          <span className="money">${spot.price}</span><span>/night</span>
        </div>
      </Link>
      {
        manage && (
          <>
            <div className="manage-buttons">
              <button
                onClick={handleUpdate}>Update</button>
              <OpenModalButton
                modalComponent={<DeleteSpotModal spotId={spot.id} />}
                buttonText="Delete"
              />
            </div>
            {error}
          </>
        )
      }
    </div >
  );
}

export default SpotCard;
