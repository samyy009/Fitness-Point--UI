const { Membership, MembershipPlan } = require('../models');

exports.subscribe = async (req, res, next) => {
  try {
    const { plan_id, payment_method } = req.body;
    const plan = await MembershipPlan.findByPk(plan_id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    const start_date = new Date();
    const end_date = new Date(start_date);
    end_date.setDate(end_date.getDate() + plan.duration_days);
    const membership = await Membership.create({
      user_id: req.user.id, plan_id, start_date, end_date,
      amount_paid: plan.price, payment_method: payment_method || 'card', status: 'active'
    });
    res.status(201).json({ ...membership.toJSON(), plan });
  } catch (err) { next(err); }
};

exports.getMine = async (req, res, next) => {
  try {
    const memberships = await Membership.findAll({
      where: { user_id: req.user.id },
      include: [{ model: MembershipPlan, as: 'plan' }],
      order: [['created_at','DESC']]
    });
    res.json(memberships);
  } catch (err) { next(err); }
};

exports.cancel = async (req, res, next) => {
  try {
    const membership = await Membership.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!membership) return res.status(404).json({ error: 'Membership not found' });
    await membership.update({ status: 'cancelled' });
    res.json({ message: 'Membership cancelled' });
  } catch (err) { next(err); }
};
