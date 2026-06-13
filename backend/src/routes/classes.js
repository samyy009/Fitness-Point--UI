const router = require('express').Router();
const c = require('../controllers/classController');
router.get('/', c.getAll);
router.get('/:id', c.getOne);
module.exports = router;
