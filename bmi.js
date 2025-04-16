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

});