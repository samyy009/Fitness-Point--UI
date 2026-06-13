const { User } = require('../models');

// GET /api/users/me
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password_hash'] } });
    res.json(user);
  } catch (err) { next(err); }
};

// PUT /api/users/me
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, date_of_birth, gender, height_cm, weight_kg, fitness_goal, avatar } = req.body;
    const user = await User.findByPk(req.user.id);
    await user.update({ name, phone, date_of_birth, gender, height_cm, weight_kg, fitness_goal, avatar });
    const updated = await User.findByPk(req.user.id, { attributes: { exclude: ['password_hash'] } });
    res.json(updated);
  } catch (err) { next(err); }
};
