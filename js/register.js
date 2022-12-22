let id = (id) => document.getElementById(id);
let classes = (classes) => document.getElementsByClassName(classes);

const form = id("register");
const btnLogin = id("btnRegister");

const validate = (e) => {
    e.preventDefault();

    const data = {
        username: document.getElementById("floatingUsername").value,
        password: document.getElementById("floatingPassword").value,
        email: document.getElementById("floatingEmail").value,
        fullName: document.getElementById("floatingFullname").value,
        phoneNumber: document.getElementById("floatingPhone").value,
    };
    console.log(data);
    fetch("http://localhost:8080/api/account/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((data) => {
            // console.log(data);
            window.location.replace("../html/login.html");
        })
        .catch((error) => {
            console.log("Request failed", error);
        });
};

btnLogin.addEventListener("click", validate, false);
