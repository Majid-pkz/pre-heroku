const router = require('express').Router();
const { Category, Jobs, User, UserJobs } = require('../../models');

// The `/api/users` endpoint
router.get('/', async (req, res) => {
    // find all users

    try {
        const userData = await User.findAll();
        const profile = userData.map((pr) => pr.get({ plain: true }));
        res.render('profile', { profile, logged_in: req.session.logged_in });

        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    // find one user by its `id` value including all jobs applied by that user

    try {
        const userData = await User.findByPk(req.params.id, {
            include: [{ model: Jobs, through: UserJobs }]
        });


        if (!userData) {
            res.status(404).json({ message: 'No User found with this id!' });
            return;
        }

        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/', async (req, res) => {
    // create a new user
    try {
        const userData = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,

        });
        res.status(200).json(userData);
    } catch (err) {
        res.status(400).json(err);
        console.log(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        console.log(req.body)
        const userData = await User.findOne({ where: { email: req.body.email } });

        if (!userData) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        const validPassword = userData.checkPassword(req.body.password);

        if (!validPassword) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            // res.json({ user: userData, message: 'You are now logged in!' });
            res.status(200).json({ user: userData, message: "You are logged in!" })
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.put('/:id', async (req, res) => {
    // update a user by its `id` value
    try {
        console.log(req.body);
        const userData = await User.update({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            skill: req.body.skill,
        },
            {
                where: {
                    id: req.params.id,
                }
            });

        if (!userData) {
            res.status(404).json({ message: 'No user found with that id!' });
            return;
        }

        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});
router.delete('/:id', async (req, res) => {
    // delete a user by its `id` value
    try {
        const userData = await User.destroy({
            where: {
                id: req.params.id,
            },
        });

        if (!userData) {
            res.status(404).json({ message: 'No user found with that id!' });
            return;
        }

        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.status(204).end();
    });
});

module.exports = router;

// note in regards to unexpected token logout.js.  what would happen if we use this code instead of having 
//the if statemeny {{#if loged in}} in main.hadlebars . the following code copied from mini project i notice the difference between the two


// Logout
// router.post('/logout', (req, res) => {
//     // When the user logs out, destroy the session
//     if (req.session.loggedIn) {
//       req.session.destroy(() => {
//         res.status(204).end();
//       });
//     } else {
//       res.status(404).end();
//     }
//   });