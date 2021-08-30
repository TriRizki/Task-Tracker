import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import About from "./components/About";

const App = () => {
	const [showAddTask, setShowAddTask] = useState(false);
	const [agenda, setTasks] = useState([]);

	useEffect(() => {
		const getTasks = async () => {
			const tasksFromServer = await fetchTasks();
			setTasks(tasksFromServer);
		};

		getTasks();
	}, []);

	// Fetch Tasks
	const fetchTasks = async () => {
		const res = await fetch("http://localhost:5000/agenda");
		const data = await res.json();

		return data;
	};

	// Fetch Task
	const fetchTask = async (id) => {
		const res = await fetch(`http://localhost:5000/agenda/${id}`);
		const data = await res.json();

		return data;
	};

	// Add Task
	const addTask = async (task) => {
		const res = await fetch("http://localhost:5000/agenda", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(task),
		});

		const data = await res.json();

		setTasks([...agenda, data]);

		// const id = Math.floor(Math.random() * 10000) + 1
		// const newTask = { id, ...task }
		// setTasks([...agenda, newTask])
	};

	// Delete Task
	const deleteTask = async (id) => {
		const res = await fetch(`http://localhost:5000/agenda/${id}`, {
			method: "DELETE",
		});
		//We should control the response status to decide if we will change the state or not.
		res.status === 200
			? setTasks(agenda.filter((task) => task.id !== id))
			: alert("Error Deleting This Task");
	};

	// Toggle Reminder
	const toggleReminder = async (id) => {
		const taskToToggle = await fetchTask(id);
		const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder };

		const res = await fetch(`http://localhost:5000/agenda/${id}`, {
			method: "PUT",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(updTask),
		});

		const data = await res.json();

		setTasks(
			agenda.map((task) =>
				task.id === id ? { ...task, reminder: data.reminder } : task
			)
		);
	};

	return (
		<Router>
			<div className="container">
				<Header
					onAdd={() => setShowAddTask(!showAddTask)}
					showAdd={showAddTask}
				/>
				<Route
					path="/"
					exact
					render={(props) => (
						<>
							{showAddTask && <AddTask onAdd={addTask} />}
							{agenda.length > 0 ? (
								<Tasks
									agenda={agenda}
									onDelete={deleteTask}
									onToggle={toggleReminder}
								/>
							) : (
								"No Tasks To Show"
							)}
						</>
					)}
				/>
				<Route path="/about" component={About} />
				<Footer />
			</div>
		</Router>
	);
};

export default App;
