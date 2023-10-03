const router = require("express").Router();
const { User, Course } = require('./models');
const { asyncHandler } = require('./middleware/async-handler');
const { authenticateUser } = require('./middleware/auth-user');

/* GET / return all properties and values for the currently authenticated User */
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = await req.currentUser;
    res.status(200).json({ id: user.id, fristName: user.firstName, lastName: user.lastName, emailAddress: user.emailAddress })
}));

/* POST / route that will create a new user */
router.post('/users', asyncHandler(async (req, res) => {
    try {
        await User.create(req.body);
        res.location('/').status(201).end();
    } catch (error) {
        console.log("error:", error)
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors })
        } else {
            throw error
        }
    }
}));

/* GET / return all courses including the User associated with each course */
router.get('/courses', asyncHandler(async (req, res) => {

    const courses = await Course.findAll({
        include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'emailAddress']
        },
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    })
    res.status(200).json(courses)
}));

/* GET / return the corresponding course including the User associated */
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
        include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'emailAddress']
        },
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    res.status(200).json(course)
}));

/* POST/ route that will create a new course */
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {

    try {
        const newCourse = await Course.create(req.body);
        res.location(`/courses/${newCourse.id}`).status(201).end();
    } catch (error) {

        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors })
        } else {
            throw error
        }

    }

}));

/* PUT/ route that will update the corresponding course */
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {

    try {
        const user = await req.currentUser;
        const course = await Course.findByPk(req.params.id);

        if (course.userId !== user.id) {
            res.status(403).end();
        } else {
            await course.update(req.body)
            res.status(204).end();
        }

    } catch (error) {
        console.log("error:", error)
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors })
        } else {
            throw error
        }

    }

}));


/* DELETE/ route that will delete the corresponding course */
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    const user = await req.currentUser;

    if (course.userId === user.id) {
        await course.destroy()
        res.status(204).end();
    } else {
        res.status(403).end();
    }

}));



module.exports = router;