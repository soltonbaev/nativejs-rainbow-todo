//? TASK 2
/* DESCRIPTION:
 */
//=============================================== TASK-2-SOLUTION-START
// grab our HTML elements

const addToDoBtn = document.getElementById("add-todo-btn");
// let listContainer = [];

function createNewList() {
  let storage = syncFromStorage();
  const listID = Date.now(); // grabs the close button for editing modal
  const newList = {
    list: [],
    id: listID,
    title: "New List",
    color: setRandColor(listID),
  };
  storage.push(newList);
  syncToStorage(storage);
  renderList(listID);
}
function createNewTask(listID) {
  let storage = syncFromStorage();
  addItemInput = document.getElementById(`item-input-${listID}`);

  if (!addItemInput.value.trim()) {
    addItemInput.placeholder = "pleasе add something";
    addItemInput.classList.add("placeholder-warning");
    // alert("Заполните Поле");
    return;
  } else {
    addItemInput.classList.remove("placeholder-warning");
    addItemInput.placeholder = "add todo item";
  }
  const newTask = {
    task: addItemInput.value,
    id: Date.now(),
    status: false,
  };

  storage.forEach((listObj, index) => {
    if (listID == listObj.id) {
      listObj.list.push(newTask);
      renderTasks(listID, listObj.list);
    }
  });

  syncToStorage(storage);

  addItemInput.value = "";
}

function launchTotalRender() {
  let listContainer = getDataFromStorage();
  listContainer.forEach((listObj) => {
    let listID = listObj.id;
    renderList(listID);
    renderTasks(listID, listObj.list);
  });
}

function removeListObj(listID) {
  let storage = syncFromStorage();
  storage.forEach((listObj, index) => {
    if (listID == listObj.id) {
      storage.splice(index, 1);
    }
  });
  syncToStorage(storage);
}

function renderList(listID) {
  // render elements of our TODO list
  const toDoWrapper = document.createElement("div");
  addToDoBtn.before(toDoWrapper);
  toDoWrapper.style.backgroundColor = setRandColor(listID);
  toDoWrapper.setAttribute("id", `list-wrapper-${listID}`);
  let listTitle = document.createElement("div");
  listTitle.innerHTML = `<h2 class='todo_title'>${getTitle(listID)}</h2>`;
  listTitle.classList.add("todo_list-title");
  toDoWrapper.append(listTitle);
  const titleEdit = document.createElement("img");
  titleEdit.setAttribute("src", "./assets/edit.svg");
  titleEdit.classList.add("todo_task-icon");
  titleEdit.classList.add("edit-btn");
  listTitle.append(titleEdit);

  // show remove icon on hover
  listTitle.addEventListener("mouseover", () => {
    titleEdit.classList.remove("edit-btn");
    titleEdit.classList.add("toggle");
  });
  listTitle.addEventListener("mouseout", () => {
    titleEdit.classList.remove("toggle");
    titleEdit.classList.add("edit-btn");
  });

  // edit Title in place
  const newTitle = document.createElement("input");
  newTitle.setAttribute("class", "todo_new-title");
  listTitle.addEventListener("click", function (event) {
    event.stopPropagation();
    newTitle.value = getTitle(listID);
    listTitle.parentNode.replaceChild(newTitle, listTitle);
    newTitle.focus();
  });

  newTitle.addEventListener("keydown", (e) => {
    if (e.key === "Enter") newTitle.blur();
  });
  newTitle.addEventListener("focusout", () => {
    updateTitleOnEvent();
  });
  function updateTitleOnEvent() {
    setTitle(newTitle.value, listID);
    newTitle.parentNode.replaceChild(listTitle, newTitle);
    listTitle.innerHTML = `<h2 class='todo_title'>${getTitle(listID)}</h2>`;
  }

  toDoWrapper.classList.add("todo_wrapper");
  const addWrapper = document.createElement("div");
  addWrapper.classList.add("todo_addwrapper");
  toDoWrapper.append(addWrapper);
  const addItemInput = document.createElement("input");
  addWrapper.append(addItemInput);
  addItemInput.classList.add("todo_input");
  addItemInput.setAttribute("id", `item-input-${listID}`);
  addItemInput.setAttribute("placeholder", "add todo item"); // grabs todo input
  const addItemBtn = document.createElement("div");
  addItemBtn.innerHTML = '<img src = "./assets/add.svg"></img>';
  addWrapper.append(addItemBtn);
  addItemBtn.classList.add("todo_btn"); // grabs add task button
  const itemList = document.createElement("ul");
  toDoWrapper.append(itemList);
  itemList.setAttribute("id", `ul-${listID}`);
  itemList.classList.add("todo_list");
  // set COLOR
  const setColor = document.createElement("div");
  toDoWrapper.append(setColor);
  setColor.classList.add("todo_list-set-color");
  const colorPicker = document.createElement("div");
  colorPicker.classList.add("todo_list-color-picker");
  setColor.addEventListener("mouseover", () => {
    toDoWrapper.append(colorPicker);
  });
  let colors = [
    " #CC99FF",
    "#A9D1F7",
    "#B4F0A7",
    "#FFFFBF",
    " #FFDFBE",
    "#FFB1B0",
  ];

  colors.forEach((color) => {
    let colorItem = document.createElement("span");
    colorItem.classList.add("todo_list-color-item");
    colorItem.setAttribute("id", color);
    colorPicker.append(colorItem);
    colorItem.setAttribute("style", `background-color: ${color}`);
    colorItem.addEventListener("click", () => {
      toDoWrapper.style.backgroundColor = color;
    });
  });
  // toDoWrapper.addEventListener("mouseout", () => {
  //   colorPicker.remove();
  // });
  // DELETE list
  const deleteList = document.createElement("div");
  toDoWrapper.append(deleteList);
  deleteList.classList.add("todo_img-delete-list");
  deleteList.innerHTML = '<img src="./assets/delete.svg"></img>';
  deleteList.addEventListener("click", () => {
    toDoWrapper.remove();
    removeListObj(listID);
  });
  addItemInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      createNewTask(listID);
    }
  });
  addItemBtn.addEventListener("click", (e) => {
    // e.target.stopPropagation();
    createNewTask(listID);
  });
}

function setRandColor(listID) {
  let storage = syncFromStorage();
  let colorChoice;
  let isColorFound = false;
  let hexes = [
    " #CC99FF",
    "#A9D1F7",
    "#B4F0A7",
    "#FFFFBF",
    " #FFDFBE",
    "#FFB1B0",
  ];
  console.log(listID);
  storage.forEach((listObj) => {
    console.log(listID === listObj.id);
    if (listID === listObj.id) {
      colorChoice = listObj.color;
      isColorFound = true;
    }
  });
  if (isColorFound) {
    return colorChoice;
  } else {
    colorChoice = hexes[Math.floor(Math.random() * hexes.length)];
    return colorChoice;
  }
}

const renderTasks = (listID, taskArr) => {
  itemList = document.getElementById(`ul-${listID}`);
  itemList.innerHTML = "";
  taskArr.forEach((task) => {
    // create li for each task
    let li = document.createElement("li");
    li.classList.add("todo_task");
    liSpan = document.createElement("span");
    liSpan.classList.add("todo_li-span");
    li.append(liSpan);
    liSpan.innerText = task.task;
    liSpan.setAttribute("id", `li-span${task.id}`);
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    li.prepend(checkbox);
    itemList.append(li);
    // create delete button for each task

    // create edit button for each task
    const btnEdit = document.createElement("img");
    btnEdit.setAttribute("src", "./assets/edit.svg");
    btnEdit.classList.add("todo_task-icon");
    // btnEdit.innerText = "Edit";
    btnEdit.classList.add("edit-btn");
    liSpan.after(btnEdit);
    // liSpan.addEventListener("click", function (event) {
    //   event.stopPropagation();
    //   editTask(task.id);
    // });

    const editTask = document.createElement("input");
    editTask.setAttribute("class", "todo_new-task");
    liSpan.addEventListener("click", function (event) {
      event.stopPropagation();
      editTask.value = task.task;
      currSpan = document.getElementById(`li-span${task.id}`);
      currSpan.parentNode.replaceChild(editTask, currSpan);
      editTask.focus();
    });

    editTask.addEventListener("keydown", (e) => {
      if (e.key === "Enter") editTask.blur();
    });
    editTask.addEventListener("focusout", () => editTaskOnEvent());

    function editTaskOnEvent(e) {
      editToDoTask(listID, task.id, editTask.value);
      editTask.parentNode.replaceChild(currSpan, editTask);
      currSpan.innerHTML = editTask.value;
    }

    // show EDIT icon on task hover
    liSpan.addEventListener("mouseover", () => {
      btnEdit.classList.remove("edit-btn");
      btnEdit.classList.add("toggle");
    });
    liSpan.addEventListener("mouseout", () => {
      btnEdit.classList.remove("toggle");
      btnEdit.classList.add("edit-btn");
    });

    const btnDelete = document.createElement("img");
    // btnDelete.innerText = "Delete";
    btnDelete.setAttribute("src", "./assets/remove.svg");
    btnDelete.classList.add("todo_task-icon");
    btnDelete.addEventListener("click", function (event) {
      event.stopPropagation();
      console.log(task.id);
      deleteTask(listID, task.id);
    });
    li.append(btnDelete);
    // mark as done
    if (task.status) {
      li.classList.add("completed");
      checkbox.checked = true;
    }
    checkbox.addEventListener("click", function () {
      changeStatus(listID, task.id);
    });
  });
};
function renderModal() {
  const modal = document.createElement("div");
  toDoWrapper.append(modal);
  modal.classList.add("main-modal"); // grabs the editing modal
  const editItemInput = document.createElement("input");
  modal.append(editItemInput);
  editItemInput.classList.add("inp-edit"); //grabs the input for editing modal
  const saveItemBtn = document.createElement("button");
  modal.append(saveItemBtn);
  saveItemBtn.classList.add("btn-save"); //grabs the save button for editing modal
  const closeModalBtn = document.createElement("button");
  modal.append(closeModalBtn);
  closeModalBtn.classList.add("btn-closer");
}

function setTitle(newTitle, listID) {
  storage = syncFromStorage();
  storage.forEach((listObj) => {
    if (listID == listObj.id) {
      listObj.title = newTitle;
      return;
    }
  });
  syncToStorage(storage);
}

function getTitle(listID) {
  storage = syncFromStorage();
  let result;
  storage.forEach((listObj) => {
    if (listID == listObj.id) {
      console.log(listObj);
      console.log(listObj.title);
      result = listObj.title;
    }
  });
  return result;
}

//? "CREATE" FUNCTIONALITY OF OUR CRUD IMPLEMENTATION

const setItemToStorage = (storage) => {
  // let findCurrTasks = storage.find((item) => {
  //   if (item.id === listID) return item;
  // });
  findCurrTasks.list.push(newTask);
  syncToStorage(storage);
};

//? "READ" FUNCTIONALITY OF OUR CRUDE IMPLEMENTATION

// GET DATA FROM STORAGE

const getDataFromStorage = () => {
  let listContainer = syncFromStorage();
  return listContainer;
};

//? "UPDATE" FUNCTIONALITY OF OUR CRUD IMPLEMENTATION
const changeStatus = (listID, taskID) => {
  const storage = getDataFromStorage();
  storage.forEach((listObj) => {
    if (listID == listObj.id) {
      listObj.list.forEach((taskObj, index) => {
        if (taskObj.id == taskID) {
          taskObj.status = !taskObj.status;
        }
        renderTasks(listID, listObj.list);
      });
    }
  });

  syncToStorage(storage);

  // const tasksData = getDataFromStorage();
  // const newTasksData = tasksData.map((item) => {
  //   if (item.id === id) {
  //     item.status = !item.status;
  //   }
  //   return item;
  // });
  // localStorage.setItem(taskListID, JSON.stringify(newTasksData));
  // renderTasks();
};

const editToDoTask = (listID, taskID, task) => {
  const storage = getDataFromStorage();
  storage.forEach((listObj) => {
    if (listID == listObj.id) {
      listObj.list.forEach((taskObj) => {
        if (taskObj.id == taskID) {
          taskObj.task = task;
        }
        renderTasks(listID, listObj.list);
      });
    }
  });

  syncToStorage(storage);
  // const tasksData = getDataFromStorage();
  // const itemToEdit = tasksData.find((item) => {
  //   return item.id === id;
  // });
  // console.log(itemToEdit);
  // modal.style.display = "block";
  // editItemInput.value = itemToEdit.task;
  // saveItemBtn.addEventListener("click", () => {
  //   const value = editItemInput.value;
  //   console.log(value);
  //   itemToEdit.task = value;
  //   modal.style.display = "none";
  //   const newTasksData = tasksData.map((item) => {
  //     if (item.id === id) {
  //       return itemToEdit;
  //     }
  //     return item;
  //   });
  //   localStorage.setItem(taskListID, JSON.stringify(newTasksData));
  //   renderTasks();
  // });
};

//? DELETE FUNCTIONALITY OF OUR CRUD IMPLEMENTATION

const deleteTask = (listID, taskID) => {
  const storage = getDataFromStorage();
  storage.forEach((listObj) => {
    if (listID == listObj.id) {
      listObj.list.forEach((taskObj, index) => {
        if (taskObj.id == taskID) {
          console.log("task id", taskObj.id);
          listObj.list.splice(index, 1);
        }
        renderTasks(listID, listObj.list);
      });
    }
  });

  syncToStorage(storage);
  // const taskObj = tasksData.filter((item) => {
  //   return item.id !== listID;
  // });

  // localStorage.setItem(taskListID, JSON.stringify(newTasksData));
  // renderTasks();
};

//=============================================== HELPER FUNCTIONS FOR EDITING A TODO ITEM

function syncToStorage(storage) {
  localStorage.setItem("todo-list", JSON.stringify(storage));
}
function syncFromStorage() {
  let storage = JSON.parse(localStorage.getItem("todo-list"));
  if (!storage) {
    console.log("Setting default storage if no storage is present");
    localStorage.setItem("todo-list", JSON.stringify([]));
    storage = [];
  }
  return storage;
}

// renderTasks();

// createNewList();
function launchListeners() {
  addToDoBtn.addEventListener("click", createNewList);
  // set event listener on the button that adds a todo item
  // addItemBtn.addEventListener("click", createNewTask);
  // closeModalBtn.addEventListener("click", function () {
  //   modal.style.display = "none";
  //   if (!editItemInput.value.trim()) {
  //     alert("Заполните Поле");
  //     return;
  //   }
  // });
}
launchListeners();
launchTotalRender();
