const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

let tasks = [];
let currentId = 1;

app.get("/tasks", (req, res) => {
	res.json(tasks);
});

app.post("/tasks", (req, res) => {
	const { title } = req.body;

	if (!title) {
		return res.status(400).json({ error: "Le titre est requis" });
	}

	const task = {
		id: currentId++,
		title: title,
		completed: false,
	};

	tasks.push(task);
	res.status(201).json(task);
});

app.patch("/tasks/:id", (req, res) => {
	const id = parseInt(req.params.id);
	const { completed } = req.body;

	const task = tasks.find((t) => t.id === id);

	if (!task) {
		return res.status(404).json({ error: "Tâche non trouvée" });
	}

	if (typeof completed === "boolean") {
		task.completed = completed;
	}

	res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
	const id = parseInt(req.params.id);

	const index = tasks.findIndex((t) => t.id === id);

	if (index === -1) {
		return res.status(404).json({ error: "Tâche non trouvée" });
	}

	tasks.splice(index, 1);
	res.status(204).send();
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Quelque chose a mal tourné !");
});

app.listen(port, () => {
	console.log(`Serveur démarré sur le port ${port}`);
});
