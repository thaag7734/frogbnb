import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SpotCard from '../SpotCard/SpotCard.jsx';
import './Landing.css';
import { useEffect } from 'react';
import { getAllSpotsThunk } from '../../store/spots.js';

function Landing() {
  const spots = useSelector(state => state.spots);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllSpotsThunk());
  }, [dispatch]);

  return (
    <main>
      {
        Object.entries(spots).length
          ? Object.values(spots).map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))
          : <h2>Loading spots...</h2>
      }
    </main>
  );
}

export default Landing;
