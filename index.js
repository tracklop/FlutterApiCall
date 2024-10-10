const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const app = express();
const port = 4000;

const DATA_FILE = "./tasks.json";

app.use(cors());
app.use(express.json());

async function readTasks() {
	try {
		const data = await fs.readFile(DATA_FILE, "utf8");
		try {
			return JSON.parse(data);
		} catch (parseErr) {
			return [];
		}
	} catch (err) {
		if (err.code === "ENOENT") {
			return [];
		} else {
			throw err;
		}
	}
}

async function writeTasks(tasks) {
	await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));
}

app.get("/tasks", async (req, res) => {
	try {
		const tasks = await readTasks();
		res.json(tasks);
	} catch (err) {
		res.status(500).json({ error: "Impossible de lire les tâches" });
	}
});

app.post("/tasks", async (req, res) => {
	try {
		const tasks = await readTasks();
		const newTask = {
			id: Date.now().toString(),
			title: req.body.title,
			completed: false,
		};
		tasks.push(newTask);
		await writeTasks(tasks);
		res.status(201).json(newTask);
	} catch (err) {
		res.status(500).json({ error: "Impossible d'ajouter la tâche" });
	}
});

app.patch("/tasks/:id", async (req, res) => {
	try {
		const tasks = await readTasks();
		const taskId = req.params.id;
		const task = tasks.find((t) => t.id === taskId);
		if (!task) {
			return res.status(404).json({ error: "Tâche non trouvée" });
		}
		task.completed =
			req.body.completed !== undefined ? req.body.completed : task.completed;
		await writeTasks(tasks);
		res.json(task);
	} catch (err) {
		res.status(500).json({ error: "Impossible de mettre à jour la tâche" });
	}
});

app.delete("/tasks/:id", async (req, res) => {
	try {
		const tasks = await readTasks();
		const taskId = req.params.id;
		const index = tasks.findIndex((t) => t.id === taskId);
		if (index === -1) {
			return res.status(404).json({ error: "Tâche non trouvée" });
		}
		const deletedTask = tasks.splice(index, 1)[0];
		await writeTasks(tasks);
		res.json(deletedTask);
	} catch (err) {
		res.status(500).json({ error: "Impossible de supprimer la tâche" });
	}
});

app.listen(port, () => {
	console.log(`Le serveur fonctionne sur le port ${port}`);
});

module.exports = app;
