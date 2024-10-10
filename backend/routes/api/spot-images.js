const router = require('express').Router();
const { SpotImage, Spot } = require('../../db/models');

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

module.exports = router;
