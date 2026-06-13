const router = require('express').Router();
const c = require('../controllers/contactController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
router.post('/', c.submit);
router.get('/', auth, admin, c.getAll);
router.put('/:id/read', auth, admin, c.markRead);
router.delete('/:id', auth, admin, c.remove);
module.exports = router;
