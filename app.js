//i got my atention that if i have two same todo and filter them both completed
//the second wont work!! when have time shoul be done 

const todoInput=document.querySelector('.todo-input');
const todoButton=document.querySelector('.todo-button');
let todoList=document.querySelector('.todo-list');
const filterOption=document.querySelector('.filter-todo');
const todoContainer=document.querySelector('.todo-container');

//Event Listeners
document.addEventListener("DOMContentLoaded",getLocalDateDivs);
document.addEventListener("DOMContentLoaded",getDateInputArr);
todoButton.addEventListener('click',checkIfthereIsTextBeforeAddingIt);
filterOption.addEventListener("click",filterTodo);



let dateInputArr=[]; 
let dateInputBeforeChangingBack;
let filterArrForSave=[];
//Functions

giveDatePickerAValueWhenAppIsFirstUsed();
function giveDatePickerAValueWhenAppIsFirstUsed(){
    let datePickerInput=document.getElementById('datePicker').value;
    if(!datePickerInput){
        let date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;

        let today = year + "-" + month + "-" + day;

        document.getElementById('datePicker').value = today;
    }
}

function checkIfthereIsTextBeforeAddingIt(event){
//prevent form from submitting
event.preventDefault();  

if(todoInput.value){

getDate();   
addTodo(event);
    
}
}

function getDate(){
let dateInput;


dateInput=document.getElementById('datePicker').value;

dateInputBeforeChangingBack=dateInput;

checkToCreateNewDateDiv(dateInput);

//make the date value upto date
let date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

if (month < 10) month = "0" + month;
if (day < 10) day = "0" + day;

let today = year + "-" + month + "-" + day;

document.getElementById('datePicker').value = today;
// end make the date value upto date


}

function checkToCreateNewDateDiv(dateInput){

let indexOfDateInput=dateInputArr.indexOf(dateInput);

if(indexOfDateInput===-1){
    dateInputArr.push(dateInput);
    createDateDivs(dateInput);
}

}


function createDateDivs(date){
        //create dateDivContainers
        const dateDivContainer=document.createElement('div');
        dateDivContainer.classList.add('date-div-container',date+'-date-div-container',date);


        //create choosedDate Divs
        const choosedDate=document.createElement('div');
        choosedDate.classList.add('choosed-date',date+"-choosed-date");
        choosedDate.innerText=date;
        
        

        //create uls
        const ul=document.createElement('ul');
        ul.classList.add('todo-list',date+'-todo-list');
        ul.id=(date+'-todo-list');


        whereToPutDateDiv(date,dateDivContainer);
        dateDivContainer.appendChild(choosedDate);
        dateDivContainer.appendChild(ul);
    
       //saveDateDivToLocal
       saveLocalDateDivs(date);
       saveDateInputArr(dateInputArr);
}

function whereToPutDateDiv(date,dateDivContainer){
    let dateInputArrInNumbers=[];

    dateInputArr.forEach(dateInputArrToNumbers);

    
    

    function dateInputArrToNumbers(value, index) {
        dateInputArrInNumbers[index]= Date.parse(value);
      
    }

    sortDateInputArrInNumbersNumericly(dateInputArrInNumbers,date,dateDivContainer);

};


function sortDateInputArrInNumbersNumericly(dateInputArrInNumbers,date,dateDivContainer){
    let dateInNumbers=Date.parse(date);
   
    let dateInputArrInNumbersBeforeSort=dateInputArrInNumbers.slice();//shallowcopy couse array is a reference type
    dateInputArrInNumbers.sort(function(a, b){return a - b});
    
    let indexOfDate=dateInputArrInNumbers.indexOf(dateInNumbers);
    let oneLessIndexOfDateInNumberSort=indexOfDate-1;

    let oneSmallerDate=dateInputArrInNumbers[oneLessIndexOfDateInNumberSort];

    let indexIndateInputArrInNumbersBeforeSort=dateInputArrInNumbersBeforeSort.indexOf(oneSmallerDate);

    let smallerdateInDateInputArr=dateInputArr[indexIndateInputArrInNumbersBeforeSort];
   
appendHere( smallerdateInDateInputArr,dateDivContainer);
}
function appendHere(smallerDateInDateInputArr,dateDivContainer){
   let smallerDateDiv= document.getElementsByClassName(smallerDateInDateInputArr+"-date-div-container")[0];
   let ulDiv=todoContainer;
   let lastListElement=ulDiv.lastElementChild;

    if(smallerDateDiv){
        smallerDateDiv.parentNode.insertBefore(dateDivContainer,smallerDateDiv);
  
    }else if(lastListElement){
        lastListElement.after(dateDivContainer);
        
    }
    else{todoContainer.prepend(dateDivContainer);
    }
  
}



function addTodo(event){
    let dateInput=document.getElementById('datePicker').value;
    let choosedListId=dateInputBeforeChangingBack+'-todo-list';
    let choosedList=document.getElementById(choosedListId);

    //create todoDiv
    const todoDiv=document.createElement('div');
    todoDiv.classList.add('todo');
    //create LI
    const newTodo=document.createElement('li');
    newTodo.classList.add('todo-item');
   
    newTodo.innerText=todoInput.value;
    
    todoDiv.appendChild(newTodo);

    saveLocalTodos(todoInput.value,choosedListId);
    //check mark button
    const completedButton=document.createElement('button');
    completedButton.innerHTML='<i class="fas fa-check"></i>';
    completedButton.classList.add('complete-btn');
    completedButton.addEventListener('click',deleteCheck);
    todoDiv.appendChild(completedButton);

    //check trash button
    const trashButton=document.createElement('button');
    trashButton.innerHTML='<i class="fas fa-trash"></i>';
    trashButton.classList.add('trash-btn');
    //this so the delete function works
    trashButton.addEventListener('click',deleteCheck);
    todoDiv.appendChild(trashButton);

    choosedList.appendChild(todoDiv);
   
    //creal input value
    todoInput.value="";
    
}

function deleteCheck(e){
   
const item=e.target;

//Delete
if(item.classList[0]==="trash-btn"){
const todo=item.parentElement;
let todoUl=todo.parentElement;

//Animation
todo.classList.add('fall');
removeLocalTodos(todo);

todo.addEventListener('transitionend',(event)=>{
    
        if (event.propertyName == 'transform') {
            //this helps to this transitionend event wont fire twice, only once
            todo.remove();
            removeDateDivIfThereIsNoMoreListElementAfterDeletingAList(todoUl);
        }
    
    //this space fire double outside of the above if condition
    

})

}



//Check mark
if(item.classList[0]==="complete-btn"){
    
    const todo=item.parentElement;
    todo.classList.toggle('completed');
    saveFilterArr(todo)
    }
}

function saveFilterArr(todoContainer){
    let todoDiv=todoContainer;
    let filterForSave=3;
if(filterArrForSave.indexOf(filterArrForSave)){
   
}

const choosedListId=todoDiv.parentElement.parentElement.firstElementChild.innerText;
console.log(choosedListId,"choosedList");


let todo=todoDiv.innerText;

//Check-- if i already have it
let todosWithFilter;
if(localStorage.getItem("filterForTodos")===null){
    todosWithFilter=[];
}else{
    todosWithFilter=JSON.parse(localStorage.getItem("filterForTodos"));
}

//check whether its got completed or it toggled from completed
if(todoDiv.classList[1]==="completed"||todoDiv.classList[2]==="completed"){

let todoWithChoosedListId=todo+"Ł"+choosedListId+"-todo-list"+"#"+"completed";
console.log(choosedListId,"a masodik tag");

todosWithFilter.push(todoWithChoosedListId);

console.log("filet mentes elot",todosWithFilter);
localStorage.setItem("filterForTodos",JSON.stringify(todosWithFilter));
console.log("filet mentes után",todosWithFilter);
}else{
    //removeFilterFromLocalMemoryWhenToggle-clickToCheckButton
 
    removeLocalFilterWhenToggle(todosWithFilter,todoDiv);
}


}

function removeLocalFilterWhenToggle(todosWithFilter,todoDiv){

        
        
        const todoText=todoDiv.children[0].innerText;
 
        
        const choosedDateDiv=todoDiv.parentElement.parentElement.firstElementChild;
        
        const date=choosedDateDiv.innerText;
        
        const todoInSave=todoText+"Ł"+ date+"-todo-list"+"#"+"completed";
        const indexOfTodoFilterInSave=todosWithFilter.indexOf(todoInSave);
        console.log(indexOfTodoFilterInSave);
        if(indexOfTodoFilterInSave!=-1){
        todosWithFilter.splice(indexOfTodoFilterInSave, 1);
        }
        localStorage.setItem("filterForTodos", JSON.stringify(todosWithFilter));

        console.log(todosWithFilter);

}

function removeDateDivIfThereIsNoMoreListElementAfterDeletingAList(todoUl){
   
    let doesTodoUlHasChildNodes=todoUl.hasChildNodes();
    let dateDiv=todoUl.parentElement;
    
      
      if(doesTodoUlHasChildNodes===false){
        
        removeDateFromDateInputArr(dateDiv);
        removeLocalDateDivs(dateDiv);
          dateDiv.remove();

      }
  }

  function removeDateFromDateInputArr(dateDiv){
     
    let dateForDeletinfDateDivFromDateInputArr=dateDiv.classList[2];
    let indexOfDateDivDate=dateInputArr.indexOf(dateForDeletinfDateDivFromDateInputArr);
    dateInputArr.splice(indexOfDateDivDate, 1);

    saveDateInputArr(dateInputArr);
  }



function filterTodo(element){

        let todoLists=document.querySelectorAll('.todo-list');
        todoLists.forEach((oneTodoList)=>{

            const todos=oneTodoList.childNodes;
            todos.forEach((todo)=>{
                switch(element.target.value){
                    case "all":
                        todo.style.display="flex";
                        break;
                    case "completed":
                        if(todo.classList.contains("completed")){
                            todo.style.display="flex";
                        }else{
                            todo.style.display="none";
                        }
                        break;
                    case "uncompleted":
                        if(todo.classList.contains("completed")){
                            todo.style.display="none";
                        }else{
                            todo.style.display="flex";
                        }
                        break;
                }
            })


        })


}

function saveLocalDateDivs(dateDiv){
//Check-- if i already have it
let dateDivs;
if(localStorage.getItem("dateDivs")===null){
    dateDivs=[];
}else{
    dateDivs=JSON.parse(localStorage.getItem("dateDivs"));
}
dateDivs.push(dateDiv);
localStorage.setItem("dateDivs",JSON.stringify(dateDivs));
}

function saveDateInputArr(dateInputArr){
localStorage.setItem("dateInputArr",JSON.stringify(dateInputArr));
}

function saveLocalTodos(todo,choosedListId){
//Check-- if i already have it
let todos;
if(localStorage.getItem("todos")===null){
    todos=[];
}else{
    todos=JSON.parse(localStorage.getItem("todos"));
}

let todoWithChoosedListId=todo+"Ł"+choosedListId;
todos.push(todoWithChoosedListId);

localStorage.setItem("todos",JSON.stringify(todos));

}





function getLocalDateDivs(){
    let loadedDateDivs;
    //Check-- if i already have it
    if(localStorage.getItem("dateDivs")===null){
        loadedDateDivs=[];
    }else{
        loadedDateDivs=JSON.parse(localStorage.getItem("dateDivs"));
    }

    loadedDateDivsIntoNumbers(loadedDateDivs);


//its not in the global scope!! i didnt know whether i shoul put things like this in the global
//or in a local scope, so thats why i did this this way
function loadedDateDivsIntoNumbers(loadedDateDivs){
    
    let loadedDateDivsInNumbers=[];

    loadedDateDivs.forEach(loadedDateDivsToNumbers);

    function loadedDateDivsToNumbers(value, index) {
        loadedDateDivsInNumbers[index]= Date.parse(value);
      
    }

    sortloadedDateDivs(loadedDateDivs,loadedDateDivsInNumbers);
}
    
function sortloadedDateDivs(loadedDateDivs,loadedDateDivsInNumbers){
    let newTextArrayFromLoadedDateDivs=[];
    
    let loadedDateDivsInNumbersBeforeSort=loadedDateDivsInNumbers.slice();
    
    loadedDateDivsInNumbers.sort(function(a, b){return a - b});

    loadedDateDivsInNumbers.forEach(sortTheOriginalArray);
    function sortTheOriginalArray(value,index){
let indexOfSortedElementInBeforeSort=loadedDateDivsInNumbersBeforeSort.indexOf(value);
newTextArrayFromLoadedDateDivs.push(loadedDateDivs[indexOfSortedElementInBeforeSort]);

    }
    loadDateDivsIntoPage(newTextArrayFromLoadedDateDivs);
}

function loadDateDivsIntoPage(sortedLoadedDateDivs){
    sortedLoadedDateDivs.forEach((date)=>{
        //create dateDivContainers
        const dateDivContainer=document.createElement('div');
        dateDivContainer.classList.add('date-div-container',date+'-date-div-container',date);
        
        
        //create choosedDate Divs
        const choosedDate=document.createElement('div');
        choosedDate.classList.add('choosed-date',date+"-choosed-date");
        choosedDate.dataset.date=date; 
        choosedDate.innerText=date;
        
        
        
        //create uls
        const ul=document.createElement('ul');
        ul.classList.add('todo-list',date+'-todo-list');
        ul.id=(date+'-todo-list');

        dateDivContainer.appendChild(choosedDate);
        dateDivContainer.appendChild(ul);
        todoContainer.prepend(dateDivContainer);
            })

}
    

getTodos();
}

function getTodos(){
    let todos;
    //Check-- if i already have it
    if(localStorage.getItem("todos")===null){
        todos=[];
    }else{
        todos=JSON.parse(localStorage.getItem("todos"));
    }
//console.log(todos);
    todos.forEach((todo)=>{
       
    const indexOfSeparateKey=todo.indexOf("Ł");
       

    const todoText=todo.slice(0,indexOfSeparateKey);
    const todosDateDivId=todo.slice(indexOfSeparateKey+1); 

    choosedList=document.getElementById(todosDateDivId);
            //create todoDiv
    const todoDiv=document.createElement('div');
    const addClassToTodo=todoText+"Ł"+todosDateDivId+"todo";
    todoDiv.classList.add('todo');
    todoDiv.classList.add(addClassToTodo);
    //create LI
    const newTodo=document.createElement('li');
    newTodo.innerText=todoText;
    newTodo.classList.add('todo-item');
    todoDiv.appendChild(newTodo);

    //check mark button
    const completedButton=document.createElement('button');
    completedButton.innerHTML='<i class="fas fa-check"></i>';
    completedButton.classList.add('complete-btn');
    completedButton.addEventListener('click',deleteCheck);
    todoDiv.appendChild(completedButton);

    //check trash button
    const trashButton=document.createElement('button');
    trashButton.innerHTML='<i class="fas fa-trash"></i>';
    trashButton.classList.add('trash-btn');
    trashButton.addEventListener('click',deleteCheck);
    todoDiv.appendChild(trashButton);

    //append to list
    choosedList.appendChild(todoDiv);


    })
   //ierationon kivul
   getFilterForTodo();
}

function getFilterForTodo(newTodo){

    let todos;
    //Check-- if i already have it
    if(localStorage.getItem("filterForTodos")===null){
        todos=[];
    }else{
        todos=JSON.parse(localStorage.getItem("filterForTodos"));
    }
    
    todos.forEach((todo)=>{
      
    const indexOfSeparateKey=todo.indexOf("Ł");
    const indexOfSecondSeparateKey=todo.indexOf("#");


    const todoText=todo.slice(0,indexOfSeparateKey);
    const todosDateDivId=todo.slice(indexOfSeparateKey+1,indexOfSecondSeparateKey); 
    let filterClass=todo.slice(indexOfSecondSeparateKey+1);

    const classforTodo=todoText+"Ł"+todosDateDivId+"todo";

    let todoDiv=document.getElementsByClassName(classforTodo)[0];
   
    if(filterClass==="completed"&&todoDiv!=undefined){
    todoDiv.classList.add(filterClass);
    }

    })
    
}

function getDateInputArr(){
    //dont delete, DOMContentLoaded eventlistener uses it
    
    //Check-- if i already have it
    if(localStorage.getItem("dateInputArr")!=null)
        dateInputArr=JSON.parse(localStorage.getItem("dateInputArr"));
        
}

function removeLocalTodos(todo){
//Check-- if i already have it
let todos;
if(localStorage.getItem("todos")===null){
    todos=[];
}else{
    todos=JSON.parse(localStorage.getItem("todos"));
}



const todoText=todo.children[0].innerText;
const choosedDateDiv=todo.parentElement.parentElement.firstElementChild;
const date=choosedDateDiv.innerText;

const todoInSave=todoText+"Ł"+ date+"-todo-list";

todos.splice(todos.indexOf(todoInSave), 1);
localStorage.setItem("todos", JSON.stringify(todos));


removeLocalFilterForTodos(todo);
}

function removeLocalDateDivs(dateDiv){
    //Check-- if i already have it
    let dateDivs;
    if(localStorage.getItem("dateDivs")===null){
        dateDivs=[];
    }else{
        dateDivs=JSON.parse(localStorage.getItem("dateDivs"));
    }
    
    const dateDivIndex=dateDiv.classList[2];

    dateDivs.splice(dateDivs.indexOf(dateDivIndex), 1);
    localStorage.setItem("dateDivs", JSON.stringify(dateDivs));
  
    }

    function removeLocalFilterForTodos(todo){
        //Check-- if i already have it
        let todos;
        if(localStorage.getItem("filterForTodos")===null){
            todos=[];
        }else{
            todos=JSON.parse(localStorage.getItem("filterForTodos"));
        }
        
      
        
        const todoText=todo.children[0].innerText;
        //console.log(todoText,"to");
        const choosedDateDiv=todo.parentElement.parentElement.firstElementChild;
        const date=choosedDateDiv.innerText;
        ////console.log("choosed",date);
        const todoInSave=todoText+"Ł"+ date+"-todo-list"+"#"+"completed";
        const indexOfTodoFilterInSave=todos.indexOf(todoInSave);
        console.log(indexOfTodoFilterInSave);
        if(indexOfTodoFilterInSave!=-1){
        todos.splice(indexOfTodoFilterInSave, 1);
        }
        localStorage.setItem("filterForTodos", JSON.stringify(todos));

        console.log(todos);
        
        }