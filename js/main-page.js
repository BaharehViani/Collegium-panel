import userStore from "./userStore.js";

let arrow = document.querySelectorAll(".arrow");
for (var i = 0; i < arrow.length; i++) {
    arrow[i].addEventListener("click", (e)=>{
        let arrowParent = e.target.parentElement.parentElement; //selecting main parent of arrow
        arrowParent.classList.toggle("showMenu");
    });
}
let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".bx-menu");
sidebarBtn.addEventListener("click", ()=>{
    sidebar.classList.toggle("close");
});

document.querySelectorAll("#logout-btn").forEach(btn => {
    btn.addEventListener("click", function (event) {
        event.preventDefault(); 
        userStore.logout();
        window.location.href = "../index.html";
    });
});