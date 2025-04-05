function handleSubmit(event) {
    event.preventDefault(); 
    alert("Your request has been submitted successfully!");
    document.getElementById("requestForm").reset();
    return false;
}