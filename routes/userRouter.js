const { model } = require("mongoose");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const userRouter = require("express").Router();
const jwt = require("jsonwebtoken");

userRouter.post("/register", async (req, res) => {
	try {
		let { email, password, passwordCheck, displayName } = req.body;

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
		res.json(token);
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ error: error.message });
	}
});

module.exports = userRouter;
