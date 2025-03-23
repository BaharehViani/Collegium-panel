import userStore from "./userStore.js";

const API_BASE_URL = "https://collegium-api-production.up.railway.app";

document.addEventListener("DOMContentLoaded", function () {
  const user = userStore.getUser();
  console.log("User data:", user);
  if (!user || !user.username) {
    alert("User not logged in!");
    window.location.href = "../index.html";
    return;
  }

  document.getElementById("name").value = user.full_name || "";
  document.getElementById("username").value = user.username || "";
  document.getElementById("birthdate").value = user.birth_date || "";
  document.getElementById("mobile").value = user.phone_number || "";

  const passwordField = document.getElementById("password");
  passwordField.value = "••••••••";
  passwordField.dataset.fake = "true";

  passwordField.addEventListener("focus", function () {
    if (this.dataset.fake === "true") {
      this.value = "";
      this.dataset.fake = "false";
    }
  });

  const profilePic = document.querySelector(".profile-pic");
  if (user.photo) {
    profilePic.src = user.photo;
  } else {
    profilePic.src = "../assets/img/primary_pic.JPG";
  }

  const editBtn = document.getElementById("edit-btn");
  const saveBtn = document.getElementById("save-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  const deleteBtn = document.getElementById("delete-account-btn");
  const changePhotoBtn = document.getElementById("change-photo-btn");
  const photoInput = document.getElementById("photo-input");
  const inputs = document.querySelectorAll(".profile-form input");

  let originalValues = {};
  let originalPhotoSrc = profilePic.src;

  editBtn.addEventListener("click", () => {
    inputs.forEach(input => {
      originalValues[input.id] = input.value;
      input.disabled = false;
    });
    originalPhotoSrc = profilePic.src;

    editBtn.classList.add("hidden");
    deleteBtn.classList.add("hidden");
    saveBtn.classList.remove("hidden");
    cancelBtn.classList.remove("hidden");
    changePhotoBtn.classList.remove("hidden");
  });

  cancelBtn.addEventListener("click", () => {
    inputs.forEach(input => {
      input.value = originalValues[input.id];
      input.disabled = true;
    });
    profilePic.src = originalPhotoSrc;

    editBtn.classList.remove("hidden");
    deleteBtn.classList.remove("hidden");
    saveBtn.classList.add("hidden");
    cancelBtn.classList.add("hidden");
    changePhotoBtn.classList.add("hidden");
  });

  saveBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    const updatedUserData = {
      full_name: document.getElementById("name").value,
      username: document.getElementById("username").value,
      birth_date: document.getElementById("birthdate").value,
      phone_number: document.getElementById("mobile").value,
    };

    const newPassword = passwordField.value;
    if (newPassword && passwordField.dataset.fake === "false") {
      updatedUserData.password = newPassword;
    }

    const file = photoInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async function () {
        updatedUserData.photo = reader.result;
        await sendUpdateRequest(updatedUserData);
      };
      reader.readAsDataURL(file);
    } else {
      await sendUpdateRequest(updatedUserData);
    }
  });

  async function sendUpdateRequest(updatedUserData) {
    try {
      const detailsResponse = await axios.patch(`${API_BASE_URL}/api/users/${user.id}`, updatedUserData, {
        headers: { "Content-Type": "application/json" }
      });
  
      if (detailsResponse.status === 200) {
        alert("Changes saved successfully!");
        userStore.setUser({ ...user, ...detailsResponse.data.user });
        if (detailsResponse.data.user.photo) {
          profilePic.src = detailsResponse.data.user.photo;
          document.querySelector(".profile-content img").src = detailsResponse.data.user.photo;
        }
        if (detailsResponse.data.user.full_name) {
          document.querySelector(".profile_name").textContent = detailsResponse.data.user.full_name;
        }
      } else {
        alert(detailsResponse.data.message || "Error saving changes!");
      }
    } catch (error) {
      console.error("Error saving profile changes!", error);
      alert("Error saving profile changes!");
    }
  
    inputs.forEach(input => input.disabled = true);
    editBtn.classList.remove("hidden");
    deleteBtn.classList.remove("hidden");
    saveBtn.classList.add("hidden");
    cancelBtn.classList.add("hidden");
    changePhotoBtn.classList.add("hidden");
  }

  changePhotoBtn.addEventListener("click", () => {
    photoInput.click();
  });

  photoInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profilePic.src = e.target.result;
      }
      reader.readAsDataURL(file);
    }
  });

  deleteBtn.addEventListener("click", async function () {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/api/users/${user.id}`);
        
        if (response.status === 200) {
          alert("Account deleted successfully.");
          userStore.logout(); // پاک کردن اطلاعات کاربر از استور
          window.location.href = "../index.html"; // بازگشت به صفحه اصلی
        } else {
          alert(response.data.message || "Error deleting account.");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again.");
      }
    }
  });
  
});