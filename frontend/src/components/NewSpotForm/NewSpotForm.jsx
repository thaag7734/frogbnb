import { useState, useEffect } from "react";
import '../../vlib/proto/string.js';
import { createSpotImageThunk, createSpotThunk, deleteSpotThunk } from "../../store/spots.js";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function NewSpotForm() {
  // java programming simulator
  const userId = useSelector(state => state.session.user?.id)
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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let runningErrors = { images: [] };

  /**
   * Creates an error element containing containing `msg` as text
   * @param { string } msg The error message to be displayed
   */
  const createError = (msg) => {
    return <span className="error">{msg}</span>
  }

  /**
   * Validate all form fields and set the errors state. Returns `true` if validations pass,
   * `false` otherwise
   * @returns { boolean }
   */
  const validate = () => {
    const validationErrors = { images: [] };
    runningErrors = { images: [] };

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

    // TODO make this a loop probably
    if (images[0] && !images[0].toLowerCase().endsWithOne(imageUrlSuffixes)) {
      validationErrors.images[0] = createError('URL must point to an image file');
    }
    if (images[1] && !images[1].toLowerCase().endsWithOne(imageUrlSuffixes)) {
      validationErrors.images[1] = createError('URL must point to an image file');
    }
    if (images[2] && !images[2].toLowerCase().endsWithOne(imageUrlSuffixes)) {
      validationErrors.images[2] = createError('URL must point to an image file');
    }
    if (images[3] && !images[3].toLowerCase().endsWithOne(imageUrlSuffixes)) {
      validationErrors.images[3] = createError('URL must point to an image file');
    }
    if (images[4] && !images[4].toLowerCase().endsWithOne(imageUrlSuffixes)) {
      validationErrors.images[4] = createError('URL must point to an image file');
    }

    const floatLat = parseFloat(lat);
    const floatLng = parseFloat(lng);

    if (lat && (Number.isNaN(floatLat) || -90 > floatLat || floatLat > 90)) {
      validationErrors.lat = createError('Latitude must be a number from -90 to 90');
    }
    if (lng && (Number.isNaN(floatLng) || -180 > floatLng || floatLng > 180)) {
      validationErrors.lng = createError('Longitude must be a number from -180 to 180');
    }

    const floatPrice = parseFloat(price);

    if (price && (Number.isNaN(floatPrice) || floatPrice <= 0)) {
      validationErrors.price = createError('Price must be a number greater than zero');
    }

    runningErrors = validationErrors;
    setErrors(validationErrors);

    return (
      Object.entries(validationErrors).length === 1
      && validationErrors.images.length === 0
    );
  };

  useEffect(() => { }, [errors]);

  const fillDummyData = () => {
    setCountry('USA');
    setAddress('123 Ribbit Rd');
    setCity('Frog Island');
    setState('NC');
    setLat('36.1404343');
    setLng('-76.1249702');
    setDesc('ribbit ribbit ribbit ribbit ribbit ribbit ribbit');
    setTitle('ribbit');
    setPrice(41.30);
    setImages(['https://i.ibb.co/LCpjhWh/tetangerine.png', '', '', '', '']);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const handleImgFailure = (eRes, idx) => {
      return eRes.json().then((eBody) => {
        runningErrors.images[idx] = createError(eBody.errors.url);
      });
    }

    dispatch(
      createSpotThunk({
        ownerId: userId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name: title,
        description: desc,
        price,
      })
    ).then((res) => {
      const promises = [
        dispatch(createSpotImageThunk(
          { spotId: res.id, url: images[0], preview: true },
        )).catch((eRes) => handleImgFailure(eRes, 0))
      ];

      for (let idx = 1; idx < images.length; idx++) {
        if (!images[idx]) continue;
        promises.push(
          dispatch(createSpotImageThunk({
            spotId: res.id,
            url: images[idx],
            preview: false
          }))
            .catch((eRes) => handleImgFailure(eRes, idx))
        );
      }

      Promise.allSettled(promises).then(() => {
        setErrors({ ...runningErrors });

        if (
          Object.entries(runningErrors).length === 1 && runningErrors.images.length === 0
        ) {
          navigate(`/spots/${res.id}`);
        } else {
          // if this fails for any reason, everything breaks
          dispatch(deleteSpotThunk(res.id));
        }
      });
    }).catch((eRes) => eRes.json().then((eBody) => {
      for (const [err, msg] of Object.entries(eBody.errors)) {
        runningErrors[err] = createError(msg);
      }

      setErrors({ ...runningErrors });
      return;
    }));
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
    <main>
      <div className='form-header'>
        <h1>Create a New Spot</h1>
        <h2>Where&#39;s your place located?</h2>
        <p>Guests will only get your exact address once they book a reservation</p>
      </div>
      <button onClick={fillDummyData}>Fill Dummy Data</button>
      <form onSubmit={handleSubmit}>
        <label htmlFor="country">Country</label>
        {errors.country}
        <input
          type="text"
          value={country}
          name="country"
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        <label htmlFor="address">Street Address</label>
        {errors.address}
        <input
          type="text"
          value={address}
          name="address"
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <label htmlFor="city">City</label>
        {errors.city}
        <input
          type="text"
          value={city}
          name="city"
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <label htmlFor="state">State</label>
        {errors.state}
        <input
          type="text"
          value={state}
          name="state"
          onChange={(e) => setState(e.target.value)}
          required
        />
        <label htmlFor="lat">Latitude</label>
        {errors.lat}
        <input
          type="text"
          value={lat}
          name="lat"
          onChange={(e) => setLat(e.target.value)}
          required
        />
        <label htmlFor="lng">Longitude</label>
        {errors.lng}
        <input
          type="text"
          value={lng}
          name="lng"
          onChange={(e) => setLng(e.target.value)}
          required
        />
        <hr />
        <label htmlFor="desc">Description</label>
        <h3>Describe your place to guests</h3>
        <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
        <textarea
          className="noresize"
          value={desc}
          name="desc"
          onChange={(e) => setDesc(e.target.value)}
          required
        />
        {errors.desc ?? errors.description}
        <hr />
        <label htmlFor="title" className="hidden">Title</label>
        <h3>Create a title for your spot</h3>
        <p>Catch guests&#39; attention with a spot title that highlights what makes your place special.</p>
        <input
          type="text"
          value={title}
          name="title"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {errors.title}
        <hr />
        <label htmlFor="price" className="hidden">Price</label>
        <h3>Set a base price for your spot</h3>
        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
        <span className="money">$</span>
        <input
          type="number"
          value={price}
          name="price"
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        {errors.price}
        <hr />
        <div className="image-urls">
          <h3>Liven up your spot with photos</h3>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <label htmlFor="preview-image" className="hidden">Preview Image</label>
          <input
            type="text"
            value={images[0]}
            name="preview-image"
            onChange={(e) => setImage(0, e.target.value)}
            required
          />
          {errors.images[0]}
          <label htmlFor="image1" className="hidden">Extra Image 1</label>
          <input
            type="text"
            value={images[1]}
            name="image1"
            onChange={(e) => setImage(1, e.target.value)}
          />
          {errors.images[1]}
          <label htmlFor="image2" className="hidden">Extra Image 2</label>
          <input
            type="text"
            value={images[2]}
            name="image2"
            onChange={(e) => setImage(2, e.target.value)}
          />
          {errors.images[2]}
          <label htmlFor="image3" className="hidden">Extra Image 3</label>
          <input
            type="text"
            value={images[3]}
            name="image3"
            onChange={(e) => setImage(3, e.target.value)}
          />
          {errors.images[3]}
          <label htmlFor="image4" className="hidden">Extra Image 4</label>
          <input
            type="text"
            value={images[4]}
            name="image4"
            onChange={(e) => setImage(4, e.target.value)}
          />
          {errors.images[4]}
        </div>
        <button type="submit">Create Spot</button>
      </form >
    </main>
  )
}

export default NewSpotForm;
