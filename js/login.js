let id = (id) => document.getElementById(id);
let classes = (classes) => document.getElementsByClassName(classes);

const form = id("loginForm");
const btnLogin = id("btnLogin");

const validate = (e) => {
    e.preventDefault();

    const data = {
        username: document.getElementById("floatingPhone").value,
        password: document.getElementById("floatingPassword").value,
    };

    fetch("http://localhost:8080/api/account/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.id !== undefined) {
                localStorage.setItem("userId", data.id);
                localStorage.setItem("user", JSON.stringify(data));
                window.location.replace("../html/index.html");
            } else {
                alert(data.message);
            }
        })
        .catch((error) => {
            console.log("Request failed", error);
        });
};

btnLogin.addEventListener("click", validate, false);
