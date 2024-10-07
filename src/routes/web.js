const path = require("path");
const express = require('express');
const router = express.Router();
const { getHome, setNoCacheHeaders } = require('../controller/Home/homeController');
const { loginUser, logoutUser, getRegister, registerUser } = require('../controller/Auth/authController');
const { verifyTokenFromCookie } = require("../middleware/verifyToken");
const { getReact } = require('../controller/Game/gameController');
const { updateData, getData, getSocketPage } = require("../controller/Game/gameController");

router.use(express.static(path.join(__dirname, '../public/'))); // Add this line
router.get('/Home', setNoCacheHeaders, verifyTokenFromCookie, getHome);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/register', getRegister);
router.post('/register', registerUser);

router.use('/assets', express.static(path.join(__dirname, '../public/pages/ReactJs/assets')));
router.get('/React', getReact);


router.get('/socket', getSocketPage);
router.post('/update-data', updateData);
router.get('/get-data', getData);

module.exports = { router };
