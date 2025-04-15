import userStore from "./userStore.js";

// const API_BASE_URL = "https://collegium-api.up.railway.app";
const API_BASE_URL = "http://localhost:3000";

const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get("mode");
if (mode === "signup") {
    container.classList.add("sign-up-mode");
}

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});



const signupForm = document.getElementById("signup-form");
signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // گرفتن مقادیر ورودی‌ها
    const fullName = document.querySelector('.sign-up-form input[placeholder="FullName"]').value;
    const username = document.querySelector('.sign-up-form input[placeholder="National ID (Username)"]').value;
    const major = document.querySelector('.sign-up-form input[placeholder="Field of Study"]').value;
    const password = document.querySelector('.sign-up-form input[placeholder="Password"]').value;

    try {
        const response = await axios.post(`${API_BASE_URL}/api/users/register`, {
            full_name: fullName,
            username: username,
            major: major,
            password: password,
            role: "Student"
        });

        alert(response.data.message); 
        window.location.href = "?mode=signin"; 
    } catch (error) {
        alert(error.response.data.message || "Registration failed!"); 
    }
});


const loginForm = document.querySelector(".sign-in-form");
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.querySelector(".sign-in-form input[type='text']").value;
    const password = document.querySelector(".sign-in-form input[type='password']").value;

    try {
        const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
            username,
            password
        });

        userStore.setUser(response.data.user);
        alert("Login successful");
        if (response.data.user.role === "Student") {
            window.location.href = "../html/dashboard.html";
        } else {
            window.location.href = "../html/dashboard-admin.html";
        }
        
    } catch (error) {
        console.error("Login failed:", error);
        alert("Invalid username or password");
    }
});