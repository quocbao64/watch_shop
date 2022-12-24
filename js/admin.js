let classes = (classes) => document.getElementsByClassName(classes);

const formatter = new Intl.NumberFormat("en-US");

const fetchApi = async (url) => {
    const response = await fetch(url, {
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
    const users = await fetchApi("http://localhost:8080/api/account/users");
    const statisticOrder = await fetchApi(
        "http://localhost:8080/api/statistic/order"
    );
    const listCategory = await fetchApi("http://localhost:8080/api/category");
    const statisticProduct = await fetchApi(
        "http://localhost:8080/api/statistic/product"
    );

    console.log("USERS: ", users);
    console.log("ORDERS: ", statisticOrder);
    console.log("CATEGORY: ", listCategory);
    console.log("PRODUCT: ", statisticProduct);

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

    var ctx1 = document.getElementById("lineChart").getContext("2d");

    let dataNotSold = statisticProduct?.listProductNotSold || [];
    let dataSold = statisticProduct?.listProductSold || [];
    let nameCategories = listCategory?.map((e) => e.name);

    let dataInStockChart = nameCategories?.map((e) => {
        let category = dataNotSold.find((a) => a.category.name == e);
        if (category) {
            return category.quantity;
        } else {
            return 0;
        }
    });

    let dataSoldChart = nameCategories?.map((e) => {
        let category = dataSold.find((a) => a.category.name == e);
        if (category) {
            return category.quantity;
        } else {
            return 0;
        }
    });

    var lineChart = new Chart(ctx1, {
        type: "bar",
        data: {
            labels: nameCategories,
            datasets: [
                {
                    label: "In stock",
                    backgroundColor: "#3EB9DC",
                    data: dataInStockChart || [],
                },
                {
                    label: "Product sold",
                    backgroundColor: "#EBEFF3",
                    data: dataSoldChart || [],
                },
            ],
        },
        options: {
            tooltips: {
                mode: "index",
                intersect: false,
            },
            responsive: true,
            scales: {
                xAxes: [
                    {
                        stacked: true,
                    },
                ],
                yAxes: [
                    {
                        stacked: true,
                    },
                ],
            },
        },
    });
};

render();
