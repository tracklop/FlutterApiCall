import express from "express";

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
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
	console.log(`Serveur lancé sur le port ${PORT}`);
});
