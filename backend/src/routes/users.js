const router = require('express').Router();
const c = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/me', auth, c.getProfile);
router.put('/me', auth, c.updateProfile);

module.exports = router;
