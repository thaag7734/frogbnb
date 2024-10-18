const router = require('express').Router();
const { SpotImage, Spot } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { restoreUser, requireAuth } = require('../../utils/auth');

/**** DELETE a ReviewImage ****/
router.delete('/:imageId', async (req, res, next) => {
  const { user } = req;

  if (!user) {
    return res.status(401).json({ message: 'You must be signed in to access this resource.' });
  }

  const image = await SpotImage.findByPk(req.params.imageId);

  if (!image) {
    return res.status(404).json({ message: 'Spot Image couldn\'t be found' });
  }

  const spot = await Spot.findByPk(image.spotId);

  if (user.id !== spot.ownerId) {
    return res.status(403).json({
      message: 'You cannot delete a spot image that isn\'t yours.'
    });
  }

  try {
    await image.destroy()

    return res.status(200).json({ message: 'Successfully deleted' });
  } catch (e) {
    return next(e);
  }
});

const validateSpotImage = [
  check('url')
    .exists({ checkFalsy: true })
    .withMessage('Image URL is required')
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  check('preview')
    .exists()
    .isBoolean()
    .withMessage('Preview must be a boolean value'),
  handleValidationErrors
]
/**** Update a ReviewImage ****/
router.put('/:imageId',
  restoreUser, requireAuth, validateSpotImage,
  async (req, res, next) => {
    const { user } = req;

    const image = await SpotImage.findByPk(req.params.imageId);

    if (!image) {
      return res.status(404).json({ message: 'Spot Image couldn\'t be found' });
    }

    const spot = await Spot.findByPk(image.spotId);

    if (user.id !== spot.ownerId) {
      return res.status(403).json({
        message: 'You cannot delete a spot image that isn\'t yours.'
      });
    }

    image.url = req.body.url;
    image.preview = req.body.preview;

    try {
      await image.save();
    } catch (e) {
      return next(e);
    }

    return res.status(200).json(image);
  }
);

module.exports = router;
