document.addEventListener('DOMContentLoaded', function() {
    const metricSystem = document.getElementById('metricSystem');
    const imperialSystem = document.getElementById('imperialSystem');
    const metricInputs = document.getElementById('metricInputs');
    const imperialInputs = document.getElementById('imperialInputs');
    const calculateBtn = document.getElementById('calculateBtn');
    const bmiResult = document.getElementById('bmiResult');
    const bmiCategory = document.getElementById('bmiCategory');

    metricSystem.addEventListener('change', toggleUnitSystem);
    imperialSystem.addEventListener('change', toggleUnitSystem);

    calculateBtn.addEventListener('click', calculateBMI);

    function toggleUnitSystem() {
        if (metricSystem.checked) {
            metricInputs.style.display = 'block';
            imperialInputs.style.display = 'none';
        } else {
            metricInputs.style.display = 'none';
            imperialInputs.style.display = 'block';
        }
        clearResults();
    }

    function calculateBMI() {
        let bmi;

        if (metricSystem.checked) {
            const heightCm = parseFloat(document.getElementById('heightCm').value);
            const weightKg = parseFloat(document.getElementById('weightKg').value);

            if (isNaN(heightCm) || isNaN(weightKg) || heightCm <= 0 || weightKg <= 0) {
                alert('Please enter valid height and weight values');
                return;
            }

            const heightM = heightCm / 100;
            bmi = weightKg / (heightM * heightM);
        } else {
            const heightFeet = parseFloat(document.getElementById('heightFeet').value);
            const heightInches = parseFloat(document.getElementById('heightInches').value);
            const weightLbs = parseFloat(document.getElementById('weightLbs').value);

            if (isNaN(heightFeet) || isNaN(heightInches) || isNaN(weightLbs) ||
                heightFeet <= 0 || heightInches < 0 || weightLbs <= 0) {
                alert('Please enter valid height and weight values');
                return;
            }

            const totalHeightInches = (heightFeet * 12) + heightInches;
            bmi = (weightLbs / (totalHeightInches * totalHeightInches)) * 703;
        }

        displayResults(bmi);
    }

    function displayResults(bmi) {
        const roundedBMI = bmi.toFixed(1);
        bmiResult.innerHTML = `<strong>Your BMI: ${roundedBMI}</strong>`;

        let category = '';
        let categoryClass = '';

        if (bmi < 18.5) {
            category = 'Underweight';
            categoryClass = 'text-info';
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            category = 'Normal weight';
            categoryClass = 'text-success';
        } else if (bmi >= 25 && bmi <= 29.9) {
            category = 'Overweight';
            categoryClass = 'text-warning';
        } else {
            category = 'Obese';
            categoryClass = 'text-danger';
        }

        bmiCategory.innerHTML = `<span class="${categoryClass}"><strong>${category}</strong></span>`;
    }

    function clearResults() {
        bmiResult.textContent = 'Your BMI will appear here';
        bmiCategory.textContent = '';
    }

    const calculateBmrBtn = document.getElementById('calculateBmrBtn');
    const bmrResult = document.getElementById('bmrResult');
    const bmrMaintenance = document.getElementById('bmrMaintenance');
    const calorieNeeds = document.getElementById('calorieNeeds');

    calculateBmrBtn.addEventListener('click', calculateBMR);

    function calculateBMR() {
        const age = parseFloat(document.getElementById('age').value);
        const gender = document.getElementById('gender').value;
        const height = parseFloat(document.getElementById('heightBmr').value);
        const weight = parseFloat(document.getElementById('weightBmr').value);
        const activityLevel = parseFloat(document.getElementById('activityLevel').value);

        if (isNaN(age) || isNaN(height) || isNaN(weight) || age <= 0 || height <= 0 || weight <= 0) {
            alert('Please enter valid values');
            return;
        }

        let bmr;
        if (gender === 'male') {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }

        displayBMRResults(bmr, activityLevel);
    }

    function displayBMRResults(bmr, activityLevel) {
        const roundedBMR = Math.round(bmr);
        bmrResult.innerHTML = `<strong>Your BMR: ${roundedBMR} calories/day</strong>`;

        const maintenanceCalories = Math.round(bmr * activityLevel);
        bmrMaintenance.textContent = `Maintenance: ${maintenanceCalories} calories/day`;
        bmrMaintenance.style.color = 'var(--text-secondary)';
        bmrMaintenance.style.fontWeight = 'bold';

        const activityLevels = [
            { level: 1.2, desc: "Sedentary" },
            { level: 1.375, desc: "Light activity" },
            { level: 1.55, desc: "Moderate activity" },
            { level: 1.725, desc: "Very active" },
            { level: 1.9, desc: "Extra active" }
        ];

        const activityMeter = document.getElementById('activity');
        const activityLevelSelect = document.getElementById('activityLevel');

        activityLevelSelect.addEventListener('change', function() {
            const selectedIndex = this.selectedIndex;
            activityMeter.value = selectedIndex + 1;
        });

        activityMeter.value = activityLevelSelect.selectedIndex + 1;

        let calorieHtml = '<div class="row mt-3">';
        activityLevels.forEach(item => {
            const calories = Math.round(bmr * item.level);
            calorieHtml += `
            <div class="col-12 col-sm-6 mb-2">
                <small>${item.desc}:</small><br>
                <span class="badge bg-secondary">${calories} cal</span>
            </div>
        `;
        });
        calorieHtml += '</div>';

        calorieNeeds.innerHTML = calorieHtml;
    }

});