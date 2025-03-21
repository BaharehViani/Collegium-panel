import userStore from "./userStore.js";

document.addEventListener("DOMContentLoaded", function () {
  const user = userStore.getUser();
  console.log("User data:", user);
  if (!user || !user.username) {
    alert("User not logged in!");
    window.location.href = "../index.html"; // هدایت به صفحه لاگین
    return;
  }

  // مقداردهی اولیه به فیلدها
  document.getElementById("name").value = user.full_name || "";
  document.getElementById("username").value = user.username || "";
  document.getElementById("birthdate").value = user.birth_date || "";
  document.getElementById("mobile").value = user.phone_number || "";

  // نمایش عکس پروفایل (در صورت موجود بودن)
  const profilePic = document.querySelector(".profile-pic");
  if (user.photo) {
    profilePic.src = user.photo;
  }

  // دریافت المان‌ها از صفحه
  const editBtn = document.getElementById("edit-btn");
  const saveBtn = document.getElementById("save-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  const changePhotoBtn = document.getElementById("change-photo-btn");
  const photoInput = document.getElementById("photo-input");
  const inputs = document.querySelectorAll(".profile-form input");

  let originalValues = {};
  let originalPhotoSrc = profilePic.src;

  // وقتی روی دکمه Edit کلیک می‌شود، مقادیر اولیه ذخیره شده و حالت ویرایش فعال می‌شود
  editBtn.addEventListener("click", () => {
    inputs.forEach(input => {
      originalValues[input.id] = input.value;
      input.disabled = false;
    });
    originalPhotoSrc = profilePic.src;

    editBtn.classList.add("hidden");
    saveBtn.classList.remove("hidden");
    cancelBtn.classList.remove("hidden");
    changePhotoBtn.classList.remove("hidden");
  });

  // وقتی روی دکمه Cancel کلیک می‌شود، مقادیر قبلی بازگردانده شده و حالت ویرایش غیرفعال می‌شود
  cancelBtn.addEventListener("click", () => {
    inputs.forEach(input => {
      input.value = originalValues[input.id];
      input.disabled = true;
    });
    profilePic.src = originalPhotoSrc;

    editBtn.classList.remove("hidden");
    saveBtn.classList.add("hidden");
    cancelBtn.classList.add("hidden");
    changePhotoBtn.classList.add("hidden");
  });

  // رویداد ذخیره (Save)
  saveBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    // داده‌های متنی که کاربر ویرایش کرده (مانند نام، نام کاربری و ...)
    const updatedUserData = {
      full_name: document.getElementById("name").value,
      username: document.getElementById("username").value,
      birth_date: document.getElementById("birthdate").value,
      phone_number: document.getElementById("mobile").value,
    };

    // در صورت وارد کردن پسورد جدید
    const newPassword = document.getElementById("password").value;
    if (newPassword) {
      updatedUserData.password = newPassword;
    }
    
    try {
      const detailsResponse = await axios.put(`http://localhost:3000/api/users/${user.id}`, updatedUserData, {
        headers: { "Content-Type": "application/json" }
      });

      if (detailsResponse.status === 200) {
        alert("Changes saved successfully!");
        // بروزرسانی اطلاعات کاربر در userStore
        userStore.setUser({ ...user, ...detailsResponse.data.user });
        if (detailsResponse.data.user.photo) {
          profilePic.src = detailsResponse.data.user.photo;
        }
      } else {
        alert(detailsResponse.data.message || "Error saving changes!");
      }
    } catch (error) {
      console.error("Error saving profile changes!", error);
      alert("Error saving profile changes!");
    }

    // پایان حالت ویرایش: غیرفعال کردن ورودی‌ها و مخفی کردن دکمه‌های Save، Cancel و Change Photo
    inputs.forEach(input => input.disabled = true);
    editBtn.classList.remove("hidden");
    saveBtn.classList.add("hidden");
    cancelBtn.classList.add("hidden");
    changePhotoBtn.classList.add("hidden");
  });

  // وقتی روی دکمه Change Photo کلیک می‌شود، فایلی انتخاب می‌شود
  changePhotoBtn.addEventListener("click", () => {
    photoInput.click();
  });

  // نمایش پیش‌نمایش عکس جدید در زمان انتخاب فایل
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
});