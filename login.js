document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // gain stored user imformation
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // verify
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        // success
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Login successful!');
        window.location.href = 'index.html';
    } else {
        alert('Invalid email or password');
    }
});