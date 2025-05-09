const renderTaskProgressData = (tasks) => { // Função para renderizar os dados de progresso das tarefas
      let taskProgress;
      const taskProgressDom = document.getElementById('task-progress');
 
      if (taskProgressDom) taskProgress = taskProgressDom;
        else { // Se o elemento não existir, cria um novo
            const newTaskProgressDom = document.createElement('div');
            newTaskProgressDom.id = 'task-progress'
            document.getElementById('todo-footer').appendChild(newTaskProgressDom);
            taskProgress = newTaskProgressDom;
        }

        const doneTask = tasks.filter(({checked}) => checked).length; // Conta o número de tarefas concluídas
        const totalTask = tasks.length; // Conta o número total de tarefas
        taskProgress.textContent = `${doneTask}/${totalTask} Concluidas`; 
        
    }

const getTasksFromLocalStorage = () => { // Função para obter as tarefas do localStorage
    const localTasks = JSON.parse(window.localStorage.getItem('tasks'));
    return localTasks ? localTasks : [];
};

const setTasksInLocalStorage = (tasks) => { // Função para armazenar as tarefas no localStorage
    window.localStorage.setItem('tasks', JSON.stringify(tasks)); // Armazena as tarefas no localStorage como uma string JSON
};

const removeTask = (taskId) => {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.filter(({id}) => parseInt(id, 10) !== parseInt(taskId)); // Filtra as tarefas para remover a tarefa com o id correspondente  
    setTasksInLocalStorage(updatedTasks)
    renderTaskProgressData(updatedTasks) // Atualiza os dados de progresso das tarefas após a remoção

    const taskElement = document.getElementById(taskId);
    if (taskElement) {
        document.getElementById('todo-list').removeChild(taskElement);
    }
};

const removeDoneTasks = () => {
    const tasks = getTasksFromLocalStorage();
    const tasksToRemove = tasks.filter(({checked}) => checked).map(({id}) => id);

    const updatedTasks = tasks.filter(({checked}) => !checked);
    setTasksInLocalStorage(updatedTasks);
    renderTaskProgressData(updatedTasks)

    tasksToRemove.forEach((taskId) => {
        const taskElement = document.getElementById(taskId);
        if (taskElement) {
            document.getElementById('todo-list').removeChild(taskElement);
        }
    });
};

const createTaskListItem = (task, checkbox) => {
    const list = document.getElementById('todo-list');
    const toDo = document.createElement('li');

    const removeTaskButton = document.createElement('button');
    removeTaskButton.textContent = 'X';
    removeTaskButton.ariaLabel = 'Remover tarefa';
    removeTaskButton.onclick = () => removeTask(task.id);

    toDo.id = task.id;
    toDo.appendChild(checkbox);
    toDo.appendChild(removeTaskButton);
    list.appendChild(toDo);

    return toDo;
};

const onCheckboxClick = (event) => {
    const [id] = event.target.id.split("-");
    const tasks = getTasksFromLocalStorage();

    const updatedTasks = tasks.map((task) =>
        parseInt(task.id, 10) === parseInt(id, 10)
            ? { ...task, checked: event.target.checked }
            : task
    );
    renderTaskProgressData(updatedTasks)
    setTasksInLocalStorage(updatedTasks);
};

const getCheckboxInput = ({id, description, checked}) => {
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const wrapper = document.createElement('div');
    const checkboxId = `${id}-checkbox`;

    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.checked = checked || false;
    checkbox.addEventListener('change', onCheckboxClick);

    label.textContent = description;
    label.htmlFor = checkboxId;

    wrapper.className = 'checkbox-label-container';
    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);

    return wrapper;
};

const getNewTaskId = () => {
    const tasks = getTasksFromLocalStorage();
    const lastId = tasks[tasks.length - 1]?.id;
    return lastId ? lastId + 1 : 1;
};

const getNewTaskData = (event) => {
    const description = event.target.elements.description.value;
    const id = getNewTaskId();
    return { description, id };
};

const getCreatedTaskInfo = (event) => new Promise((resolve) => {
    setTimeout(() => {
        resolve(getNewTaskData(event));

    },3000); // Simula um atraso de 3 segundos
});
    


const createTask = async (event) => {
    event.preventDefault();
    document.getElementById('save-task').setAttribute('disabled', true);
    const newTaskData = await getCreatedTaskInfo(event);


    const checkbox = getCheckboxInput(newTaskData);
    createTaskListItem(newTaskData, checkbox);

    const tasks = getTasksFromLocalStorage();
    const updatedTasks = [
        ...tasks,
        { id: newTaskData.id, description: newTaskData.description, checked: false }
    ];
    renderTaskProgressData(updatedTasks)
    setTasksInLocalStorage(updatedTasks);

    document.getElementById("description").value = '';
    document.getElementById("save-task").removeAttribute('disabled');
};

window.onload = function() {
    const form = document.getElementById('create-todo-form');
    form.addEventListener('submit', createTask);

    const tasks = getTasksFromLocalStorage();
    tasks.forEach((task) => {
        const checkbox = getCheckboxInput(task);
        createTaskListItem(task, checkbox);
    })

    renderTaskProgressData(tasks); // Chama a função para renderizar os dados de progresso das tarefas
}