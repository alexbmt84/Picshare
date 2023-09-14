// Routes and module imports...

const { requireAuth } = require("../helpers/auth")
const { isValidHexCode } = require("../helpers/isValidHexCode")
const { imageUpload, avatarUpload } = require("../helpers/multerConfig")
const { Op } = require('sequelize');
const { User, Image, Category, Like, ImageScore, Comment, Follower, Hashtag } = require('../models');

const express = require('express'); // Import Express
const moment = require('moment');
require('moment/locale/fr'); // Import French local time
moment.locale('fr');

const router = express.Router(); // Creating the router...

router.use(express.json()); // We use express.json()

// --------------------------------- Change color route -----------------------------
router.post('/changeColor', (req, res) => {

  const colorCode = req.body.colorCode;
  
  if (isValidHexCode(colorCode)) {

    req.session.bgColor = colorCode;
    res.sendStatus(200);  // Send a 200 status to indicate success

  } else {

    res.status(400).send('Invalid color code');  // Send a 400 status to indicate a client error
  }

});

// -------------------------------- Save avatar route  --------------------------------
router.post('/profile/avatar', avatarUpload.single('avatar'), (req, res) => {

  if (req.file) {

    // Update user's avatar in database
    const userId = req.session.userId;
    const avatarPath = req.file.filename;
    
    User.changeAvatar(userId, avatarPath)

    .then(() => {
      res.redirect('back');
    })

    .catch((error) => {
      console.error(error);
      res.status(500).send('Server Error');
    });

  } else {
    res.status(400).send('No avatar file uploaded');
  }

});

// ------------------------------------- Main route ------------------------------------
router.get('/', async (req, res) => { 
  
  try {
    
    const categories = await Category.findAll({
      raw: true,
      attributes: ['id', 'name']
    });

    const imagesWithRatings = await Image.findAllWithRatings();

    res.render('home', {
      categories,
      images: imagesWithRatings,
    });

  } catch (error) {

    res.render('home', {
      messageClass: 'alert-danger',
      messages: error
    });

  }

});

// ------------------------------------ Home route ----------------------------------
router.get('/home', async (req, res) => { 

  try {

    const categories = await Category.findAll({
      raw: true,
      attributes: ['id', 'name']
    });

    // Get connected user...
    const id = req.session.userId;
    const user = await User.findOne({ where: { id }, raw: true });
    const username = user ? user.username : '';
    
    // Get all images with ratings and total votes...
    const imagesWithRatings = await Image.findAllWithRatings();

    // Set isCurrentUser to true only if the user is authenticated...
    const isCurrentUser = !!req.session.userId;

    res.render('home', {
      categories,
      images: imagesWithRatings,
      userId: id,
      user: user || {},
      isCurrentUser,
      username,
    });

  } catch (error) {

    res.render('home', {
      messageClass: 'alert-danger',
      messages: error
    });

  }

});

// --------------------------------- Search route --------------------------------//
router.get('/search/:hashtag', async (req, res) => { 

  let findHashtag = req.params.hashtag;
  let condition, includeCondition;

  // Check if findHashtag starts with '#'
  if(findHashtag.startsWith('#')){

    // Encode '#' to '%23'
    findHashtag = encodeURIComponent(findHashtag);
    // Only search in the 'hashtag' table
    condition = { '$hashtags.hashtag$': findHashtag };
    includeCondition = { hashtag: findHashtag };

  } else {

    // Perform a global search
    findHashtag = '%' + findHashtag + '%';
    condition = {
      [Op.or]: [
        { description: { [Op.like]: findHashtag } },
        { '$hashtags.hashtag$': findHashtag }
      ]
    };

    includeCondition = {};

  }
  
  const images = await Image.findAll({
    include: [
      {
        model: Hashtag,
        as: 'hashtags',
        where: includeCondition,  // Use the includeCondition here
        required: false
      },
      {
        model: User,
        as: 'User',
        attributes: ['username', 'id'],
      },
      {
        model: ImageScore,
        as: 'scores',
        attributes: [
          [ImageScore.sequelize.fn('COUNT', ImageScore.sequelize.col('scores.id')), 'voteCount'],
          [ImageScore.sequelize.fn('AVG', ImageScore.sequelize.col('note')), 'average'],
        ],
      },
    ],
    where: condition,
    group: ['Image.id', 'User.id', 'hashtags.id'],
    order: [['createdAt', 'DESC']]
  });

  const imagesWithRatings = images.map((image) => {
    const stats = {
      voteCount: 0,
      average: 0,
    };

    if (image.scores.length > 0) {
      stats.voteCount = parseInt(image.scores[0].dataValues.voteCount);
      stats.average = parseFloat(image.scores[0].dataValues.average);
    }

    return {
      ...image.toJSON(),
      ...stats,
      username: image.User.username,
      idUser: image.User.id,
    };

  });

  res.json(imagesWithRatings);
});

// ------------------------------------ Image route ------------------------------//
router.get('/image/:id', async (req, res) => {

  try {

    // Get image id and find the associated image...
    const { id } = req.params;
    
    const image = await Image.findOne({ where: { id }, raw: true, include: {
      model: User,
      attributes: ['id', 'username']
    }});

    // Get Comments & user's infos
    const commentData = await Comment.getCommentsWithUserData(id);

    // Calculate image's average note and total votes...
    const average = await ImageScore.average(image.id);
    const voteCount = await ImageScore.countVotes(image.id);

    let imageId = image.id;
    let imageDate = moment.utc(image.createdAt, 'YYYY-MM-DD HH:mm:ss.SSS Z').local().fromNow();
    image.average = average;
    image.voteCount = voteCount;
    image.username = image['User.username'];
    image.idUser = image['User.id'];
    
    const userId = req.session.userId;

    let user = await User.findOne({ where: { id: userId }, raw: true});

    let isCurrentUser = false;

    if(userId); { // We check that we are connected...

      isCurrentUser = true; // If yes, we pass currentUser in true..

    }
    console.log("---------------- :", isCurrentUser);
    res.render('image', { image, imageDate, comments: commentData, isCurrentUser, user, userId, imageId });
  
  } catch (error) {

    res.render('image', {
        messageClass: 'alert-danger', 
        messages: error
    });
  }
});
// ----------------- Delete image ------------------------------------------------------
router.delete('/image/:id', async (req, res) =>{

  try {
    const imageId = req.params.id;
    
    await Image.destroy({
      where: { id: imageId },
    });
    
    res.json({ message: 'L\'image a été supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image :', error);
    
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'image.' });
  }
});

// ----------------- Delete comment ------------------------------------------------------
router.post('/comment/:commentId', async (req, res) =>{

  try {
    const commentId = req.params.commentId;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Vous devez être connecté pour supprimer un commentaire." });
    }
    
    const comment = await Comment.findByPk(commentId);
    if (!comment || comment.userId !== userId) {

      return res.status(403).json({ error: "Vous n'êtes pas autorisé à supprimer ce commentaire." });
    }
    
    // Sup comment destroy Sequelize
    await Comment.destroy({
      where: { id: commentId },
    });
    
    res.json({ message: 'Le commentaire a été supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire :', error);
    
    res.status(500).json({ error: 'Erreur lors de la suppression du commentaire' });
  }
});

// ------------------------------------ Add like route ---------------------------//
router.post('/like/:commentId', async (req, res) => { // last modif ... 

  try {
    
    let commentId = req.params.commentId;
    let id = req.session.userId;

    // Find the comment
    const comment = await Comment.findOne({ where: { id: commentId } });

    // Check if the user has already liked the comment (you may have a separate likes table for this)
    const alreadyLiked = await Like.findOne({ where: { commentId, id } });
        
    // Find the comment
    const existingLike = await Like.findOne({ where: { commentId } });
    
    if (existingLike) {

      return;

    } else {

      let userId = req.session.userId;
      commentId = req.params.commentId;

      // If the like doesn't exist, create a new Like record with the given commentId and userId
      await Like.create({ commentId, userId });

    }

  } catch (error) {

    res.status(500).send('Server error');

  }

});

// --------------------------------- Profile route ------------------------------//

router.get('/profile/:id', async (req, res) => {

  try {

    let idUser = req.session.userId;

    const id = req.params.id;

    // Retrieve the user using ORM (for instance, Sequelize)...
    const currentUserPage = await User.findOne({ where: { id } });
    const user = await User.findOne({ where: { id: idUser } });

    // If the user clicked does not have a page...
    if (!currentUserPage) {

      res.status(404).send('User not found');
      return;

    }

    if (req.params.id == req.session.userId) {

      var isCurrentUser = true; // Recover user data...

    } else {

      var isCurrentUser = false; // Recover user data...

    }

    let username = '';
    let avatar = '';

    if (isCurrentUser) { 

      var isCurrentPage = true;

      let currentUser = await User.findOne({ where: { id: req.session.userId } });

      var countFollowings = await Follower.count({
        where: { followerId: req.session.userId }
      });

      var countFollowers = await Follower.count({
        where: { followingId: req.session.userId }
      });
      
      username = currentUser.username;
      avatar = currentUser.avatar;
      idUser = currentUser.id;

      idUserPage = currentUserPage.id;
      usernameUserPage = currentUserPage.username;
      avatarUserPage = currentUserPage.avatar;
      
    } else {

      isCurrentUser =  true;

      var isCurrentPage = currentUserPage == user ? true : false;
      var currentPage = await User.findOne({ where: { id: req.params.id } });

      username = currentPage.username;
      avatar = currentPage.avatar;
      idUser = currentPage.id;

      var countFollowings = await Follower.count({
        where: { followerId: req.params.id }
      });

      var countFollowers = await Follower.count({
        where: { followingId: req.params.id }
      });
      
    }
        
    const isFollowing = req.session.userId && await Follower.findOne({ where: { followerId: req.session.userId, followingId: currentUserPage.id } });
    
    currentUserPage.toJSON();
    
    res.render('profile', { user: user.toJSON(), isCurrentUser, isFollowing, isCurrentPage, userId: req.session.userId, username, avatar, idUser, countFollowings, countFollowers });

  } catch (error) {

    res.status(500).send('Server error');
  }

});

//----------------------------------- My images route ----------------------------//
router.get('/myImg', requireAuth, async (req, res) => {

  const userId = req.session.userId;
  const user = await User.findOne({ where: { id: userId }, raw:true });
  const images = await Image.findAll( { where: { userId: userId}, raw: true });

  let isCurrentUser = false;

  if(userId); { // We check that we are connected...

    isCurrentUser = true; // If so, we set currentUser to true...

  }


  res.render('myImg', { images, user: user, isCurrentUser }) 
  
});

// ------------------------------- Get upload image route ------------------------//

router.get('/upload', requireAuth, async (req, res) => {

  try {

    const id = req.session.userId;
    const user = await User.findOne({ where: { id: id }, raw:true });

    let isCurrentUser = false;

    if(id); { // We check that we are connected...
  
      isCurrentUser = true; // if yes, currentUser -> true...

    }

    const categories = await Category.findAll({
      raw: true,
      attributes: ['id', 'name']
    });

    res.render('upload', {
      categories,
      id,
      user: user,
      isCurrentUser
    });

  } catch (error) {

    res.render('upload', {
      messageClass: 'alert-danger',
      messages: error
    });

  }

});

// -------------------------------- Post image route -----------------------------//
router.post('/upload', imageUpload.single('upload_file'), async (req, res) => {

  try {

    const userId = req.session.userId;
    const slash = "/";
    const directionPath = req.file.destination;
    const directionArr = directionPath.split("/");
    const direction = slash+directionArr[1]+slash;
    const imageName = direction + req.file.filename;
    const { title, description } = req.body;
    const categoryId = req.body.categoryId;

    if (description) {
      
      let hashtagSplit = description.split(" ");

      var hashtags = [];
      
      for (i = 0; i < hashtagSplit.length; i++) {

        let hashtag = hashtagSplit[i];
    
        if (hashtag.includes("#")) {

          const encodedHashtag = encodeURIComponent(hashtag);
          hashtags.push(encodedHashtag);

        }

      }

    }

    if (!userId) {
      throw new Error('User ID not found');
    }

    if (!categoryId) {
      throw new Error('Category not selected');
    }

    const image = await Image.create({
      title: title,
      description: description,
      path:imageName,
      userId: userId,
      categoryId: categoryId,
    });

    for (let i = 0; i < hashtags.length; i++) {

      try {
        
        var newHashtag = await Hashtag.create({
          hashtag: hashtags[i],
          imageId: image.id,
        });

      } catch (error) {

        console.log("error : ", error);
      }

    }    

    res.redirect('/myImg');

  } catch (error) {

      res.render('upload', {
      messageClass: 'alert-danger',
      messages: error.message
    });

  }

});

// --------------------------------- Follow an user route ------------------------//
router.post('/follow/:id', async (req, res) => {

  try {

    const followerId = req.session.userId;
    const followingId = req.params.id;

    const follower = await User.findOne({ where: { id: followerId } });
    const following = await User.findOne({ where: { id: followingId } });

    if (!follower || !following) {

      res.status(404).send('User not found');
      return;
    }

    await follower.addFollowings(following);

    res.redirect(`back`);

  } catch (error) {

    res.status(500).send('Server error');
  }

});

// -------------------------------- Unfollow id route --------------------------- //
router.post('/unfollow/:id', async (req, res) => {

  try {

    const followerId = req.session.userId;
    const followingId = req.params.id;

    // Check if the user being unfollowed exists
    const following = await User.findOne({ where: { id: followingId } });

    if (!following) {
      res.status(404).send('User not found');
      return;
    }

    // Unfollow the user
    await Follower.destroy({ where: { followerId, followingId } });

    res.redirect(`/profile/${followingId}`);

  } catch (error) {

    res.status(500).send('Server error');
  }

});

// ----------------------------- Post a comment route ----------------------------//
router.post('/image/:id',requireAuth, async (req, res) => {

  try {

    const { id }        = req.params;
    const userId        = req.session.userId;
    const { comment }   = req.body;
    
    const image = await Image.findOne({ where: {id},attributes: ['id'], raw: true });
    
    if (!image) {
        throw new Error('Image not found');
    }
    
    Comment.create({ imageId: id, comment: comment, userId: userId })

    .then(() => console.log('Comment created successfully'))

    .catch(error => console.log('Error in Comment.create:', error));

    res.redirect(`/image/${id}`);

  } catch (error) {

    res.render('image', {
      messageClass: 'alert-danger', 
      messages: error.message
    });

  }

});

// ------------------------------------ Add vote route -------------------------- //
router.post('/save-rating', async (req, res) => {

  if (!req.session.userId) {
    // The user is not authenticated
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {

    const { imageId, rating } = req.body;

    const userId = req.session.userId;

    if (!imageId || !rating) {
      return res.status(400).json({ error: 'Both imageId and rating are required.' });
    }

    // Find the ImageScore for the image from the same user
    let imageScore = await ImageScore.findOne({
      where: { imageId: imageId, userId: userId },
    });

    if (imageScore) {

      // ImageScore already exists, update the note
      await imageScore.update({ note: rating });

    } else {

      // No ImageScore exists from this user for this image, create a new one
      imageScore = await ImageScore.create({
        note: rating,
        imageId: imageId,
        userId: userId
      });

    }

    const updatedRatingData = await ImageScore.findAll({
      where: { imageId: imageId },
      attributes: [[ImageScore.sequelize.fn('avg', ImageScore.sequelize.col('note')), 'average'],
      [ImageScore.sequelize.fn('count', ImageScore.sequelize.col('note')), 'voteCount']
    ]
    });
    
    let updatedAverage = updatedRatingData[0].getDataValue('average');
    let voteCount = updatedRatingData[0].getDataValue('voteCount');
    res.json({ success: true, average: updatedAverage, voteCount: voteCount });
  } catch (error) {

    res.json({ success: false, error: error.message });
  }

});
module.exports = router;