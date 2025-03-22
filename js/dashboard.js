import userStore from "./userStore.js";

const user = userStore.getUser();

if (user && user.full_name) {
    const firstName = user.full_name.split(" ")[0];
    document.querySelector(".dashboard-header h1").textContent = `Welcome Back, ${firstName}!`;
}