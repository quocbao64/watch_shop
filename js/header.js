let id = (id) => document.getElementById(id);
let classes = (classes) => document.getElementsByClassName(classes);

const replaceTargetWith = (targetID, html) => {
    var i,
        div,
        elm,
        last,
        target = document.getElementById(targetID);
    div = document.createElement("div");
    div.innerHTML = html;
    i = div.childNodes.length;
    last = target;
    while (i--) {
        target.parentNode.insertBefore((elm = div.childNodes[i]), last);
        last = elm;
    }
    target.parentNode.removeChild(target);
};

const btnAvatar = classes("header-avatar");

const dismiss = () => {
    let submenu = classes("dismiss");
    submenu[0].style.display = "none";
};

const openMenu = (e) => {
    const dropdownMenu = id("dropdown-menu");
    if (window.getComputedStyle(dropdownMenu).display === "block") {
        dropdownMenu.style.display = "none";
    } else {
        dismiss();
        dropdownMenu.style.display = "block";
    }
};

const btnLogout = id("btnLogout");
btnLogout.onclick = function () {
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    location.reload();
};

const renderWhenLogin = () => {
    const userMenu = id("user");
    const anoMenu = id("header-btn-group");
    if (localStorage.getItem("userId")) {
        userMenu.style.display = "flex";
        anoMenu.style.display = "none";
        if (
            JSON.parse(localStorage.getItem("user")).roles[0] === "ROLE_ADMIN"
        ) {
            document.getElementById("isAdmin").style.display = "block";
        } else {
            document.getElementById("isAdmin").style.display = "none";
        }
    }
};
window.onload = renderWhenLogin();
