const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
	try {
		const token = req.header("x-auth-token");
		if (!token)
			return res.status(401).json({ msg: "Token is not attached." });
		const validateToken = jwt.verify(token, process.env.JWT_KEY);
		if (!validateToken)
			return res.status(401).json({ msg: "Token is not valid." });

		req.user = validateToken.id;
		// console.log(validateToken);
		next();
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
module.exports = auth;
