const getListUsers = async () => {
    const response = await fetch("http://localhost:8080/api/account/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
            }`,
        },
    });
    const data = await response.json();
    console.log(data);
    $("#admin-user-table").DataTable({
        data: data,
        columns: [
            { data: "username", title: "Username" },
            { data: "email", title: "Email" },
            { data: "phoneNumber", title: "Phone Number" },
            { data: "fullName", title: "Fullname" },
        ],
    });
};
getListUsers();
