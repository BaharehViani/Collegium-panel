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
      const price = getPriceFromCard(card);
      const balance = getBalance();

      if (balance >= price) {
        // کم کردن قیمت از بالانس
        setBalance(balance - price);

        // اضافه کردن به لیست رزروها
        current.push(title);
        saveReservedMeals(current);
        updateMealCardState(card, true);
        alert("Meal reserved successfully!");
      } else {
        alert("Insufficient balance to reserve this meal.");
      }
    }
  });

  cancelBtn.addEventListener("click", () => {
    let current = getReservedMeals();
    if (current.includes(title)) {
      // بازگرداندن مبلغ به بالانس
      const price = getPriceFromCard(card);
      const balance = getBalance();
      setBalance(balance + price);

      // حذف از رزروها
      current = current.filter((t) => t !== title);
      saveReservedMeals(current);
      updateMealCardState(card, false);
      alert("Meal reservation cancelled.");
    }
  });
});
const balanceKey = "userBalance";

function getBalance() {
  return parseFloat(localStorage.getItem(balanceKey)) || 0.0;
}

function setBalance(amount) {
  localStorage.setItem(balanceKey, amount.toFixed(2));
  updateBalanceUI();
}

function updateBalanceUI() {
  const balanceAmountEl = document.getElementById("balance-amount");
  balanceAmountEl.textContent = getBalance();
}

document.getElementById("add-balance-btn").addEventListener("click", () => {
  const input = prompt("Enter the amount to add to your balance:");
  const amountToAdd = parseInt(input);

  if (isNaN(amountToAdd) || amountToAdd <= 0) {
    alert("Please enter a valid positive number.");
    return;
  }

  let currentBalance = getBalance();
  currentBalance += amountToAdd;
  setBalance(currentBalance);

  alert(`${amountToAdd} credits added to your balance!`);
});

updateBalanceUI();

const datePickerBar = document.querySelector(".date-picker-bar");
const currentDateEl = document.getElementById("currentDate");
let selectedDate = null;

function formatDate(date) {
  return date.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
}

function generateWeekDays() {
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() + i);

    const dayEl = document.createElement("div");
    dayEl.classList.add("day");
    dayEl.textContent = formatDate(dayDate);
    dayEl.dataset.date = dayDate.toISOString().split("T")[0]; // yyyy-mm-dd

    dayEl.addEventListener("click", () => {
      
      const prevSelected = document.querySelector(".date-picker-bar .day.selected");
      if (prevSelected) prevSelected.classList.remove("selected");

      dayEl.classList.add("selected");
      selectedDate = dayEl.dataset.date;
      console.log("Selected reservation date:", selectedDate);

      updateCurrentDate(selectedDate);
    });

    datePickerBar.appendChild(dayEl);
  }

  const firstDay = datePickerBar.querySelector(".day");
  if (firstDay) {
    firstDay.classList.add("selected");
    selectedDate = firstDay.dataset.date;
    updateCurrentDate(selectedDate);
  }
}

function updateCurrentDate(dateStr) {
  const dateObj = new Date(dateStr);
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  currentDateEl.textContent = dateObj.toLocaleDateString("en-US", options);
}

generateWeekDays();

const restaurantSelect = document.getElementById("restaurant-select");
const reservationTitle = document.getElementById("reservation-title");

function updateReservationTitle() {
  const selectedRestaurant = restaurantSelect.options[restaurantSelect.selectedIndex].text;
  reservationTitle.textContent = `${selectedRestaurant} Meal Reservation`;
}

restaurantSelect.addEventListener("change", () => {
  updateReservationTitle();
});

updateReservationTitle();

function getPriceFromCard(card) {
  const priceText = card.querySelector(".meal-price").textContent.trim();
  return parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
}