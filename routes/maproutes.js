const express = require('express');
const router = express.Router();
const cors = require('cors');
const {} = require('../controllers/mapscontroller');

router.use(
    cors({
        credentials: true,
        origin: "http://localhost:5173",
    })
)

module.exports = router;