const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const userRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const tokenValidation = require("../middleware/auth");

userRouter.post("/register", async (req, res) => {
	try {
		let { email, password, passwordCheck, displayName } = req.body;
		console.log(email, password, passwordCheck, displayName);
		//validation
		if (!email || !password || !passwordCheck) {
			return res.status(400).json({ msg: "Required filled is missing." });
		}
		if (password.length < 5) {
			return res
				.status(400)
				.json({ msg: "Password must have at least 5 characters ." });
		}
		if (password != passwordCheck) {
			return res
				.status(400)
				.json({ msg: "Password must match with password again ." });
		}
		const checkForExistsUser = await userModel.findOne({ email: email });
		if (checkForExistsUser) {
			return res
				.status(400)
				.json({ msg: "Account with this email is exists." });
		}
		if (!displayName) displayName = email;

		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(password, salt);

		const newUser = new userModel({
			email,
			password: passwordHash,
			displayName,
		});

		const savedUser = await newUser.save();
		res.json(savedUser);
		// res.send("Hello, User route is working ");
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

userRouter.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password)
			return res.status(400).json({ msg: "Please enter all the info." });
		const user = await userModel.findOne({ email });
		if (!user) return res.status(400).json({ msg: "No user found." });
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(400).json({ msg: "Invalid logins." });
		const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);
		res.json({
			token,
			user: {
				id: user._id,
				displayName: user.displayName,
			},
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

userRouter.delete("/delete", tokenValidation, async (req, res) => {
	try {
		const deletedUser = await userModel.findByIdAndDelete(req.user);
		res.json(deletedUser);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

userRouter.post("/isTokenValid", async (req, res) => {
	try {
		const token = req.header("x-auth-token");
		if (!token) return res.status(204).json(false);
		const validateToken = jwt.verify(token, process.env.JWT_KEY);
		if (!validateToken) return res.status(204).json(false);
		const user = await userModel.findById(validateToken.id);
		if (!user) return res.status(204).json(false);
		res.status(200).json(true);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

userRouter.get("/", auth, async (req, res) => {
	const user = await userModel.findById(req.user);
	res.status(200).json({
		displayName: user.displayName,
		id: user._id,
	});
});

module.exports = userRouter;
