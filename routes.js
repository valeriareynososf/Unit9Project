const router = require("express").Router();
const { User, Course } = require('./models');
const { asyncHandler } = require('./middleware/async-handler');
const { authenticateUser } = require('./middleware/auth-user');

/* GET / return all properties and values for the currently authenticated User */
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.status(200).json({ name: user.firstName, username: user.emailAddress })
  }));

/* POST / route that will create a new user */
router.post('/users', asyncHandler(async (req, res) => {
    try {
        await User.create(req.body);
        res.location('/').status(201).end();
    } catch (error) {
        console.log("try catch error", error)
    }
    
  }));

/* GET / return all courses including the User associated with each course */
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = Course.findAll({
        include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'emailAddress']
        }
    })
    res.status(200).json(courses)
  }));



module.exports = router;