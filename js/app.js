  document.addEventListener('DOMContentLoaded', () => {
        const newTaskInput = document.getElementById('newTaskInput');
        const addTaskButton = document.getElementById('addTaskButton');    
           
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
 // Function to add a new task
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
                        <input type="text" class="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 hidden task-edit-input">
                        <span class="flex-1 text-lg task-text">${task.text}</span>
                        <button data-id="${task.id}" class="text-blue-500 hover:text-blue-700 ml-4 focus:outline-none edit-task">
                            <i class="ri-edit-line text-xl"></i>
                        </button>
                        <button data-id="${task.id}" class="text-blue-500 hover:text-blue-700 ml-4 focus:outline-none valide-edit-task hidden">
                            <i class="ri-check-line text-xl"></i>
                        </button>

                        <button data-id="${task.id}" class="text-red-500 hover:text-red-700 ml-4 focus:outline-none delete-task">
                            <i class="ri-delete-bin-line text-xl"></i>
                        </button>
                    `;
                    taskList.appendChild(taskItem);

                     const checkbox = taskItem.querySelector(`input[type="checkbox"][data-id="${task.id}"]`);
                    const deleteTaskBtn = taskItem.querySelector(`button.delete-task[data-id="${task.id}"]`);
                    const editTaskBtn = taskItem.querySelector(`button.edit-task[data-id="${task.id}"]`);
                    const taskTextSpan = taskItem.querySelector('.task-text');
                    const taskEditInput = taskItem.querySelector('.task-edit-input');
                    const validEditTaskBtn = taskItem.querySelector(`button.valide-edit-task[data-id="${task.id}"]`);
                    // Add event listener for checkbox
                    taskItem.querySelector(`input[type="checkbox"][data-id="${task.id}"]`).addEventListener('change', function() {
                        toggleTaskCompletion(task.id, this.checked);
                    });

                    // Add event listener for delete button
                    taskItem.querySelector(`button.delete-task[data-id="${task.id}"]`).addEventListener('click', () => {
                        deleteTask(task.id);
                    });

                    // Add event listener for update button
                    taskItem.querySelector(`button.edit-task[data-id="${task.id}"]`).addEventListener('click', () => {
                         toggleEditMode(task.id, taskTextSpan, taskEditInput, editTaskBtn, deleteTaskBtn,validEditTaskBtn);
                    });
                    validEditTaskBtn.addEventListener('click',()=>{
                        togleEdit(task.id,taskEditInput.value.trim())
                        
                    })

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

function togleEdit(id,text){
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex].text = text;
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
 function toggleEditMode(id, textSpan, editInput, editBtn, deleteBtn,validEditTaskBtn) {
                // If currently in display mode, switch to edit mode
        if (textSpan.classList.contains('flex-1')) { // Check for a class unique to display mode
                textSpan.classList.add('hidden');
                editInput.classList.remove('hidden');

                
                editInput.value = textSpan.textContent; // Populate input with current text
                editInput.focus(); // Focus on the input for immediate typing

                validEditTaskBtn.classList.remove('hidden')
                validEditTaskBtn.classList.remove('text-blue-500');
                validEditTaskBtn.classList.add('text-green-500', 'hover:text-green-700'); // Green for save
                editBtn.classList.add('hidden')
                deleteBtn.classList.add('hidden'); // Hide delete button during edit
                }
                // If currently in edit mode, switch back to display mode
    
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