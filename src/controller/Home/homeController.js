const path = require('path'); // Add this line to import the path module
require('dotenv').config();

const setNoCacheHeaders = (req, res, next) => {
	res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
	res.setHeader('Pragma', 'no-cache');
	res.setHeader('Expires', '0');
	res.setHeader('Surrogate-Control', 'no-store');
	next();
};

const getHome = (req, res) => {
	try {
		res.sendFile(path.join(__dirname, '../../public/pages/Home/')); // Update this line to send the index.html fileFF
	} catch (err) {
		res.status(500).json({
			message: "Internal server error",
			error: err.message,
		});
	}
}

module.exports = { getHome, setNoCacheHeaders }
