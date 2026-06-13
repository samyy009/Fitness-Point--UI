const { User, Trainer, Class, Membership, BlogPost, ContactMessage, WorkoutLog, Booking, GalleryItem } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

// GET /api/admin/stats
exports.getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalTrainers, totalClasses, totalMemberships, unreadMessages, recentWorkouts] = await Promise.all([
      User.count({ where: { role: 'user' } }),
      Trainer.count({ where: { is_active: true } }),
      Class.count({ where: { is_active: true } }),
      Membership.count({ where: { status: 'active' } }),
      ContactMessage.count({ where: { is_read: false } }),
      WorkoutLog.count({ where: { created_at: { [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } })
    ]);
    const revenue = await Membership.sum('amount_paid', { where: { status: 'active' } });
    res.json({ totalUsers, totalTrainers, totalClasses, totalMemberships, unreadMessages, recentWorkouts, revenue: revenue || 0 });
  } catch (err) { next(err); }
};

// GET /api/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const where = {};
    if (search) where[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }, { email: { [Op.iLike]: `%${search}%` } }];
    const { count, rows } = await User.findAndCountAll({
      where, attributes: { exclude: ['password_hash'] },
      order: [['created_at','DESC']],
      limit: parseInt(limit), offset: (parseInt(page) - 1) * parseInt(limit)
    });
    res.json({ users: rows, total: count, page: parseInt(page), pages: Math.ceil(count / parseInt(limit)) });
  } catch (err) { next(err); }
};

// PUT /api/admin/users/:id
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password, ...rest } = req.body;
    if (password) rest.password_hash = await bcrypt.hash(password, 12);
    await user.update(rest);
    const updated = await User.findByPk(req.params.id, { attributes: { exclude: ['password_hash'] } });
    res.json(updated);
  } catch (err) { next(err); }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.update({ is_active: false });
    res.json({ message: 'User deactivated' });
  } catch (err) { next(err); }
};

// GET /api/admin/memberships
exports.getAllMemberships = async (req, res, next) => {
  try {
    const memberships = await Membership.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id','name','email'] },
        { model: require('../models').MembershipPlan, as: 'plan', attributes: ['id','name','price'] }
      ],
      order: [['created_at','DESC']]
    });
    res.json(memberships);
  } catch (err) { next(err); }
};

// ── Trainer Bookings ────────────────────────────────────────────────────────
exports.createBooking = async (req, res, next) => {
  try {
    const { trainerId, date, time, notes } = req.body;
    const booking = await Booking.create({
      user_id: req.user.id,
      trainer_id: trainerId,
      date,
      time,
      notes
    });
    res.status(201).json(booking);
  } catch (err) { next(err); }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Trainer, as: 'trainer', attributes: ['id', 'name', 'specialty'] }],
      order: [['date', 'DESC'], ['time', 'ASC']]
    });
    res.json(bookings);
  } catch (err) { next(err); }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Trainer, as: 'trainer', attributes: ['id', 'name', 'specialty'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(bookings);
  } catch (err) { next(err); }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    await booking.update({ status });
    res.json(booking);
  } catch (err) { next(err); }
};

// ── Transformation Gallery ──────────────────────────────────────────────────
exports.getGallery = async (req, res, next) => {
  try {
    const items = await GalleryItem.findAll({ order: [['created_at', 'DESC']] });
    res.json(items);
  } catch (err) { next(err); }
};

exports.createGalleryItem = async (req, res, next) => {
  try {
    const { name, change, before_img, after_img } = req.body;
    const item = await GalleryItem.create({ name, change, before_img, after_img });
    res.status(201).json(item);
  } catch (err) { next(err); }
};

exports.deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await GalleryItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Gallery item not found' });
    await item.destroy();
    res.json({ message: 'Gallery item removed' });
  } catch (err) { next(err); }
};
