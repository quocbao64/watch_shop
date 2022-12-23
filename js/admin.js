let classes = (classes) => document.getElementsByClassName(classes);

const formatter = new Intl.NumberFormat("en-US");

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
    return response.json();
};

const getStatisticOrder = async () => {
    const response = await fetch("http://localhost:8080/api/statistic/order", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
            }`,
        },
    });
    return response.json();
};

const render = async () => {
    const users = await getListUsers();
    const statisticOrder = await getStatisticOrder();

    console.log("USERS: ", users);
    console.log("ORDERS: ", statisticOrder);

    let textOrders = classes("order-counter")[0];
    textOrders.innerHTML = statisticOrder?.listOrderSuccess.length;

    let textOrdersCancel = classes("order-cancel-counter")[0];
    textOrdersCancel.innerHTML = statisticOrder?.listOrderCancle.length;

    let textCancelRate = classes("cancel-rate")[0];
    textCancelRate.innerHTML =
        "Cancel rate: " +
        Math.round(
            (statisticOrder?.listOrderCancle.length /
                (statisticOrder?.listOrderSuccess.length +
                    statisticOrder?.listOrderCancle.length)) *
                100
        ) +
        "%";

    let textMoney = classes("money-receive")[0];
    textMoney.innerHTML = formatter.format(statisticOrder?.totalStatistic);

    let textUsers = classes("user-counter")[0];
    textUsers.innerHTML = users?.length;
};

render();
