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


document.getElementById("numberInput").addEventListener("input", function () {
    if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
    }
});
