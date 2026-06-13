const { Class, Trainer } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const { category } = req.query;
    const where = { is_active: true };
    if (category) where.category = category;
    const classes = await Class.findAll({ where, include: [{ model: Trainer, as: 'trainer', attributes: ['id','name','specialty','avatar'] }], order: [['created_at','DESC']] });
    res.json(classes);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const cls = await Class.findByPk(req.params.id, { include: [{ model: Trainer, as: 'trainer' }] });
    if (!cls) return res.status(404).json({ error: 'Class not found' });
    res.json(cls);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const cls = await Class.create(req.body);
    res.status(201).json(cls);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const cls = await Class.findByPk(req.params.id);
    if (!cls) return res.status(404).json({ error: 'Class not found' });
    await cls.update(req.body);
    res.json(cls);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const cls = await Class.findByPk(req.params.id);
    if (!cls) return res.status(404).json({ error: 'Class not found' });
    await cls.update({ is_active: false });
    res.json({ message: 'Class deactivated' });
  } catch (err) { next(err); }
};
