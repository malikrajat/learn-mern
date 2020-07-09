const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true, minlength: 5 },
	displayName: { type: String },
});
module.exports = userModel = mongoose.model("user", userSchema);
