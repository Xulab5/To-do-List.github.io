

//if user had remove the sample task it would not be shown
if(localStorage.getItem("sample") !==null){
    document.getElementById("sample").remove();
}
//document.getElementById("save").addEventListener("click",storeTaskInLocalStorage);
window.onbeforeunload = function () {
    storeTaskInLocalStorage();
};

//show all task saved
window.onload=()=>{
    let taskPending = JSON.parse(localStorage.getItem("tasks"))
    if(taskPending !==null && taskPending.length)
    taskPending.forEach(t=> {
        createTask(t[0], t[1],t[2] );
    });
}

var moreIcon= [...document.getElementsByClassName("more")];//ensures it returns an array
var modal = document.getElementById("myModal");
var closeIcon =modal.querySelector(".modal-content .modal-header .fa-window-close");

//display modal
document.getElementsByClassName("fa-plus-square")[0].addEventListener("click",function(){
    let formTitle = document.getElementById("task-title").value="";
     document.getElementById("task-desc").value="";
    modal.style.display="block";
});
//changes the icon on clicked
moreIcon.forEach( moreNode => moreNode.addEventListener("click",more))

closeIcon.addEventListener("mouseover",function(){
    if(this.classList.contains("far")){
        this.classList.remove("far");
        this.classList.add("fas");
    }
})
closeIcon.addEventListener("mouseout",function(){
    if(this.classList.contains("fas")){
        this.classList.remove("fas");
        this.classList.add("far");
    }
})
closeIcon.addEventListener("click", function(){
    modal.style.display="none";
    
})
//will close the modal only if the content of the modal is not clicked
modal.addEventListener("click",function(e){
    if(e.target==this){
        e.target.style.display="none";
    }
})

document.getElementById("createBtn").addEventListener("click", ()=>createTask(document.getElementById("task-title").value,document.getElementById("task-desc").value));
document.querySelector("#taskList .header .delete").addEventListener("click",deleteTask);

function createTask(formTitle, formDesc, date){

    if(formDesc.trim() !=="" && formTitle !=="")
    {
        var liElement = document.createElement("li");
        let headerElement = document.createElement("div");
        let titleElement= document.createElement("h2");
        let moreIconElement= document.createElement("span");
        let deleteIconElement= document.createElement("span");
        let detailsElement = document.createElement("div");
        let creationDateElement = document.createElement("p");

        headerElement.classList.add("header");
        titleElement.classList.add("title");
        moreIconElement.classList.add("fas","fa-angle-down","more");
        deleteIconElement.classList.add("fas","fa-trash-alt","delete");
        detailsElement.classList.add("details");

        let titleContent = document.createTextNode(formTitle);
        let descContent = document.createTextNode(formDesc);
        let cdate = new Date();
        let creationDateContent;
        if(date === undefined){
            creationDateContent = document.createTextNode(`Created: ${cdate.toDateString()}`);
        }else creationDateContent = document.createTextNode(date);
       

        titleElement.appendChild(titleContent);
         
        creationDateElement.appendChild(creationDateContent);
       
        detailsElement.appendChild(descContent);
        detailsElement.appendChild(creationDateElement);
        headerElement.appendChild(titleElement);
        headerElement.appendChild(moreIconElement);
        headerElement.appendChild(deleteIconElement);

        liElement.appendChild(headerElement);
        liElement.appendChild(detailsElement);

        moreIconElement.addEventListener("click",more);
        deleteIconElement.addEventListener("click",deleteTask);
       document.getElementById("taskList").appendChild(liElement);

       modal.style.display="none";//close modal
    };

}//end of function createTask()

function more(){
    if(this.classList.contains("fa-angle-down")){
        this.parentNode.parentNode.getElementsByClassName("details")[0].classList.add("visible");
        this.classList.replace("fa-angle-down","fa-angle-up");
    }else{
         this.parentNode.parentNode.getElementsByClassName("details")[0].classList.remove("visible");
        this.classList.replace("fa-angle-up","fa-angle-down");
    }
}//end of function more()

function deleteTask(){
    //store a variable to the localStorage so that the sample task dont show on load
    if(this.parentNode.parentNode.id =="sample")
    localStorage.setItem("sample",false);

    this.parentNode.parentNode.remove();
}

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}//end of function

function storeTaskInLocalStorage(){

    localStorage.removeItem("tasks");
    console.log("getting tasks: "+localStorage.getItem("tasks"));
    console.log("reach after removeItem");

    let tasks= [...document.querySelectorAll("#taskList li")];//returns all tasks
    let taskToStore= [];
    tasks.forEach(t=>console.log(t));

    tasks.forEach(t=>{
        //prevents the sample task from being stored
        if( !t.hasAttribute("id") || t.id !=="sample"){
       let title= t.querySelector(".title").textContent;
       let desc = t.querySelector(".details").firstChild.textContent;
       let datecreated = t.querySelector(".details p").textContent;

       taskToStore.push([title,desc,datecreated]);
        }
    })

    
    if(taskToStore.length){
        
        if(storageAvailable("localStorage")){

            localStorage.setItem("tasks",JSON.stringify(taskToStore));
        }
    }
}//end fo function