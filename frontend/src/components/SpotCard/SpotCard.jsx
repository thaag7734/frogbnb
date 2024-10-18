import { FaStar } from "react-icons/fa";
import './SpotCard.css';
import { useNavigate } from "react-router-dom";
import '../../vlib/proto/number.js';
import { useDispatch } from "react-redux";
import { useState } from 'react';

/**
 * @import { Spot } from '../../store/spots.js'
 */

/**
 * @param {{ spot: Spot, manage?: boolean }}
 * @returns { Component }
 */
function SpotCard({ spot, manage }) {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = (e) => {
    e.stopImmediatePropagation();

    setError('');

    dispatch(deleteSpotThunk(spot.id))
      .catch((body) => {
        setError(<ErrorSpan msg={body.message} />);
      });
  }

  const handleUpdate = (e) => {
    e.stopImmediatePropagation();
    navigate(`/spots/${spot.id}/update`);
  }

  return (
    <div className="spot-card">
      <div className="preview">
        <img src={spot.previewImage} alt={spot.name} />
      </div>
      <div className="loc-rvw">
        <span>{spot.city}, {spot.state}</span>
        <span><FaStar /> {(() => {
          // NaN is a great type and i'm so glad it exists (i hate it so much)
          const avg = parseFloat(spot.avgRating);

          if (Number.isNaN(avg)) return 'New';

          return avg.toDynamic(2, 1);
        })()}</span>
      </div>
      <div className="spot-price">
        <span className="money">${spot.price}</span><span>/night</span>
      </div>
      {manage && (
        <>
          <div className="manage-buttons">
            <button
              onClickCapture={handleUpdate}>Update</button>
            <button onClickCapture={handleDelete}>Delete</button>
          </div>
          {error}
        </>
      )}
    </div>
  );
}

export default SpotCard;
