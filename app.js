//Selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const deleteBtn = document.querySelector("#trash-btn");

// Deze functie zet de taken vanuit firebase in de DOM
const firebassAddToContainer = async () => {
  let result = await getTask();

  let tasks = Object.keys(result).map((key) => ({
    id: key,
    description: result[key].description,
    done: result[key].done,
  }));
  console.log("After the tasks array", tasks);

  tasks.forEach((item) => {
    //todo div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    todoDiv.setAttribute("data-id", item.id);

    //create li
    const newTodo = document.createElement("li");
    newTodo.classList.add("todo-item");
    const liContent = document.createTextNode(`${item.description}`);
    newTodo.appendChild(liContent);
    todoDiv.appendChild(newTodo);
    todoList.appendChild(todoDiv);

    //check button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    //verwijder button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.setAttribute("id", "trash-button");
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
  });
};
firebassAddToContainer();

//Event met function die POST naar firebase wat user input is
todoButton.addEventListener("click", (e) => {
  e.preventDefault();

  if (todoInput.value.length != 0) {
    let description = todoInput.value;
    let data = { description };

    // POST
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(
      "https://wincacademydatabase.firebaseio.com/jelmer/tasks.json",
      options
    ).then((response) => {
      response.json().then((json) => {
        let id = json.name;
        console.log(json);
        addUserInputToDom(id, description);
        todoInput.value = "";
      });
    });
  }
});

// Deze functie zet de taken van de user in de DOM
const addUserInputToDom = async (id, description) => {
  let result = await getTask();

  let tasks = Object.keys(result).map((key) => ({
    id: key,
    description: result[key].description,
    done: result[key].done,
  }));

  //todo div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  todoDiv.setAttribute("data-id", id);

  //create li
  const newTodo = document.createElement("li");
  newTodo.classList.add("todo-item");
  const liContent = document.createTextNode(`${description}`);
  newTodo.appendChild(liContent);
  todoDiv.appendChild(newTodo);
  todoList.appendChild(todoDiv);

  //check button
  const completedButton = document.createElement("button");
  completedButton.innerHTML = '<i class="fas fa-check"></i>';
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);

  //verwijder button
  const trashButton = document.createElement("button");
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.setAttribute("id", "trash-button");
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);
};

//event voor delect en check button
todoList.addEventListener("click", deleteCheck);

// Deze functie target de check of delete button en verwijderd of checkt hem
function deleteCheck(e) {
  const item = e.target;

  //check mark
  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
  }

  //delete todo
  if (item.classList[0] === "trash-btn") {
    let id = item.parentElement.getAttribute("data-id");
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log(id);
    const BASE_URL = "https://wincacademydatabase.firebaseio.com/jelmer/tasks/";
    const endpoint = `${BASE_URL}${id}.json`;
    console.log(endpoint);

    fetch(endpoint, options).then((response) => {
      console.log(response);

      const todo = item.parentElement;
      todo.classList.add("fall");
      todo.addEventListener("transitionend", function () {
        todo.remove();
      });
    });
  }
}
