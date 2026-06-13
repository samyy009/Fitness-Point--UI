const router = require('express').Router();
const c = require('../controllers/mealController');
const auth = require('../middleware/auth');
router.use(auth);
router.get('/', c.getAll);
router.post('/', c.create);
router.put('/:id', c.update);
router.delete('/:id', c.remove);
module.exports = router;
