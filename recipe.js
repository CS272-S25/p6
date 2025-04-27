const API_KEY = '552a9cbb24fd483e920918a9bddb5602';
const BASE_URL = 'https://api.spoonacular.com';

document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const recipeSearch = document.getElementById('recipeSearch');

    searchButton.addEventListener('click', searchRecipes);
    recipeSearch.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchRecipes();
        }
    });
});

function createSpinner(message) {
    const container = document.createElement('div');
    container.className = 'col-12 text-center py-5';

    const spinner = document.createElement('div');
    spinner.className = 'spinner-border text-success';
    spinner.setAttribute('role', 'status');

    const visuallyHidden = document.createElement('span');
    visuallyHidden.className = 'visually-hidden';
    visuallyHidden.textContent = 'Loading...';
    spinner.appendChild(visuallyHidden);

    const p = document.createElement('p');
    p.className = 'mt-2';
    p.textContent = message;

    container.appendChild(spinner);
    container.appendChild(p);

    return container;
}

function searchRecipes() {
    const query = document.getElementById('recipeSearch').value.trim();
    if (!query) {
        showAlert('Please enter a recipe name to search', 'warning');
        return;
    }

    const recipeResults = document.getElementById('recipeResults');
    recipeResults.innerHTML = '';
    recipeResults.appendChild(createSpinner('Searching for healthy recipes...'));

    fetch(`${BASE_URL}/recipes/complexSearch?apiKey=${API_KEY}&query=${query}&number=6&addRecipeNutrition=true`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.results && data.results.length > 0) {
                displayRecipes(data.results);
            } else {
                showAlert('No recipes found. Try a different search term.', 'info', 'recipeResults');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('Failed to fetch recipes. Please try again later.', 'danger', 'recipeResults');
        });
}

function displayRecipes(recipes) {
    const recipeResults = document.getElementById('recipeResults');
    recipeResults.innerHTML = '';

    recipes.forEach(recipe => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';

        const card = document.createElement('div');
        card.className = 'card h-100 border-success border-2';

        const img = document.createElement('img');
        img.className = 'card-img-top';
        img.style.height = '180px';
        img.style.objectFit = 'cover';
        img.src = recipe.image || 'https://via.placeholder.com/300x200?text=No+Image';
        img.alt = recipe.title;

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = recipe.title;

        cardBody.appendChild(title);
        if (recipe.nutrition) {
            cardBody.appendChild(displayNutritionBadges(recipe.nutrition.nutrients));
        }

        const cardFooter = document.createElement('div');
        cardFooter.className = 'card-footer bg-transparent';

        const button = document.createElement('button');
        button.className = 'btn btn-success w-100 view-recipe';
        button.dataset.id = recipe.id;

        const icon = document.createElement('i');
        icon.className = 'fas fa-utensils me-1';
        button.appendChild(icon);
        button.append('View Recipe');

        button.addEventListener('click', function() {
            const recipeId = this.getAttribute('data-id');
            showRecipeDetails(recipeId);
        });

        cardFooter.appendChild(button);
        card.appendChild(img);
        card.appendChild(cardBody);
        card.appendChild(cardFooter);
        col.appendChild(card);
        recipeResults.appendChild(col);
    });
}

function displayNutritionBadges(nutrients) {
    const wrapper = document.createElement('div');
    wrapper.className = 'd-flex flex-wrap gap-2 mb-3';

    if (!nutrients) return wrapper;

    const importantNutrients = nutrients.filter(n =>
        ['Calories', 'Protein', 'Carbohydrates', 'Fat'].includes(n.name)
    );

    importantNutrients.forEach(nutrient => {
        const badge = document.createElement('span');
        badge.className = 'badge bg-success bg-opacity-10 text-success border border-success border-opacity-25';
        badge.textContent = `${nutrient.name}: ${Math.round(nutrient.amount)}${nutrient.unit}`;
        wrapper.appendChild(badge);
    });

    return wrapper;
}

function showRecipeDetails(recipeId) {
    const ingredientsList = document.getElementById('ingredientsList');
    const nutritionInfo = document.getElementById('nutritionInfo');

    ingredientsList.innerHTML = '';
    ingredientsList.appendChild(createSpinner('Loading recipe details...'));
    nutritionInfo.innerHTML = '';

    fetch(`${BASE_URL}/recipes/${recipeId}/ingredientWidget.json?apiKey=${API_KEY}`)
        .then(response => {
            if (!response.ok) throw new Error('Ingredients not available');
            return response.json();
        })
        .then(data => {
            displayIngredients(data.ingredients);
        })
        .catch(error => {
            console.error('Error fetching ingredients:', error);
            showAlert('Failed to load ingredients information.', 'warning', 'ingredientsList');
        });

    fetch(`${BASE_URL}/recipes/${recipeId}/nutritionWidget.json?apiKey=${API_KEY}`)
        .then(response => {
            if (!response.ok) throw new Error('Nutrition not available');
            return response.json();
        })
        .then(data => {
            displayNutrition(data);
        })
        .catch(error => {
            console.error('Error fetching nutrition:', error);
            showAlert('Failed to load nutrition information.', 'warning', 'nutritionInfo');
        });

    const modal = new bootstrap.Modal(document.getElementById('recipeModal'));
    modal.show();
}

function displayIngredients(ingredients) {
    const ingredientsList = document.getElementById('ingredientsList');
    ingredientsList.innerHTML = '';

    if (!ingredients || ingredients.length === 0) {
        showAlert('No ingredients information available.', 'info', 'ingredientsList');
        return;
    }

    const heading = document.createElement('h4');
    heading.className = 'mb-4';
    heading.innerHTML = '<i class="fas fa-carrot text-success me-2"></i>Ingredients';
    ingredientsList.appendChild(heading);

    const listGroup = document.createElement('div');
    listGroup.className = 'list-group';

    ingredients.forEach(ingredient => {
        const item = document.createElement('div');
        item.className = 'list-group-item';

        const itemRow = document.createElement('div');
        itemRow.className = 'd-flex align-items-center';

        const img = document.createElement('img');
        img.className = 'rounded-circle me-3';
        img.style.width = '50px';
        img.style.height = '50px';
        img.style.objectFit = 'cover';
        img.src = `https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`;
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/50x50?text=No+Image';
        };
        img.alt = ingredient.name;

        const textContainer = document.createElement('div');
        textContainer.className = 'flex-grow-1';

        const name = document.createElement('h6');
        name.className = 'mb-1';
        name.textContent = ingredient.name;

        const amount = document.createElement('small');
        amount.className = 'text-muted';
        const usAmount = ingredient.amount.us.value + ' ' + (ingredient.amount.us.unit || '');
        const metricAmount = ingredient.amount.metric.value + ' ' + (ingredient.amount.metric.unit || '');
        amount.textContent = `${usAmount} (${metricAmount})`;

        textContainer.appendChild(name);
        textContainer.appendChild(amount);
        itemRow.appendChild(img);
        itemRow.appendChild(textContainer);
        item.appendChild(itemRow);
        listGroup.appendChild(item);
    });

    ingredientsList.appendChild(listGroup);
}

function displayNutrition(nutritionData) {
    const nutritionInfo = document.getElementById('nutritionInfo');
    nutritionInfo.innerHTML = '';

    if (!nutritionData) {
        showAlert('No nutrition information available.', 'info', 'nutritionInfo');
        return;
    }

    const row = document.createElement('div');
    row.className = 'row g-4';

    // left half Nutrients cards
    const nutrientsCol = document.createElement('div');
    nutrientsCol.className = 'col-md-6';

    const nutrientsTitle = document.createElement('h4');
    nutrientsTitle.innerHTML = '<i class="fas fa-chart-pie text-success me-2"></i>Nutrients';
    nutrientsCol.appendChild(nutrientsTitle);

    const nutrientsRow = document.createElement('div');
    nutrientsRow.className = 'row g-2';

    if (nutritionData.nutrients && nutritionData.nutrients.length > 0) {
        nutritionData.nutrients.slice(0, 8).forEach(nutrient => {
            const col = document.createElement('div');
            col.className = 'col-sm-6';

            const card = document.createElement('div');
            card.className = 'card border-success border-opacity-25 h-100';

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body p-3';

            const title = document.createElement('h6');
            title.className = 'card-title mb-1 text-success';
            title.textContent = nutrient.name;

            const amount = document.createElement('p');
            amount.className = 'card-text mb-1';
            amount.textContent = `${Math.round(nutrient.amount * 10) / 10} ${nutrient.unit}`;

            cardBody.appendChild(title);
            cardBody.appendChild(amount);

            if (nutrient.percentOfDailyNeeds) {
                const progress = document.createElement('div');
                progress.className = 'progress';
                progress.style.height = '6px';

                const progressBar = document.createElement('div');
                progressBar.className = 'progress-bar bg-success';
                progressBar.style.width = `${nutrient.percentOfDailyNeeds}%`;
                progressBar.setAttribute('role', 'progressbar');
                progressBar.setAttribute('aria-valuenow', nutrient.percentOfDailyNeeds);
                progressBar.setAttribute('aria-valuemin', '0');
                progressBar.setAttribute('aria-valuemax', '100');

                progress.appendChild(progressBar);
                cardBody.appendChild(progress);

                const dailyNeed = document.createElement('small');
                dailyNeed.className = 'text-muted';
                dailyNeed.textContent = `${Math.round(nutrient.percentOfDailyNeeds)}% of daily needs`;
                cardBody.appendChild(dailyNeed);
            }

            card.appendChild(cardBody);
            col.appendChild(card);
            nutrientsRow.appendChild(col);
        });
    }

    nutrientsCol.appendChild(nutrientsRow);
    row.appendChild(nutrientsCol);

    // right half Caloric Breakdown
    const breakdownCol = document.createElement('div');
    breakdownCol.className = 'col-md-6';

    const breakdownTitle = document.createElement('h4');
    breakdownTitle.innerHTML = '<i class="fas fa-balance-scale text-success me-2"></i>Caloric Breakdown';
    breakdownCol.appendChild(breakdownTitle);

    const breakdownData = nutritionData.caloricBreakdown;
    if (breakdownData) {
        const breakdownList = document.createElement('ul');
        breakdownList.className = 'list-group list-group-flush';

        Object.entries(breakdownData).forEach(([key, value]) => {
            const item = document.createElement('li');
            item.className = 'list-group-item d-flex justify-content-between align-items-center';
            item.innerHTML = `
                ${formatKey(key)}
                <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">${Math.round(value)}%</span>
            `;
            breakdownList.appendChild(item);
        });

        breakdownCol.appendChild(breakdownList);
    } else {
        const noData = document.createElement('p');
        noData.textContent = 'No caloric breakdown available.';
        breakdownCol.appendChild(noData);
    }

    row.appendChild(breakdownCol);

    nutritionInfo.appendChild(row);
}

// helper function to format key
function formatKey(key) {
    if (key.includes('Protein')) return 'Protein';
    if (key.includes('Fat')) return 'Fat';
    if (key.includes('Carbs')) return 'Carbs';
    return key;
}


function showAlert(message, type, targetId = null) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;

    const textNode = document.createTextNode(message);
    alert.appendChild(textNode);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn-close';
    button.setAttribute('data-bs-dismiss', 'alert');
    button.setAttribute('aria-label', 'Close');
    alert.appendChild(button);

    if (targetId) {
        const target = document.getElementById(targetId);
        if (target) {
            target.innerHTML = '';
            target.appendChild(alert);
        }
    } else {
        document.body.appendChild(alert);
    }

    setTimeout(() => {
        const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
        bsAlert.close();
    }, 5000);
}
