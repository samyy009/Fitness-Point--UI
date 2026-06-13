const { ContactMessage } = require('../models');

exports.submit = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ error: 'Name, email and message are required' });
    const msg = await ContactMessage.create({ name, email, phone, subject, message });
    res.status(201).json({ message: 'Message sent successfully', id: msg.id });
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const messages = await ContactMessage.findAll({ order: [['created_at','DESC']] });
    res.json(messages);
  } catch (err) { next(err); }
};

exports.markRead = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByPk(req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    await msg.update({ is_read: true, replied_at: new Date() });
    res.json(msg);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByPk(req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    await msg.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
