  document.addEventListener('DOMContentLoaded', () => {
        const newTaskInput = document.getElementById('newTaskInput');
        const addTaskButton = document.getElementById('addTaskButton');    
            // Function to add a new task
        addTaskButton.addEventListener('click', () => {
                addTask();
        });
        newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
                    addTask();
        }
        });

            // Initial render of tasks when the page loads
        renderTasks();


        });


const API_URL='http://127.0.0.1:8000/tasks'
let tasks=[]
const taskList = document.getElementById('taskList');

// Function to render tasks from the 'tasks' array
function renderTasks(){
    axios.get(API_URL)
    .then((response)=>{
        renderTaskList(response.data)
        tasks=response.data
    }).catch((e)=>{
        console.error(e)
    })
}
function addTask() {
    const taskText = newTaskInput.value.trim();
    if (taskText === '') return;
    const newTask = {
            text: taskText,
            completed: false
        };

    
    axios.post(API_URL,newTask).then((response)=>{
        console.log(response.data)
        newTaskInput.value = '';
    
        renderTasks(); // Re-render the list
    }).catch((e)=>{
        console.error(e)
    })    
   
}


function renderTaskList(tasks=[]) {
                taskList.innerHTML = ''; // Clear existing tasks
                // Sort tasks to show incomplete ones first, then completed ones
                // Or you can choose to display newest first, etc.
                const sortedTasks = [...tasks].sort((a, b) => a.completed - b.completed);

                sortedTasks.forEach(task => {
                    const taskItem = document.createElement('div');
                    taskItem.id = `task-${task.id}`; // Add an ID to the task item for easy manipulation
                    taskItem.className = `flex items-center bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`;
                    taskItem.innerHTML = `
                        <input type="checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''} class="form-checkbox h-5 w-5 text-blue-600 rounded mr-4 cursor-pointer">
                        <span class="flex-1 text-lg">${task.text}</span>
                        
                        
                        <button data-id="${task.id}" class="text-red-500 hover:text-red-700 ml-4 focus:outline-none delete-task">
                            <i class="ri-delete-bin-line text-xl"></i>
                        </button>
                    `;
                    taskList.appendChild(taskItem);

                    // Add event listener for checkbox
                    taskItem.querySelector(`input[type="checkbox"][data-id="${task.id}"]`).addEventListener('change', function() {
                        toggleTaskCompletion(task.id, this.checked);
                    });

                    // Add event listener for delete button
                    taskItem.querySelector(`button[data-id="${task.id}"]`).addEventListener('click', () => {
                        deleteTask(task.id);
                    });
                });

            }


// Function to toggle task completion status
function toggleTaskCompletion(id, isCompleted) {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
                tasks[taskIndex].completed = isCompleted;
                console.log(tasks[taskIndex])
                updateTask(id,tasks[taskIndex])
        }
}

function updateTask(id,task){
    axios.put(`${API_URL}/${id}`,task)
    .then((r)=>{
        console.log(r.data)
        renderTasks()
    }).catch((e)=>{
        console.error(e)
    })
}

            // Function to delete a task
function deleteTask(id) {
    axios.delete(`${API_URL}/${id}`).then((r)=>{
        console.log(r.data)
        renderTasks(); // Re-render the list
    }).catch((e)=>{
        console.error(e)
    })            

}