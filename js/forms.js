// JavaScript for handling the form submission
function handleSubmit(event) {
    event.preventDefault(); // Prevent the default form submission
    
    // Here you could add further validation or send an AJAX request
    
    // Alert to let the user know the form has been submitted
    alert("Your request has been submitted successfully!");
    
    // Optionally, reset the form after submission
    document.getElementById("requestForm").reset();
    
    return false;
}