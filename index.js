require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
mongoose
	.connect(process.env.DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => {
		app.listen(PORT, () =>
			console.log(
				`DB connected & Server has started on localhost:${PORT}`
			)
		);
	})
	.catch((error) => {
		console.log(error);
	});

app.use("/users", require("./routes/userRouter"));
