import userStore from "./userStore.js";

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
    const username = document.querySelector('.sign-up-form input[placeholder="Username (National ID)"]').value;
    const password = document.querySelector('.sign-up-form input[placeholder="Password"]').value;

    try {
        const response = await axios.post("http://localhost:3000/api/users/register", {
            full_name: fullName,
            username: username,
            password: password
        });

        alert(response.data.message); // پیام موفقیت
        window.location.href = "?mode=signin"; // بعد از ثبت‌نام، به صفحه لاگین بره
    } catch (error) {
        alert(error.response.data.message || "Registration failed!"); // نمایش ارور
    }
});


const loginForm = document.querySelector(".sign-in-form");
// افزودن event listener به فرم
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // جلوگیری از ارسال فرم به صورت پیش‌فرض

    const username = document.querySelector(".sign-in-form input[type='text']").value;
    const password = document.querySelector(".sign-in-form input[type='password']").value;

    try {
        // ارسال درخواست به سرور برای ورود
        const response = await axios.post('http://localhost:3000/api/users/login', {
            username,
            password
        });

        userStore.setUser(response.data.user);
        console.log(response.data);
        alert("Login successful");
        window.location.href = "../html/dashboard.html";
    } catch (error) {
        console.error("Login failed:", error);
        alert("Invalid username or password");
    }
});