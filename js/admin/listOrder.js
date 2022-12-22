let images = [];
let data;

const fetchOrder = async () => {
    const response = await fetch("http://localhost:8080/api/order", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
            }`,
        },
    });
    data = await response.json();
};
const getListOrder = async () => {
    await fetchOrder();
    await downloadFile();

    $("#admin-product-table").DataTable({
        data: data,
        deferRender: true,
        columns: [
            {
                data: "id",
                title: "ID",
            },
            { data: "user.username", title: "User" },
            {
                data: "product.id",
                title: "Image Product",
                render: function (data, type) {
                    if (type === "display") {
                        return `<img src="${
                            images.filter((e) => e.id === data)[0].image
                        }"/>`;
                    }
                    return data;
                },
            },
            { data: "product.title", title: "Title" },
            { data: "quantity", title: "Quantity" },
            { data: "address", title: "Address" },
            { data: "orderTotal", title: "Order Total" },
            {
                data: "id",
                title: "Status",
                render: function (id, type, row, meta) {
                    const or = data.filter((e) => e.id === id)[0];
                    var $select = $(
                        "<select class='pilihan form-control' id='pilihan" +
                            or.id +
                            "'>" +
                            "<option option value = '0' > --- CHOICE-- -</option >" +
                            "<option value='WAIT'>WAIT</option>" +
                            "<option value='CONFIRM'>CONFIRM</option>" +
                            "<option value='DELIVERY'>DELIVERY</option>" +
                            "<option value='SUCCESS'>SUCCESS</option>" +
                            "<option value='CANCLE'>CANCLE</option>" +
                            "</select > "
                    );
                    $select
                        .find('option[value="' + or.status + '"]')
                        .attr("selected", "selected");
                    return $select[0].outerHTML;
                },
            },
            {
                data: "id",
                render: function (data, type) {
                    if (type === "display") {
                        return `<button class="btn btn-primary" id="product-${data}" onclick="clickMe(${data})">Update Status</button>`;
                    }
                    return data;
                },
            },
        ],
    });
};

async function downloadFile() {
    for (let i = 0; i < data.length; i++) {
        await fetch(
            "http://localhost:8080/api/product/downloadFile/" +
                data[i].product.image,
            {
                // Your POST endpoint
                method: "GET",
            }
        )
            .then((response) => response.blob())
            .then((imageBlob) => {
                const imageObjectURL = URL.createObjectURL(imageBlob);
                images.push(
                    new Object({
                        id: data[i].product.id,
                        image: imageObjectURL,
                    })
                );
            });
    }
}

function clickMe(data) {
    const request = {
        status: $(`#pilihan${data} option:selected`).val(),
    };
    fetch("http://localhost:8080/api/order/update?id=" + data, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
            }`,
        },
        body: JSON.stringify(request),
    })
        .then((response) => response.json())
        .then((success) => alert(success.message))
        .catch((err) => console.log(err));
}
getListOrder();
