function setTomorrowDate() {
  const currentDateEl = document.getElementById("currentDate");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  currentDateEl.textContent = tomorrow.toLocaleDateString("en-US", options);
}
setTomorrowDate();


const STORAGE_KEY = "reservedMeals";

function getReservedMeals() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveReservedMeals(meals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
}

function updateMealCardState(card, reserved) {
  const reserveBtn = card.querySelector(".reserve-btn");
  const cancelBtn = card.querySelector(".cancel-btn");
  if (reserved) {
    card.classList.add("reserved");
    reserveBtn.style.display = "none";
    cancelBtn.style.display = "inline-block";
    card.setAttribute("data-reserved", "true");
  } else {
    card.classList.remove("reserved");
    reserveBtn.style.display = "inline-block";
    cancelBtn.style.display = "none";
    card.setAttribute("data-reserved", "false");
  }
}


const reservedTitles = getReservedMeals();

document.querySelectorAll(".meal-card").forEach((card) => {
  const title = card.querySelector(".meal-title").textContent;
  const reserveBtn = card.querySelector(".reserve-btn");
  const cancelBtn = card.querySelector(".cancel-btn");

  if (reservedTitles.includes(title)) {
    updateMealCardState(card, true);
  }

  reserveBtn.addEventListener("click", () => {
    const current = getReservedMeals();
    if (!current.includes(title)) {
      current.push(title);
      saveReservedMeals(current);
    }
    updateMealCardState(card, true);
    alert("Meal reserved successfully!");
  });

  cancelBtn.addEventListener("click", () => {
    let current = getReservedMeals();
    current = current.filter((t) => t !== title);
    saveReservedMeals(current);
    updateMealCardState(card, false);
    alert("Meal reservation cancelled.");
  });
});