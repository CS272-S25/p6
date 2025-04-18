// Initialize storage if empty
let weightData = JSON.parse(localStorage.getItem('weightData')) || [];
let weightChart = null;

document.getElementById('weightForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newEntry = {
        date: document.getElementById('date').value,
        weight: parseFloat(document.getElementById('weight').value),
        unit: document.getElementById('unit').value
    };
    
    weightData.push(newEntry);
    localStorage.setItem('weightData', JSON.stringify(weightData));
    updateDisplay();
    e.target.reset();
});

function updateDisplay() {
    // Update table
    const tbody = document.getElementById('recordsTable');
    tbody.innerHTML = weightData.map(entry => `
        <tr>
            <td>${entry.date}</td>
            <td>${entry.weight.toFixed(1)}</td>
            <td>${entry.unit.toUpperCase()}</td>
        </tr>
    `).join('');

    // Update chart
    const dates = weightData.map(entry => entry.date);
    const weights = weightData.map(entry => entry.weight);
    
    if (weightChart) {
        weightChart.destroy();
    }
    
    const ctx = document.getElementById('weightChart').getContext('2d');
    weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Weight History',
                data: weights,
                borderColor: '#007bff',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Weight'
                    }
                }
            }
        }
    });
}

// Reset handler
document.getElementById('resetButton').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all weight records?')) {
        weightData = [];
        localStorage.removeItem('weightData');
        updateDisplay();
    }
});

// Initial display
updateDisplay();
