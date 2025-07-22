// const API_BASE_URL = "http://localhost:5000";
const API_BASE_URL = "https://collegiumapi.kojiberi.com";

const dateInput = document.getElementById("report-date");
const restaurantSelect = document.getElementById("restaurant-select");
const mealButtons = document.querySelectorAll(".meal-time-selector button");
const tableBody = document.getElementById("report-table-body");

let selectedMeal = "lunch";

// لود اولیه
window.addEventListener("DOMContentLoaded", async () => {
  dateInput.valueAsDate = new Date(); // تاریخ امروز
  await fetchRestaurants();
  await loadReport();
});

mealButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    mealButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedMeal = btn.dataset.meal;
    loadReport();
  });
});

dateInput.addEventListener("change", loadReport);
restaurantSelect.addEventListener("change", loadReport);

async function fetchRestaurants() {
  const restaurants = ["All", "Central Dining Hall", "Campus Cafeteria", "Dorm Cafeteria"];

  restaurants.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    restaurantSelect.appendChild(opt);
  });
}

async function loadReport() {
  const date = dateInput.value;
  const restaurantId = restaurantSelect.value;

  if (!date || !restaurantId) return;

  const res = await axios.get(`${API_BASE_URL}/api/users/reservations-report`, {
    params: {
      date,
      meal_time: selectedMeal,
      restaurant_id: restaurantId
    }
  });

  renderReportTable(res.data);
}

function renderReportTable(data) {
  tableBody.innerHTML = "";
  data.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.meal_name}</td>
      <td>${item.count}</td>
    `;
    tableBody.appendChild(row);
  });
}

document.getElementById("export-btn").addEventListener("click", async() => {
  const date = dateInput.value;
  const mealTime = selectedMeal;
  const allRestaurants = ["All", "Central Dining Hall", "Campus Cafeteria", "Dorm Cafeteria"];

  const workbook = XLSX.utils.book_new();

  for (const rName of allRestaurants) {
    const res = await axios.get(`${API_BASE_URL}/api/users/reservations-report`, {
      params: {
        date,
        meal_time: mealTime,
        restaurant_id: rName
      }
    });

    const formatted = res.data.map(item => ({
      "Meal": item.meal_name,
      "Count": item.count
    }));

    const sheet = XLSX.utils.json_to_sheet(formatted);
    XLSX.utils.book_append_sheet(workbook, sheet, rName);
  }

  const fileName = `Reservations-${mealTime}-${date}.xlsx`;
  XLSX.writeFile(workbook, fileName);
});