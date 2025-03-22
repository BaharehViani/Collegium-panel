import userStore from "./userStore.js";

const user = userStore.getUser();
if (user) {
        document.querySelector(".profile_name").textContent = user.full_name || "Unknown User";
        document.querySelector(".job").textContent = user.role || "Student";
        document.querySelector(".profile-content img").src = user.photo || "../assets/img/primary_pic.JPG";
}

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

function toggleSidebarBasedOnWidth() {
    const sidebar = document.querySelector(".sidebar");
    
    if (window.outerWidth < 1361) {
      sidebar.classList.add("close");  
    } else {
      sidebar.classList.remove("close"); 
    }
}

toggleSidebarBasedOnWidth();
window.addEventListener("resize", toggleSidebarBasedOnWidth);