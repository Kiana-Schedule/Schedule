// selectAssignments.js
// Shows checkboxes for each assignment so only selected ones are used

function renderAssignmentSelection(sectionAssignments) {
    const container = document.getElementById("mainPage");
    container.innerHTML = "<h2>Select Assignments for Today</h2>";

    sectionAssignments.forEach((assignment, index) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <input type="checkbox" id="a${index}" data-index="${index}">
            <label for="a${index}">${assignment.title}</label>
        `;
        container.appendChild(div);
    });

    const button = document.createElement("button");
    button.textContent = "Generate Day";
    button.onclick = () => generateSelectedDay(sectionAssignments);
    container.appendChild(button);
}
