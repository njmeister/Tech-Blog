const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

router.post('/signup', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.redirect('/');
    });
  } else {
    res.status(404).end();
  }
});

router.post('/post', async (req, res) => {
  console.log(req.body);

  try {

    if (!req.session.logged_in) {
      res.status(400).json({ message: 'You need to be logged in to create a post!' });
      return;
    }

    console.log(req.session.user_id);
    const postData = {...req.body, user_id: req.session.user_id};
    console.log(postData);

    const newPost = await Post.create(postData);

    res.status(200).json(newPost);
  } catch (err) {
    console.log(err.message);
    res.status(400).json(err);
  }
});

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

    res.render('editPost', {
      post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/post/:id', async (req, res) => {
  try {
    const postData = await Post.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json(postData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/post/:id', async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json(postData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/comments/:id', async (req, res) => {
  try {
    if (!req.session.logged_in) {
      res.status(400).json({ message: 'You need to be logged in to create a comment!' });
      return;
    }

    const commentData = {...req.body, user_id: req.session.user_id, post_id: req.params.id};
    console.log(commentData);

    const newComment = await Comment.create(commentData);

    res.status(200).json(newComment);
  } catch (err) {
    console.log(err.message);
    res.status(400).json(err);
  }
});


module.exports = router;
