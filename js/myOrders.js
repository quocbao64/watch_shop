const getNewCases = async () => {
    const response = await fetch("http://localhost:8080/api/order/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
            }`,
        },
    });
    const data = await response.json();
    $("#myTable").DataTable({
        data: data,
        bLengthChange: false,
        columns: [
            { data: "id", title: "Product" },
            { data: "product.title", title: "Product" },
            { data: "quantity", title: "Quantity" },
            { data: "orderTotal", title: "Total ($)" },
            { data: "status", title: "Status" },
            { data: "address", title: "Address" },
            {
                data: "id",
                render: function (id, type) {
                    if (type === "display") {
                        const statusList = ["wait", "confirm"];
                        if (
                            statusList.includes(
                                data
                                    .find((e) => e.id === id)
                                    .status.toLowerCase()
                            )
                        )
                            return `<button class="btn btn-danger" id="product-${id}" onclick="clickMe(${id})">Cancle Order</button>`;
                        else
                            return `<button class="btn btn-danger" id="product-${id}" onclick="clickMe(${id})" disabled>Cancle Order</button>`;
                    }
                    return id;
                },
            },
        ],
    });
};

function clickMe(data) {
    fetch("http://localhost:8080/api/order/cancle-order?id=" + data, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
            }`,
        },
    })
        .then((response) => response.json())
        .then((success) => {
            if (!alert(success.message + ". This page will reload")) {
                window.location.reload();
            }
        })
        .catch((err) => console.log(err));
}

getNewCases();
