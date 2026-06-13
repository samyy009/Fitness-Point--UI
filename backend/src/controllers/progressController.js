const { ProgressLog } = require('../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const where = { user_id: req.user.id };
    if (from && to) where.date = { [Op.between]: [from, to] };
    const logs = await ProgressLog.findAll({ where, order: [['date','ASC']] });
    res.json(logs);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const log = await ProgressLog.create({ ...req.body, user_id: req.user.id });
    res.status(201).json(log);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const log = await ProgressLog.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!log) return res.status(404).json({ error: 'Progress log not found' });
    await log.update(req.body);
    res.json(log);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const log = await ProgressLog.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!log) return res.status(404).json({ error: 'Progress log not found' });
    await log.destroy();
    res.json({ message: 'Progress log deleted' });
  } catch (err) { next(err); }
};
