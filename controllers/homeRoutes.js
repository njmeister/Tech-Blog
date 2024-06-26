const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

// GET all posts for homepage
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
      order: [['date', 'DESC']],
    });

    const posts = postData.map((project) => project.get({ plain: true }));

    res.render('homepage', {
      posts,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET one post
router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const post = postData.get({ plain: true });

    const commentData = await Comment.findAll({
      where: {
        post_id: req.params.id
      },
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
      order: [['date', 'DESC']],
    });

    const comments = commentData.map((project) => project.get({ plain: true }));

    res.render('post', {
      post,
      comments,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET all comments
router.get('/comments', async (req, res) => {
  try {
    const commentData = await Comment.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
      order: [['date', 'DESC']],
    });

    const comments = commentData.map((project) => project.get({ plain: true }));

    res.render('comments', {
      comments,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// GET all of the user's posts
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: {
        user_id: req.session.user_id
      },
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
      order: [['date', 'DESC']],
    });

    const posts = postData.map((project) => project.get({ plain: true }));

    res.render('dashboard', {
      posts,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET the new post form
router.get('/newpost', withAuth, (req, res) => {
  res.render('newPost', {
    logged_in: req.session.logged_in
  });
});

// GET the new comment form
router.get('/comment/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const post = postData.get({ plain: true });

    res.render('newComment', {
      post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET the login page
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

// GET the signup page
router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('signup');
});

module.exports = router;