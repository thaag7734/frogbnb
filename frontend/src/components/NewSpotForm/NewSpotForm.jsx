import { useState, useEffect } from "react";
import '../../vlib/proto/string.js';

function NewSpotForm() {
  // java programming simulator
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [desc, setDesc] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  // NOTE the backend needs to be updated to store a max of 5 SpotImages per Spot
  const [images, setImages] = useState(['', '', '', '', '']);
  const [errors, setErrors] = useState({ images: [] });

  /**
   * Creates an error element containing containing `msg` as text
   * @param { string } msg The error message to be displayed
   */
  const createError = (msg) => {
    return <span className="error">{msg}</span>
  }

  const validate = () => {
    const validationErrors = { images: [] };

    const imageUrlSuffixes = [
      //'.apng',
      //'.avif',
      //'.gif',
      '.jpg',
      '.jpeg',
      '.jfif',
      '.pjpeg',
      '.pjp',
      '.png',
      //'.webp',
    ];

    if (!country) validationErrors.country = createError('Country is required');
    if (!address) validationErrors.address = createError('Address is required');
    if (!city) validationErrors.city = createError('City is required');
    if (!state) validationErrors.state = createError('State is required');
    if (!lat) validationErrors.lat = createError('Latitude is required');
    if (!lng) validationErrors.lng = createError('Longitude is required');
    if (!desc) validationErrors.desc = createError('Description is required');
    if (!title) validationErrors.title = createError('Title is required');
    if (!price) validationErrors.price = createError('Price is required');
    if (!images[0]) validationErrors.images[0] = createError('Preview image is required');

    if (!images[0].endsWithOne(imageUrlSuffixes)) {
      validationErrors.images[0] = createError('URL must point to an image file');
    }
    if (!images[1].endsWithOne(imageUrlSuffixes)) {
      validationErrors.images[1] = createError('URL must point to an image file');
    }
    if (!images[2].endsWithOne(imageUrlSuffixes)) {
      validationErrors.images[2] = createError('URL must point to an image file');
    }
    if (!images[3].endsWithOne(imageUrlSuffixes)) {
      validationErrors.images[3] = createError('URL must point to an image file');
    }
    if (!images[4].endsWithOne(imageUrlSuffixes)) {
      validationErrors.images[5] = createError('URL must point to an image file');
    }

    setErrors(validationErrors);

    return (Object.values(errors).length === 1 && errors.images.length === 0);
  };

  useEffect(() => console.log('useEffect with', errors), [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) console.log('bad validate');
  };

  /**
   * Sets a specific index in the `images` state
   * @param { number } idx The index to set the value at
   * @param { string } value The value to set
   */
  const setImage = (idx, value) => {
    const imgs = [...images];

    imgs[idx] = value;

    setImages(imgs);
  }

  return (
    <>
      <div className='form-header'>
        <h1>Create a New Spot</h1>
        <h2>Where&apos;s your place located?</h2>
        <p>Guests will only get your exact address once they book a reservation</p>
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          Country
          {errors.country}
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>
        <label>
          Street Address
          {errors.address}
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <label>
          City
          {errors.city}
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        <label>
          State
          {errors.state}
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </label>
        <label>
          Latitude
          {errors.lat}
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            required
          />
        </label>
        <label>
          Longitude
          {errors.lng}
          <input
            type="text"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            required
          />
        </label>
        <hr />
        <label>
          <div className="label-header">
            <h3>Describe your place to guests</h3>
            <span>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</span>
          </div>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
          {errors.desc}
        </label>
        <hr />
        <label>
          <div className="label-header">
            <h3>Create a title for your spot</h3>
            <span>Catch guests&apos; attention with a spot title that highlights what makes your place special.</span>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {errors.title}
        </label>
        <hr />
        <label>
          <div className="label-header">
            <h3>Set a base price for your spot</h3>
            <span>Competitive pricing can help your listing stand out and rank higher in search results.</span>
          </div>
          <span className="money">$</span>
          <input
            type="text"
            value={price}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {errors.price}
        </label>
        <hr />
        <div className="image-urls">
          <h3>Liven up your spot with photos</h3>
          <span>Submit a link to at least one photo to publish your spot.</span>
        </div>
        <input
          type="text"
          value={images[0]}
          onChange={(e) => setImage(0, e.target.value)}
          required
        />
        {errors.images[0]}
        <input
          type="text"
          value={images[1]}
          onChange={(e) => setImage(1, e.target.value)}
        />
        {errors.images[1]}
        <input
          type="text"
          value={images[2]}
          onChange={(e) => setImage(2, e.target.value)}
        />
        {errors.images[2]}
        <input
          type="text"
          value={images[3]}
          onChange={(e) => setImage(3, e.target.value)}
        />
        {errors.images[3]}
        <input
          type="text"
          value={images[4]}
          onChange={(e) => setImage(4, e.target.value)}
        />
        {errors.images[4]}
        <button type="submit">Create Spot</button>
      </form>
    </>
  )
}

export default NewSpotForm;
