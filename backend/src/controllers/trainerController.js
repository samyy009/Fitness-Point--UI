const { Trainer } = require('../models');

// GET /api/trainers
exports.getAll = async (req, res, next) => {
  try {
    const trainers = await Trainer.findAll({ where: { is_active: true }, order: [['created_at', 'DESC']] });
    res.json(trainers);
  } catch (err) { next(err); }
};

// GET /api/trainers/:id
exports.getOne = async (req, res, next) => {
  try {
    const trainer = await Trainer.findByPk(req.params.id);
    if (!trainer) return res.status(404).json({ error: 'Trainer not found' });
    res.json(trainer);
  } catch (err) { next(err); }
};

// POST /api/admin/trainers
exports.create = async (req, res, next) => {
  try {
    const trainer = await Trainer.create(req.body);
    res.status(201).json(trainer);
  } catch (err) { next(err); }
};

// PUT /api/admin/trainers/:id
exports.update = async (req, res, next) => {
  try {
    const trainer = await Trainer.findByPk(req.params.id);
    if (!trainer) return res.status(404).json({ error: 'Trainer not found' });
    await trainer.update(req.body);
    res.json(trainer);
  } catch (err) { next(err); }
};

// DELETE /api/admin/trainers/:id
exports.remove = async (req, res, next) => {
  try {
    const trainer = await Trainer.findByPk(req.params.id);
    if (!trainer) return res.status(404).json({ error: 'Trainer not found' });
    await trainer.update({ is_active: false });
    res.json({ message: 'Trainer deactivated' });
  } catch (err) { next(err); }
};
