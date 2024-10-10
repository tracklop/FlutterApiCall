const express = require("express");
const app = express();
const PORT = 4000;

app.get("/home", (req, res) => {
	res.status(200).json("Welcome, your app is working well");
});

app.get("/fake-data", (req, res) => {
	const fakeData = {
		id: 1,
		name: "John Doe",
		email: "johndoe@example.com",
		age: 30,
		job: "Full Stack Developer",
	};

	res.json(fakeData);
});

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
