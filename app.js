let assignments = JSON.parse(localStorage.getItem("assignments")) || [];

function save() {
  localStorage.setItem("assignments", JSON.stringify(assignments));
}

function addAssignment() {
  const title = document.getElementById("title").value;
  const deadline = document.getElementById("deadline").value;
  const hours = parseFloat(document.getElementById("hours").value);
  const difficulty = parseInt(document.getElementById("difficulty").value);

  assignments.push({
    id: Date.now(),
    title,
    deadline,
    hours,
    difficulty,
    progress: 0
  });

  save();
  render();
}

function updateProgress(id, value) {
  assignments = assignments.map(a => 
    a.id === id ? {...a, progress: value} : a
  );
  save();
  render();
}

function daysUntil(deadline) {
  const diff = new Date(deadline) - new Date();
  return diff / (1000 * 60 * 60 * 24);
}

function render(filter="main") {
  const container = document.getElementById("mainPage");
  container.innerHTML = "";

  assignments.forEach(a => {
    const daysLeft = daysUntil(a.deadline);
    let show = false;

    if(filter==="main") show = true;
    if(filter==="urgent" && daysLeft <= 4 && a.progress < 100) show = true;
    if(filter==="25" && a.progress===25) show = true;
    if(filter==="50" && a.progress===50) show = true;
    if(filter==="75" && a.progress===75) show = true;
    if(filter==="100" && a.progress===100) show = true;

    if(!show) return;

    const div = document.createElement("div");
    div.className = "assignment";

    if(a.progress===25) div.classList.add("red");
    if(a.progress===50) div.classList.add("orange");
    if(a.progress===75) div.classList.add("blue");
    if(a.progress===100) div.classList.add("green");

    let icon = "";
    if(a.progress===100) icon = "✅";
    else if(daysLeft<=4) icon = "⚠️";

    div.innerHTML = `
      <strong>${a.title}</strong><br>
      Deadline: ${new Date(a.deadline).toLocaleString()}<br>
      Progress:
      <select onchange="updateProgress(${a.id}, parseInt(this.value))">
        <option value="0">0%</option>
        <option value="25">25%</option>
        <option value="50">50%</option>
        <option value="75">75%</option>
        <option value="100">100%</option>
      </select>
      <span class="statusIcon">${icon}</span>
    `;

    container.appendChild(div);
  });
}

function showPage(page) {
  render(page);
}

function generateDay() {
  const selected = assignments.filter(a => a.progress < 100);
  if(selected.length===0) return;

  const totalWeight = selected.reduce((sum,a)=>sum + (a.difficulty*(4-daysUntil(a.deadline))),0);
  const scheduleDiv = document.getElementById("schedule");
  scheduleDiv.innerHTML = "<h3>Today's Plan:</h3>";

  selected.forEach(a => {
    const weight = a.difficulty*(4-daysUntil(a.deadline));
    const hours = (weight/totalWeight)*8;
    scheduleDiv.innerHTML += `<p>${a.title}: ${hours.toFixed(1)} hours</p>`;
  });
}

render();

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("service-worker.js");
}
// Activate assignment selection, back button, and proportional hours

// When user clicks a section, show selectable assignments instead of auto-adding all
function generateSelectedDay(sectionAssignments) {
    const selected = sectionAssignments.filter((a, i) => {
        const checkbox = document.getElementById(`a${i}`);
        return checkbox && checkbox.checked;
    });

    if (selected.length === 0) return alert("Select at least one assignment!");

    // Distribute hours based on difficulty/urgency
    const assignmentsWithHours = distributeHours(selected);

    // Display the day
    const scheduleDiv = document.getElementById("schedule");
    scheduleDiv.innerHTML = "<h2>Today's Plan:</h2>";
    assignmentsWithHours.forEach(a => {
        const div = document.createElement("div");
        div.textContent = `${a.title} : ${a.hours} hours`;
        scheduleDiv.appendChild(div);
    });

    // Add the back button
    addBackButton();
}

// Replace old generateDay() calls with renderAssignmentSelection for the section
function showPage(sectionName) {
    // Get assignments for this section
    const sectionAssignments = allAssignments.filter(a => a.section === sectionName);
    renderAssignmentSelection(sectionAssignments);
}
