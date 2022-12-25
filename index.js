// render ADD TO DO card
const addToDoBtn = document.getElementsByClassName("todo__list-btn-add")[0];
addToDoBtn.addEventListener("click", createNewList);

// function to form a new list object
function createNewList() {
  const listID = Date.now(); // grabs the close button for editing modal
  const newList = {
    list: [],
    id: listID,
    title: "New List",
    color: getColor("random", listID),
  };
  syncToObj("list", newList, listID);
}

// function to form a new task object
function createNewTask(listID) {
  let addItemInput = document.getElementById(`item-input-${listID}`);
  if (!addItemInput.value.trim()) {
    // warn if input is empty
    addItemInput.placeholder = "pleasе add something";
    addItemInput.classList.add("todo__input-warning");
    return;
  } else {
    addItemInput.classList.remove("todo__input-warning");
    addItemInput.placeholder = "add todo item";
  }
  const newTask = {
    task: addItemInput.value,
    id: Date.now(),
    status: false,
  };
  syncToObj("task", newTask, listID);
  addItemInput.value = "";
}

function launchTotalRender() {
  let listContainer = syncFromStorage();
  listContainer.forEach((listObj) => {
    let listID = listObj.id;
    renderList(listID);
    renderTasks(listID, listObj.list);
  });
}

// function to render a given list's ui and content
function renderList(listID) {
  // render elements of our TODO list
  const toDoWrapper = document.createElement("div");
  addToDoBtn.before(toDoWrapper);
  toDoWrapper.style.backgroundColor = getColor("color", listID);
  toDoWrapper.setAttribute("id", `list-wrapper-${listID}`);
  let listTitle = document.createElement("div");
  listTitle.innerHTML = `<h2 class='todo__title'>${getTitle(listID)}</h2>`;
  listTitle.classList.add("todo__list-title");
  toDoWrapper.append(listTitle);
  const titleEdit = document.createElement("img");
  titleEdit.setAttribute("src", "./assets/edit.svg");
  titleEdit.classList.add("todo__task-icon");
  titleEdit.classList.add("todo__btn-edit");
  listTitle.append(titleEdit);

  // show remove icon on hover
  listTitle.addEventListener("mouseover", () => {
    titleEdit.classList.remove("todo__btn-edit");
    titleEdit.classList.add("todo__icon_show");
  });
  listTitle.addEventListener("mouseout", () => {
    titleEdit.classList.remove("todo__icon_show");
    titleEdit.classList.add("todo__btn-edit");
  });

  // edit Title in place
  const newTitle = document.createElement("input");
  newTitle.setAttribute("class", "todo__title-new");
  listTitle.addEventListener("click", function (event) {
    event.stopPropagation();
    newTitle.value = getTitle(listID);
    listTitle.parentNode.replaceChild(newTitle, listTitle);
    newTitle.focus();
  });

  newTitle.addEventListener("keydown", (e) => {
    if (e.key === "Enter") newTitle.blur();
  });
  // update title when focus leaves the edit fields
  newTitle.addEventListener("focusout", () => {
    updateTitleOnEvent();
  });
  function updateTitleOnEvent() {
    syncToObj("listTitle", newTitle.value, listID);
    newTitle.parentNode.replaceChild(listTitle, newTitle);
    listTitle.innerHTML = `<h2 class='todo__title'>${getTitle(listID)}</h2>`;
  }

  toDoWrapper.classList.add("todo__wrapper");
  const addWrapper = document.createElement("div");
  addWrapper.classList.add("todo__input-wrapper");
  toDoWrapper.append(addWrapper);
  const addItemInput = document.createElement("input");
  addWrapper.append(addItemInput);
  addItemInput.classList.add("todo__input");
  addItemInput.setAttribute("id", `item-input-${listID}`);
  addItemInput.setAttribute("placeholder", "add todo item"); // grabs todo input
  const addItemBtn = document.createElement("div");
  addItemBtn.innerHTML = '<img src = "./assets/add.svg"></img>';
  addWrapper.append(addItemBtn);
  addItemBtn.classList.add("todo__btn-add"); // grabs add task button
  const itemList = document.createElement("ul");
  toDoWrapper.append(itemList);
  itemList.setAttribute("id", `ul-${listID}`);
  itemList.classList.add("todo__list");

  // render color circle and show color picker on hover
  let colors = getColor("all");
  const setColor = document.createElement("div");
  toDoWrapper.append(setColor);
  setColor.classList.add("todo__list-set-color");
  const colorPicker = document.createElement("div");
  colorPicker.classList.add("todo__list-color-picker");
  setColor.addEventListener("mouseover", () => {
    toDoWrapper.append(colorPicker);
  });

  // render color wrapper and color circles
  colors.forEach((color) => {
    let colorItem = document.createElement("span");
    colorItem.classList.add("todo__list-color-item");
    colorItem.setAttribute("id", color);
    colorPicker.append(colorItem);
    colorItem.setAttribute("style", `background-color: ${color}`);
    colorItem.addEventListener("click", () => {
      toDoWrapper.style.backgroundColor = color;
      syncToObj("color", color, listID);
      colorPicker.remove();
    });
  });
  // render "delete list" icons
  const deleteList = document.createElement("div");
  toDoWrapper.append(deleteList);
  deleteList.classList.add("todo__list-delete-icon");
  deleteList.innerHTML = '<img src="./assets/delete.svg"></img>';
  // when clicking recycle bin, deletes the list
  deleteList.addEventListener("click", () => {
    toDoWrapper.remove();
    syncToObj("deleteList", "null", listID);
  });
  // when pressing "enter", adds new task
  addItemInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      createNewTask(listID);
    }
  });
  // when clicking a '+' sign, adds a new task
  addItemBtn.addEventListener("click", (e) => {
    createNewTask(listID);
  });
}

// function to check, get and generate random color
function getColor(type, listID) {
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
  if (listID) {
    storage.forEach((listObj) => {
      if (listID === listObj.id) {
        colorChoice = listObj.color;
        isColorFound = true;
      }
    });
  }
  if (isColorFound && type === "color") {
    return colorChoice;
  } else if (type === "random") {
    colorChoice = hexes[Math.floor(Math.random() * hexes.length)];
    return colorChoice;
  } else if (type === "all") {
    return hexes;
  }
}

// render a given task
const renderTasks = (listID, taskArr) => {
  // get the ul containing the list of tasks
  let itemList = document.getElementById(`ul-${listID}`);

  // reset the contents of list ul each time we call render
  itemList.innerHTML = "";

  // go through each task object inside a given list object
  taskArr.forEach((task) => {
    // create li for each task
    let li = document.createElement("li");
    li.classList.add("todo__task");
    liSpan = document.createElement("span");
    liSpan.classList.add("todo__task-wrapper");
    li.append(liSpan);
    liSpan.innerText = task.task;
    liSpan.setAttribute("id", `li-span${task.id}`);

    // create checkbox for each task
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    li.prepend(checkbox);
    itemList.append(li);

    // create edit button for each task
    const btnEdit = document.createElement("img");
    btnEdit.setAttribute("src", "./assets/edit.svg");
    btnEdit.classList.add("todo__task-icon");
    btnEdit.classList.add("todo__btn-edit");
    liSpan.after(btnEdit);

    // create input for adding tasks
    let currSpan;
    const editTask = document.createElement("input");
    editTask.setAttribute("class", "todo__task-new");
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

    // save task when the focus leaves the editing field
    editTask.addEventListener("focusout", () => editTaskOnEvent());

    function editTaskOnEvent(e) {
      syncToObj("edit", editTask.value, listID, task.id);
      editTask.parentNode.replaceChild(currSpan, editTask);
      currSpan.innerHTML = editTask.value;
    }

    // show EDIT icon on task hover
    liSpan.addEventListener("mouseover", () => {
      btnEdit.classList.remove("todo__btn-edit");
      btnEdit.classList.add("todo__icon_show");
    });
    liSpan.addEventListener("mouseout", () => {
      btnEdit.classList.remove("todo__icon_show");
      btnEdit.classList.add("todo__btn-edit");
    });

    // render 'delete' icon and functionality
    const btnDelete = document.createElement("img");
    btnDelete.setAttribute("src", "./assets/remove.svg");
    btnDelete.classList.add("todo__task-icon");
    btnDelete.addEventListener("click", function (event) {
      event.stopPropagation();
      syncToObj("delete", "null", listID, task.id);
    });
    li.append(btnDelete);

    // mark as done
    if (task.status) {
      li.classList.add("completed");
      checkbox.checked = true;
    }
    checkbox.addEventListener("click", function () {
      syncToObj("status", "null", listID, task.id);
    });
  });
};

function syncToObj(type, data, listID, taskID) {
  let storage = syncFromStorage();

  // add new list to our object
  if (type === "list") {
    storage.push(data);
    syncToStorage(storage);
    renderList(listID);
    return;
  } else if (listID) {
    // if list ID is present, go through list objects
    storage.forEach((listObj, index) => {
      // add new task
      if (listID === listObj.id && type === "task") {
        listObj.list.push(data);
        renderTasks(listID, listObj.list);
        return;
      } else if (listID === listObj.id && type === "color") {
        // set new color
        listObj.color = data;
        renderTasks(listID, listObj.list);
        return;
      } else if (listID === listObj.id && type === "listTitle") {
        // set new list title
        listObj.title = data;
        renderTasks(listID, listObj.list);
        return;
      } else if (type === "deleteList" && listID == listObj.id) {
        storage.splice(index, 1);
        return;
      } else if (taskID) {
        // if task ID is present, go through task objects
        listObj.list.forEach((taskObj, index) => {
          // delete task from a list
          if (type === "delete" && data === "null" && taskObj.id === taskID) {
            listObj.list.splice(index, 1);
            renderTasks(listID, listObj.list);
            return;
          } else if (type === "edit" && taskObj.id == taskID) {
            // save the edited task in the list
            taskObj.task = data;
            renderTasks(listID, listObj.list);
            return;
          } else if (
            type === "status" &&
            data === "null" &&
            taskObj.id === taskID
          ) {
            // flip 'completed' status
            taskObj.status = !taskObj.status;
            renderTasks(listID, listObj.list);
            return;
          }
        });
      }
    });
  }
  syncToStorage(storage);
}

// gets the title of a list
function getTitle(listID) {
  storage = syncFromStorage();
  let result;
  storage.forEach((listObj) => {
    if (listID == listObj.id) {
      result = listObj.title;
    }
  });
  return result;
}

// write our storage item to local storage
function syncToStorage(storage) {
  localStorage.setItem("todo-list", JSON.stringify(storage));
}

// get storage item from local storage and set empty array if it's empty
function syncFromStorage() {
  let storage = JSON.parse(localStorage.getItem("todo-list"));
  if (!storage) {
    localStorage.setItem("todo-list", JSON.stringify([]));
    storage = [];
  }
  return storage;
}

launchTotalRender();
