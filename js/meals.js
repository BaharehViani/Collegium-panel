// Set today's date with the weekday
function setTomorrowDate() {
  const currentDateEl = document.getElementById("currentDate");
  const tomorrow = new Date(); 
  tomorrow.setDate(tomorrow.getDate() + 1);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  currentDateEl.textContent = tomorrow.toLocaleDateString('en-US', options);
}
setTomorrowDate();
  
// Attach event listeners for each meal card's reserve and cancel buttons
const mealCards = document.querySelectorAll(".meal-card");
  
mealCards.forEach(card => {
    const reserveBtn = card.querySelector(".reserve-btn");
    const cancelBtn = card.querySelector(".cancel-btn");
    
    reserveBtn.addEventListener("click", () => {
      card.classList.add("reserved");
      reserveBtn.style.display = "none";
      cancelBtn.style.display = "inline-block";
      card.setAttribute("data-reserved", "true");
      alert("Meal reserved successfully!");
    });
    
    cancelBtn.addEventListener("click", () => {
      card.classList.remove("reserved");
      reserveBtn.style.display = "inline-block";
      cancelBtn.style.display = "none";
      card.setAttribute("data-reserved", "false");
      alert("Meal reservation cancelled.");
    });
});