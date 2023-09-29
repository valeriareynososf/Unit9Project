const router = require("express").Router();
const { User, Course }= require('./models');
const { asyncHandler, authenticateUser }= require('./middleware');

/* GET / return all properties and values for the currently authenticated User */
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.status(200).json({ name: user.firstName, username: user.emailAddress })
  }));

module.exports = router;