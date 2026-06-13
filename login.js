function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const validUser = "sameer_sangam";
    const validPass = "12345";

    if (username === validUser && password === validPass) {
        window.location.href = "index.html";
    } else {
        document.getElementById("errorMsg").innerText = "Invalid username or password!";
    }
}
