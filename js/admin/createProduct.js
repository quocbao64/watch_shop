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
                evt.stopPropagation();
            });

            $btnDelete.on("click", async function (evt) {
                const res = await deleteApi(data.id, uri);
                if (res.message.includes("success")) {
                    alert(res.message + ". Please reload to see this change");
                    hideOption(data.id);
                }
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

function hideOption(value) {
    $('select option[value="' + value + '"]').appendTo("#optionHolder");
}

async function deleteApi(id, type) {
    const response = await fetch(
        "http://localhost:8080/api/" + type + "?id=" + id,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${
                    JSON.parse(localStorage.getItem("user")).accessToken
                }`,
            },
        }
    ).then((res) => res.json());
    return response;
}

fetchApi("#select-brand", "brand");
fetchApi("#select-category", "category");

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
const create = async () => {
    const formData = new FormData();
    formData.append("image", input.files[0]);
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
    await fetch("http://localhost:8080/api/product/create", {
        // Your POST endpoint
        method: "POST",
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
        .then((success) => {
            if (success.message === "Create product is success") {
                if (!alert(success.message))
                    window.location.assign("../../html/admin/listProduct.html");
            } else {
                alert(success.message);
            }
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
    create();
};

const onSelectFile = () => uploadLocal(input.files[0]);
input.addEventListener("change", onSelectFile, false);
