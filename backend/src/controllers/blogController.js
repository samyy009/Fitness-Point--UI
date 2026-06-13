const { BlogPost, User } = require('../models');

const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

exports.getAll = async (req, res, next) => {
  try {
    const { category } = req.query;
    const where = { is_published: true };
    if (category) where.category = category;
    const posts = await BlogPost.findAll({
      where, order: [['published_at','DESC']],
      include: [{ model: User, as: 'author', attributes: ['id','name','avatar'] }]
    });
    res.json(posts);
  } catch (err) { next(err); }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({
      where: { slug: req.params.slug, is_published: true },
      include: [{ model: User, as: 'author', attributes: ['id','name','avatar'] }]
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    await post.increment('views');
    res.json(post);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { title } = req.body;
    const baseSlug = slugify(title);
    let slug = baseSlug;
    let count = 1;
    while (await BlogPost.findOne({ where: { slug } })) { slug = `${baseSlug}-${count++}`; }
    const post = await BlogPost.create({
      ...req.body, slug, author_id: req.user.id,
      published_at: req.body.is_published ? new Date() : null
    });
    res.status(201).json(post);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (req.body.is_published && !post.published_at) req.body.published_at = new Date();
    await post.update(req.body);
    res.json(post);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    await post.destroy();
    res.json({ message: 'Post deleted' });
  } catch (err) { next(err); }
};
