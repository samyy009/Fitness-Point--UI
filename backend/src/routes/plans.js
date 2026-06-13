const router = require('express').Router();
const c = require('../controllers/planController');
router.get('/', c.getAll);
router.get('/:id', c.getOne);
module.exports = router;
