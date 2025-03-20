function handleComplaint() {
    var complaintText = prompt("Please write your complaint or review request:");
    if (complaintText !== null && complaintText.trim() !== "") {
      alert("Your complaint has been sent to course instructor.");
    }
}
