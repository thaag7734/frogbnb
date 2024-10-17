import { FaStar } from "react-icons/fa";
import './SpotCard.css';

/**
 * @import { Spot } from '../../store/spots.js'
 */

/**
 * @param { number } key The spot's ID to be used as a key by React
 * @param { Spot } spot The spot object
 * @returns { Component }
 */
function SpotCard({ spot }) {
  return (
    <div className="spot-card">
      <div className="preview">
        <img src={spot.previewImage} alt={spot.name} />
      </div>
      <div className="loc-rvw">
        <span>{spot.city}, {spot.state}</span>
        <span><FaStar /> {/*spot.avgRating.toFixed(1)*/}</span>
      </div>
      <div className="spot-price">
        <span className="money">${spot.price}</span><span>/night</span>
      </div>
    </div>
  );
}

export default SpotCard;
