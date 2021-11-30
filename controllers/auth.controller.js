const { User } = require('../models/userSchema');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

class AuthController {

    static Login = async (req, res) => {
        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(400).send('User not found!')
        }

        if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
            const token = jwt.sign({
                userId: user.id,
                isAdmin: user.isAdmin
            }, process.env.JWT_SECRET, { expiresIn: '1d' }
            )
            return res.status(201).send({ user: user.email, token: token })
        }
        else {
            res.status(400).send('password is wrong!')
        }
    }
}
module.exports = AuthController;