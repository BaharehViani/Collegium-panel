import userStore from "./userStore.js";
const user = userStore.getUser();

// const API_BASE_URL = "http://localhost:5000";
const API_BASE_URL = "https://collegiumapi.kojiberi.com";

const STORAGE_KEY = "reservedMeals";

const restaurantSelect = document.getElementById("restaurant-select");
const reservationTitle = document.getElementById("reservation-title");

// function getReservedMeals() {
//   const data = localStorage.getItem(STORAGE_KEY);
//   return data ? JSON.parse(data) : [];
// }

// function saveReservedMeals(meals) {
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
// }

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

// const reservedTitles = getReservedMeals();

document.querySelectorAll(".meal-card").forEach((card) => {
  const title = card.querySelector(".meal-title").textContent;
  const reserveBtn = card.querySelector(".reserve-btn");
  const cancelBtn = card.querySelector(".cancel-btn");

  // if (reservedTitles.includes(title)) {
  //   updateMealCardState(card, true);
  // }

  reserveBtn.addEventListener("click", async () => {
    const price = getPriceFromCard(card);
    const balance = getBalance();

    if (balance >= price) {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/users/reservation`, {
          meal_name: title,
          meal_type: card.closest(".meal-category").querySelector("h3").textContent,
          cafeteria_name: restaurantSelect.options[restaurantSelect.selectedIndex].text,
          reservation_date: selectedDate,
          user_id: user._id,
        });
        card.dataset.reservationId = response.data._id;
        setBalance(balance - price);
        updateMealCardState(card, true);
        alert("Meal reserved successfully!");
      } catch (error) {
        console.error(error);
        alert("Error reserving meal. Please try again.");
      }
    } else {
      alert("Insufficient balance to reserve this meal.");
    }
  });


  cancelBtn.addEventListener("click", async () => {
    // let current = getReservedMeals();
    // if (current.includes(title)) {
    const reservationId = card.dataset.reservationId;
    if (!reservationId) {
      alert("Reservation ID not found.");
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/users/reservation/${reservationId}`, {
        data: {
          user_id: user._id,
        },
      });
    } catch (error) {
      console.error(error);
      alert("Error cancelling reservation. Please try again.");
    }
      const price = getPriceFromCard(card);
      const balance = getBalance();
      setBalance(balance + price);
      // current = current.filter((t) => t !== title);
      // saveReservedMeals(current);
      updateMealCardState(card, false);
      alert("Meal reservation cancelled.");
    //}
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

async function generateWeekDays() {
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() + i);

    const dayEl = document.createElement("div");
    dayEl.classList.add("day");
    dayEl.textContent = formatDate(dayDate);
    dayEl.dataset.date = dayDate.toISOString().split("T")[0]; // yyyy-mm-dd

    dayEl.addEventListener("click", async () => {
      
      const prevSelected = document.querySelector(".date-picker-bar .day.selected");
      if (prevSelected) prevSelected.classList.remove("selected");

      dayEl.classList.add("selected");
      selectedDate = dayEl.dataset.date;
      console.log("Selected reservation date:", selectedDate);

      updateCurrentDate(selectedDate);
      await fetchAndMarkReservedMeals(selectedDate);
    });

    datePickerBar.appendChild(dayEl);
  }

  const firstDay = datePickerBar.querySelector(".day");
  if (firstDay) {
    firstDay.classList.add("selected");
    selectedDate = firstDay.dataset.date;
    updateCurrentDate(selectedDate);
    await fetchAndMarkReservedMeals(selectedDate);
  }
}

function updateCurrentDate(dateStr) {
  const dateObj = new Date(dateStr);
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  currentDateEl.textContent = dateObj.toLocaleDateString("en-US", options);
}

generateWeekDays();


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

async function fetchAndMarkReservedMeals(date) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/reservations`, {
      params: {
        user_id: user._id,
        reservation_date: date,
      },
    });

    const reservedMeals = response.data;

    document.querySelectorAll(".meal-card").forEach((card) => {
      const title = card.querySelector(".meal-title").textContent.trim();
      const isReserved = reservedMeals.some(m => m.meal_name === title);
      updateMealCardState(card, isReserved);

      if (isReserved) {
        const found = reservedMeals.find(m => m.meal_name === title);
        card.dataset.reservationId = found._id;
      } else {
        card.removeAttribute("data-reservationId");
      }
    });

    if (reservedMeals.length > 0) {
      const cafeteriaName = reservedMeals[0].cafeteria_name;

      for (let i = 0; i < restaurantSelect.options.length; i++) {
        if (restaurantSelect.options[i].text === cafeteriaName) {
          restaurantSelect.selectedIndex = i;
          break;
        }
      }

      updateReservationTitle();
    } else {
      restaurantSelect.selectedIndex = 0;
      updateReservationTitle();
    }

  } catch (error) {
    console.error("Error fetching reserved meals", error);
  }
}