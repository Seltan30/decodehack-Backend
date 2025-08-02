const express = require('express');
const router = express.Router();
const cors = require('cors');
const { registerUser,loginUser,getProfile} = require('../controllers/authcontroller');

router.use(
    cors({
        credentials: true,
        origin: "https://fastcity.vercel.app",
    })
)

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getProfile);


module.exports = router;