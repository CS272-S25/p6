function calculateCalories() {
    const age = parseFloat(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const activity = document.getElementById('activity').value;

    if (isNaN(age) || isNaN(height) || isNaN(weight)) {
        alert("Please enter valid numbers for age, height, and weight.");
        return;
    }

    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender === 'female') {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
        alert("Please select your gender.");
        return;
    }

    let tdee;
    switch (activity) {
        case 'sedentary':
            tdee = bmr * 1.2;
            break;
        case 'lightly_active':
            tdee = bmr * 1.375;
            break;
        case 'moderately_active':
            tdee = bmr * 1.55;
            break;
        case 'very_active':
            tdee = bmr * 1.725;
            break;
        case 'super_active':
            tdee = bmr * 1.9;
            break;
        default:
            alert("Please select your activity level.");
            return;
    }

    document.getElementById('result').innerText = `You need approximately ${tdee.toFixed(2)} calories per day.`;
}

function clearForm() {
    document.getElementById('age').value = '';
    document.getElementById('gender').value = '';
    document.getElementById('height').value = '';
    document.getElementById('weight').value = '';
    document.getElementById('activity').value = '';
    document.getElementById('result').innerText = '';
}