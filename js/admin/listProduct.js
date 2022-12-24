let images = [];
let data;

const fetchProduct = async () => {
    const response = await fetch("http://localhost:8080/api/product", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    data = await response.json();
};
const getListProduct = async () => {
    await fetchProduct();
    await downloadFile();

    $("#admin-product-table").DataTable({
        data: data,
        deferRender: true,
        columns: [
            {
                data: "id",
                title: "ID",
            },
            {
                data: "id",
                render: function (data, type) {
                    if (type === "display") {
                        return `<img src="${
                            images.filter((e) => e.id === data)[0]["image"]
                        }"/>`;
                    }
                    return data;
                },
            },
            { data: "title", title: "Title" },
            { data: "description", title: "Description" },
            { data: "stock", title: "Stock" },
            { data: "price", title: "Price" },
            { data: "brand.name", title: "Brand" },
            { data: "category.name", title: "Category" },
            {
                data: "id",
                render: function (data, type) {
                    if (type === "display") {
                        return `<button class="btn btn-primary" id="product-${data}" onclick="clickMe(${data})">Edit</button>`;
                    }
                    return data;
                },
            },
            {
                data: "id",
                render: function (data, type) {
                    if (type === "display") {
                        return `<button class="btn btn-danger" id="product-${data}" onclick="clickDelete(${data})">Delete</button>`;
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
            "http://localhost:8080/api/product/downloadFile/" + data[i].image,
            {
                // Your POST endpoint
                method: "GET",
            }
        )
            .then((response) => response.blob())
            .then((imageBlob) => {
                const imageObjectURL = URL.createObjectURL(imageBlob);
                images.push(
                    new Object({ id: data[i].id, image: imageObjectURL })
                );
            });
    }
}
function clickMe(id) {
    window.location.assign(`../../html/admin/productDetails.html?${id}`);
}

async function clickDelete(id) {
    await fetch("http://localhost:8080/api/product/delete?id=" + id, {
        // Your POST endpoint
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
            }`,
        },
    })
        .then((response) => response.json())
        .then((success) => {
            if (success.message === "Delete product is success") {
                if (!alert(success.message)) window.location.reload();
            } else {
                alert(success.message);
            }
        })
        .catch((err) => console.log(err));
}
getListProduct();
