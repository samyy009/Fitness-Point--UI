const router = require('express').Router();
const c = require('../controllers/membershipController');
const auth = require('../middleware/auth');
router.use(auth);
router.post('/', c.subscribe);
router.get('/me', c.getMine);
router.put('/:id/cancel', c.cancel);
module.exports = router;
