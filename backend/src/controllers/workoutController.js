const { WorkoutLog } = require('../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const where = { user_id: req.user.id };
    if (from && to) where.date = { [Op.between]: [from, to] };
    const logs = await WorkoutLog.findAll({ where, order: [['date','DESC']] });
    res.json(logs);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const log = await WorkoutLog.create({ ...req.body, user_id: req.user.id });
    res.status(201).json(log);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const log = await WorkoutLog.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!log) return res.status(404).json({ error: 'Workout log not found' });
    await log.update(req.body);
    res.json(log);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const log = await WorkoutLog.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!log) return res.status(404).json({ error: 'Workout log not found' });
    await log.destroy();
    res.json({ message: 'Workout log deleted' });
  } catch (err) { next(err); }
};
