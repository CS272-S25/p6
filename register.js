document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }

    // store user information
    const users = JSON.parse(localStorage.getItem('users')) || [];
    // check whether the mail address is already used
    if (users.some(user => user.email === email)) {
        alert('This email is already registered');
        return;
    }
    // add new user
    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Registration successful! You can now sign in.');
    window.location.href = 'login.html';
});