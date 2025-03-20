document.addEventListener("DOMContentLoaded", function () {
    const editBtn = document.getElementById("edit-btn");
    const saveBtn = document.getElementById("save-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    const changePhotoBtn = document.getElementById("change-photo-btn");
    const photoInput = document.getElementById("photo-input");
    const profilePic = document.querySelector(".profile-pic");
    const inputs = document.querySelectorAll(".profile-form input");
    
    let originalValues = {};
    let originalPhotoSrc = profilePic.src;
    
    // When "Edit" is clicked, store the original field values and enable editing
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
    
    // "Cancel" will revert to original values and disable inputs again
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
    
    // "Save" action – place AJAX or form submission logic here; for now we just show an alert.
    saveBtn.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent actual form submission
      alert("Changes saved successfully!");
      
      inputs.forEach(input => {
        input.disabled = true;
      });
      editBtn.classList.remove("hidden");
      saveBtn.classList.add("hidden");
      cancelBtn.classList.add("hidden");
      changePhotoBtn.classList.add("hidden");
    });
    
    // Trigger file input when "Change Photo" button is pressed
    changePhotoBtn.addEventListener("click", () => {
      photoInput.click();
    });
    
    // Preview the new photo when a file is selected
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
  