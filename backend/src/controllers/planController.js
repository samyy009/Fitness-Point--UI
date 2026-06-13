const { MembershipPlan } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const plans = await MembershipPlan.findAll({ where: { is_active: true }, order: [['price','ASC']] });
    res.json(plans);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const plan = await MembershipPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json(plan);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const plan = await MembershipPlan.create(req.body);
    res.status(201).json(plan);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const plan = await MembershipPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    await plan.update(req.body);
    res.json(plan);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const plan = await MembershipPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    await plan.update({ is_active: false });
    res.json({ message: 'Plan deactivated' });
  } catch (err) { next(err); }
};
