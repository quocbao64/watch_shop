const id = location.search.split("?")[1];
var textBrand = "";
var textCategory = "";

async function fetchApi(idSelect, uri) {
    const response = await fetch(`http://localhost:8080/api/${uri}/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
            }`,
        },
    });
    const data = await response.json();

    var results = [];
    data.forEach((e) => {
        results.push({ id: e.id, text: e.name });
    });
    $(idSelect).select2({
        data: results,
        language: {
            noResults: function () {
                typed = $(".select2-search__field").val();
                return `<button style="width: 100%" type="button"
            class="btn btn-primary "
            onClick='taskFor("${idSelect}", "${uri}")'>+ Add New Item</button>
            </li>`;
            },
        },
        templateResult: function (data) {
            if (data.id == null) {
                return data.text;
            }

            var $option = $("<span></span>");
            var $btnDelete = $(
                `<button class="btn btn-danger">Delete this</button>`
            );
            $btnDelete.on("mouseup", function (evt) {
                // Select2 will remove the dropdown on `mouseup`, which will prevent any `click` events from being triggered
                // So we need to block the propagation of the `mouseup` event
                evt.stopPropagation();
            });

            $btnDelete.on("click", function (evt) {
                console.log(data.id);
            });

            $option.text(data.text);
            $option.append($btnDelete);

            return $option;
        },
        escapeMarkup: function (markup) {
            return markup;
        },
    });
}

async function downloadFile(img) {
    await fetch("http://localhost:8080/api/product/downloadFile/" + img, {
        // Your POST endpoint
        method: "GET",
    })
        .then((response) => response.blob())
        .then((imageBlob) => {
            const imageObjectURL = URL.createObjectURL(imageBlob);
            document.getElementById("preview-img").src = imageObjectURL;
        });
}

async function fetchDetails() {
    const response = await fetch(
        `http://localhost:8080/api/product/${id?.toString()}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return await response.json();
}

async function assignProductDetails() {
    const data = await fetchDetails();
    if (data.id !== undefined) {
        document.getElementById("inputTitle").value = data.title;
        document.getElementById("inputDescription").value = data.description;
        document.getElementById("inputStock").value = data.stock;
        document.getElementById("inputPrice").value = data.price;
        $("#select-brand")
            .select2()
            .select2("val", Number(data.brand.id).toString());
        $("#select-category")
            .select2()
            .select2("val", Number(data.category.id).toString());
        downloadFile(data.image);
    }
}
fetchApi("#select-brand", "brand");
fetchApi("#select-category", "category");
assignProductDetails();

$("#select-brand").on("select2:select", function (e) {
    typed = ""; // clear
});
$("#select-category").on("select2:select", function (e) {
    typed = ""; // clear
});
async function taskFor(idSelect, uri) {
    if (typed) {
        console.log(typed);
        // var value = prompt("Do you have a state abbriviation for "+typed+"?"); // change typed to value where necessary

        // Set the value, creating a new option if necessary
        if ($(idSelect).find("option[value='" + typed + "']").length) {
            $(idSelect).val(typed).trigger("change");
        } else {
            // Create a DOM Option and pre-select by default

            var newOption = new Option(typed, typed, true, true);
            // Append it to the select
            $(id).append(newOption).trigger("change");
        }

        const response = await fetch(
            `http://localhost:8080/api/${uri}/create?name=${typed}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${
                        JSON.parse(localStorage.getItem("user")).accessToken
                    }`,
                },
            }
        );
        const data = await response.json();
        if (data.message.includes("success")) {
            fetchApi(idSelect, uri);
            alert(data.message);
        }
    }
}

const input = document.getElementById("image-file");
const update = async () => {
    const formData = new FormData();
    formData.append("image", input.files[0]);
    formData.append("id", id);
    const data = {
        title: document.getElementById("inputTitle").value,
        description: document.getElementById("inputDescription").value,
        stock: document.getElementById("inputStock").value,
        price: document.getElementById("inputPrice").value,
        brandId: $("#select-brand").select2().select2("val"),
        categoryId: $("#select-category").select2().select2("val"),
    };
    formData.append("data", JSON.stringify(data));
    console.log(formData);
    await fetch("http://localhost:8080/api/product/update", {
        // Your POST endpoint
        method: "PUT",
        headers: {
            Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
            }`,
        },
        body: formData, // This is your file object
    })
        .then(
            (response) => response.json() // if the response is a JSON object
        )
        .then(async (success) => {
            console.log(success);
            alert(success.message);
        })
        .catch(
            (error) => console.log(error) // Handle the error response object
        );

    // document.getElementById("prview-img").;
};

const uploadLocal = (file) => {
    const imageObjectURL = URL.createObjectURL(file);
    document.getElementById("preview-img").src = imageObjectURL;
};
document.getElementById("btn-submit").onclick = function (e) {
    e.preventDefault();
    update();
};

const onSelectFile = () => uploadLocal(input.files[0]);
input.addEventListener("change", onSelectFile, false);
