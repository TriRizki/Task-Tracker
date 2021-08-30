import Task from "./Task";

const Tasks = ({ agenda, onDelete, onToggle }) => {
	return (
		<>
			{agenda.map((task, index) => (
				<Task key={index} task={task} onDelete={onDelete} onToggle={onToggle} />
			))}
		</>
	);
};

export default Tasks;
