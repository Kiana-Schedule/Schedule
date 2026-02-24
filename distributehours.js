// distributeHours.js
// Distributes total hours proportionally based on difficulty and urgency

function distributeHours(selectedAssignments, totalHours = 8) {
    selectedAssignments.forEach(a => {
        const difficultyFactor = parseInt(a.difficulty); // 1=easy,2=medium,3=hard
        const urgencyFactor = a.urgent ? 2 : 1;
        a.weight = difficultyFactor * urgencyFactor;
    });

    const totalWeight = selectedAssignments.reduce((sum, a) => sum + a.weight, 0);

    selectedAssignments.forEach(a => {
        a.hours = ((a.weight / totalWeight) * totalHours).toFixed(1);
    });

    return selectedAssignments;
}
