let cartContainer = document.getElementById("cartContainer");

let boxContainerDiv = document.createElement("div");
boxContainerDiv.id = "boxContainer";

// DYNAMIC CODE TO SHOW THE SELECTED ITEMS IN YOUR CART
function dynamicCartSection(ob, itemCounter, img) {
    let boxDiv = document.createElement("div");
    boxDiv.id = "box";
    boxContainerDiv.appendChild(boxDiv);

    let boxImg = document.createElement("img");
    boxImg.src = img;
    boxDiv.appendChild(boxImg);

    let boxh3 = document.createElement("h3");
    let h3Text = document.createTextNode(ob.title + " × " + itemCounter);
    // let h3Text = document.createTextNode(ob.name)
    boxh3.appendChild(h3Text);
    boxDiv.appendChild(boxh3);

    let boxh4 = document.createElement("h4");
    let h4Text = document.createTextNode("Amount: " + ob.price + "$");
    boxh4.appendChild(h4Text);
    boxDiv.appendChild(boxh4);

    // console.log(boxContainerDiv);

    buttonLink.appendChild(buttonText);
    cartContainer.appendChild(boxContainerDiv);
    cartContainer.appendChild(totalContainerDiv);
    // let cartMain = document.createElement('div')
    // cartmain.id = 'cartMainContainer'
    // cartMain.appendChild(totalContainerDiv)

    return cartContainer;
}

let totalContainerDiv = document.createElement("div");
totalContainerDiv.id = "totalContainer";

let totalDiv = document.createElement("div");
totalDiv.id = "total";
totalContainerDiv.appendChild(totalDiv);

let totalh2 = document.createElement("h2");
let h2Text = document.createTextNode("Total Amount");
totalh2.appendChild(h2Text);
totalDiv.appendChild(totalh2);

let labelAddress = document.createElement("h4");
let inputAddress = document.createElement("input");
labelAddress.innerHTML = "Input your address";
inputAddress.className = "form-control mt-2 mb-4";
inputAddress.id = "input-address";
totalDiv.appendChild(labelAddress);
totalDiv.appendChild(inputAddress);

// TO UPDATE THE TOTAL AMOUNT
function amountUpdate(amount) {
    let totalh4 = document.createElement("h4");
    // let totalh4Text = document.createTextNode(amount)
    let totalh4Text = document.createTextNode("Amount: " + amount + "$");
    totalh4Text.id = "toth4";
    totalh4.appendChild(totalh4Text);
    totalDiv.appendChild(totalh4);
    totalDiv.appendChild(buttonDiv);
}

let buttonDiv = document.createElement("div");
buttonDiv.id = "button";
totalDiv.appendChild(buttonDiv);

let buttonTag = document.createElement("button");
buttonDiv.appendChild(buttonTag);

let buttonLink = document.createElement("a");
buttonTag.appendChild(buttonLink);

buttonText = document.createTextNode("Place Order");
buttonTag.onclick = function () {
    let counter = Number(
        document.cookie.split(",")[1].split(";")[0].split("=")[1]
    );
    let item = document.cookie.split(",")[0].split("=")[1].split(" ")[0];
    const data = {
        quantity: counter,
        address: document.getElementById("input-address").value,
        productId: item,
        userId: localStorage.getItem("userId"),
    };
    console.log(data);
    console.log(JSON.parse(localStorage.getItem("user")).accessToken);
    fetch("http://localhost:8080/api/order/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
            }`,
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.message === "Create order is success") {
                window.location.replace("../html/orderPlaced.html");
            }
        })
        .catch((error) => {
            console.log("Request failed", error);
        });
};

// EMPTY CART
let buttonEmpty = document.getElementById("empty");
buttonEmpty.onclick = function () {
    document.cookie = "orderId=" + 0 + ", counter=" + 0;
    window.location.reload();
};

// BACKEND CALL
async function downloadFile(img) {
    let image;
    await fetch("http://localhost:8080/api/product/downloadFile/" + img, {
        // Your POST endpoint
        method: "GET",
    })
        .then((response) => response.blob())
        .then((imageBlob) => {
            const imageObjectURL = URL.createObjectURL(imageBlob);
            image = imageObjectURL;
        });
    return image;
}

let httpRequest = new XMLHttpRequest();
let totalAmount = 0;
httpRequest.onreadystatechange = async function () {
    if (this.readyState === 4) {
        if (this.status == 200) {
            console.log("call successful");
            contentTitle = JSON.parse(this.responseText);

            let counter = Number(
                document.cookie.split(",")[1].split(";")[0].split("=")[1]
            );
            if (!counter) counter = 0;
            document.getElementById("totalItem").innerHTML =
                "Total Items: " + counter;

            let item = document.cookie.split(",")[0].split("=")[1].split(" ");
            let i;
            let totalAmount = 0;
            for (i = 0; i < counter; i++) {
                let itemCounter = 1;
                for (let j = i + 1; j < counter; j++) {
                    if (Number(item[j]) == Number(item[i])) {
                        itemCounter += 1;
                    }
                }
                let product = contentTitle.find((e) => e.id == item[0]);
                totalAmount += Number(product.price) * itemCounter;
                let img = await downloadFile(product.image);
                dynamicCartSection(product, itemCounter, img);
                i += itemCounter - 1;
            }
            amountUpdate(totalAmount);
        }
    } else {
        console.log("call failed!");
    }
};

httpRequest.open("GET", "http://localhost:8080/api/product/", true);
httpRequest.send();
