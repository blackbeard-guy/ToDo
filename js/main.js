const formEl = document.querySelector('#form')
const taskInputEl = document.querySelector('#taskInput')
const tasksListEl = document.querySelector('#tasksList')
let tasksData = []

formEl.addEventListener('submit', (e) => {
    e.preventDefault()
    addTask()
    taskInputEl.value = ''
    showHideEmptyList()
    saveHTMLToLS()
})

function addTask() {

    const id = Date.now()
    const newTaskObj = {
        'id': id,
        'body': taskInputEl.value,
        'done': false
    }
    tasksData.push(newTaskObj)

    renderTask(newTaskObj)
}

window.addEventListener('click', (e) => {
    if(e.target.dataset.action === 'done' || e.target.dataset.action === 'repeat') {
        completeRepeatTask(e.target)
    } else if(e.target.dataset.action === 'delete') {
        deleteTask(e.target)
    } 
    showHideEmptyList()
    saveHTMLToLS()
})

function completeRepeatTask(btn) {
    const taskEl = btn.closest('li')
    const taskTextEl = btn.closest('li').querySelector('span')
    if(taskTextEl) {
        taskTextEl.classList.toggle('task-title')
        taskTextEl.classList.toggle('task-title--done')
    }

    const doneBtn = taskEl.querySelector('[data-action = "done"]')
    const repeatBtn = taskEl.querySelector('[data-action = "repeat"]')
    doneBtn.classList.toggle('none')
    repeatBtn.classList.toggle('none')

    const currentTask = tasksData.find(task => task.id == taskEl.id)
    currentTask.done = !currentTask.done // toggle boolean!!!!
}


function deleteTask(btn) {
    const taskEl = btn.closest('li')
    taskEl.remove()

    // tasksData.splice(tasksData.indexOf(tasksData.find(task => task.id == taskEl.id)), 1) // нахожу id объекта через find, нахожу индекст найденного объекта через indexOf, удаляю элемент по найденному индексу
    tasksData = tasksData.filter(task => task.id != taskEl.id) // простой спобсо удалить объект
}

window.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('TasksList')) {
        tasksData = JSON.parse(localStorage.getItem('TasksList'))
        tasksData.forEach(task => renderTask(task))
    }
    showHideEmptyList()
})

function showHideEmptyList() {
    // const activeTasks = document.querySelector('.task-title')
    // const closedTasks = document.querySelector('.task-title--done')
    const emptyListEl = document.querySelector('#emptyList')

    // if(emptyListEl && !(activeTasks || closedTasks)) {
    //     emptyListEl.classList.remove('none')
    // }
    
    // if(emptyListEl && (activeTasks || closedTasks)) {
    //     emptyListEl.classList.add('none')
    // }
    
    if(tasksData.length === 0) {
        emptyListEl.classList.remove('none')
    } else {
        emptyListEl.classList.add('none')
    }
} 

function saveHTMLToLS() {
    localStorage.setItem('TasksList', JSON.stringify(tasksData))
}

function renderTask(task) {
    const newTask = `<li id=${task.id} class="list-group-item d-flex justify-content-between task-item">
            <span class="${task.done ? 'task-title--done' : 'task-title'}">${task.body}</span>
            <div class="task-item__buttons">
                <button type="button" data-action="done" class="btn-action ${task.done ? 'none' : null}">
                    <img src="./img/tick.svg" alt="Done" width="18" height="18">
                </button>
                <button type="button" data-action="repeat" class="btn-action ${task.done ? null : 'none'}">
                    <img src="./img/repeat.svg" alt="Repeat" width="18" height="18">
                </button>
                <button type="button" data-action="delete" class="btn-action">
                    <img src="./img/cross.svg" alt="Done" width="18" height="18">
                </button>
            </div>
        </li>`

    tasksListEl.insertAdjacentHTML('beforeend', newTask)
}