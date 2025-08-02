const User = require('../models/user');
const {hashpassword, comparepassword} = require('../helpers/auth');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all fields and ensure password is at least 6 characters'
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        const hashedPassword = await hashpassword(password);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: `Server error: ${error.message}`
        });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userEXISTS = await User.findOne({ email });

        if (!userEXISTS) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const match = await comparepassword(password, userEXISTS.password);

        if (match) {
            jwt.sign(
                {
                    email: userEXISTS.email,
                    id: userEXISTS._id,
                    name: userEXISTS.name
                },
                process.env.JWT_SECRET,
                {},
                (err, token) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({
                            success: false,
                            message: 'Token generation failed'
                        });
                    }

                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none'
                    }).status(200).json({
                        success: true,
                        message: 'Login successful',
                        data: {
                            name: userEXISTS.name,
                            email: userEXISTS.email,
                            token: token
                        }
                    });
                }
            );
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: `Server error`
        });
    }
}

const getProfile = async (req, res) => {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) {
                console.error(err);
                return res.status(401).json({ success: false, message: 'Invalid token' });
            }
            res.json({
                success: true,
                message: 'Profile retrieved',
                data: user
            });
        });
    } else {
        res.status(401).json({ success: false, message: 'No token provided' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
}