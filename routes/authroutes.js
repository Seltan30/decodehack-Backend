const express = require('express');
const router = express.Router();
const cors = require('cors');
const { registerUser,loginUser,getProfile,getSkips } = require('../controllers/authcontroller');

router.use(
    cors({
        credentials: true,
        origin: "http://localhost:5173",
    })
)

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getProfile);
router.get('/skips', getSkips);


module.exports = router;