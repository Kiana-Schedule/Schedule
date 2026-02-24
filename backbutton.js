// backButton.js
// Adds a Back button to clear generated day and return to selection

function addBackButton() {
    const container = document.getElementById("schedule");
    const backBtn = document.createElement("button");
    backBtn.textContent = "Back";
    backBtn.onclick = () => {
        container.innerHTML = ""; // Clear the day
        showPage("main"); // Return to assignment selection
    };
    container.appendChild(backBtn);
}
