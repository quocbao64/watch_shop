console.clear();

let idx = location.search.split("?")[1];

function dynamicContentDetails(ob, img) {
    let mainContainer = document.createElement("div");
    mainContainer.id = "containerD";
    document.getElementById("containerProduct").appendChild(mainContainer);

    let imageSectionDiv = document.createElement("div");
    imageSectionDiv.id = "imageSection";

    let imgTag = document.createElement("img");
    imgTag.id = "imgDetails";
    //imgTag.id = ob.photos
    imgTag.src = img;

    imageSectionDiv.appendChild(imgTag);

    let productDetailsDiv = document.createElement("div");
    productDetailsDiv.id = "productDetails";

    // console.log(productDetailsDiv);

    let h1 = document.createElement("h1");
    let h1Text = document.createTextNode(ob.title);
    h1.appendChild(h1Text);

    let h4 = document.createElement("h4");
    let h4Text = document.createTextNode(ob.brand.name);
    h4.appendChild(h4Text);

    let detailsDiv = document.createElement("div");
    detailsDiv.id = "details";

    let h3DetailsDiv = document.createElement("h3");
    let h3DetailsText = document.createTextNode("Rs " + ob.price);
    h3DetailsDiv.appendChild(h3DetailsText);

    let h3 = document.createElement("h3");
    let h3Text = document.createTextNode("Description");
    h3.appendChild(h3Text);

    let para = document.createElement("p");
    let paraText = document.createTextNode(ob.description);
    para.appendChild(paraText);

    let productPreviewDiv = document.createElement("div");
    productPreviewDiv.id = "productPreview";

    let buttonDiv = document.createElement("div");
    buttonDiv.id = "button";

    let buttonTag = document.createElement("button");
    buttonDiv.appendChild(buttonTag);

    buttonText = document.createTextNode("Add to Cart");
    buttonTag.onclick = function () {
        let order = idx + " ";
        let counter = 1;
        if (localStorage.getItem("userId")) {
            if (document.cookie) {
                const orderCookie = document.cookie
                    .split(",")[0]
                    .split(" ")[0]
                    .split("=")[1];
                if (
                    orderCookie !== ob.id.toString() &&
                    orderCookie.length === 1 &&
                    document.cookie
                        .split(",")[0]
                        .split(" ")[0]
                        .split("=")[1] !== "0"
                ) {
                    alert("You can only have 1 item in your cart");
                    return;
                }
            }

            if (document.cookie.indexOf(",counter=") >= 0) {
                order =
                    idx +
                    " " +
                    document.cookie.split(",")[0].split(";")[0].split("=")[1];
                counter =
                    Number(
                        document.cookie
                            .split(",")[1]
                            .split(";")[0]
                            .split("=")[1]
                    ) + 1;
            }
            document.cookie = "orderId=" + order + ",counter=" + counter;
            document.getElementById("badge").innerHTML = 1;
        }
    };
    buttonTag.appendChild(buttonText);

    mainContainer.appendChild(imageSectionDiv);
    mainContainer.appendChild(productDetailsDiv);
    productDetailsDiv.appendChild(h1);
    productDetailsDiv.appendChild(h4);
    productDetailsDiv.appendChild(detailsDiv);
    detailsDiv.appendChild(h3DetailsDiv);
    detailsDiv.appendChild(h3);
    detailsDiv.appendChild(para);
    productDetailsDiv.appendChild(productPreviewDiv);

    productDetailsDiv.appendChild(buttonDiv);

    return mainContainer;
}

// BACKEND CALLING
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
{
    httpRequest.onreadystatechange = async function () {
        if (this.readyState === 4 && this.status == 200) {
            console.log("connected!!");
            let contentDetails = JSON.parse(this.responseText);
            let img = await downloadFile(contentDetails.image);
            {
                dynamicContentDetails(contentDetails, img);
            }
        } else {
            console.log("not connected!");
        }
    };
}

httpRequest.open("GET", "http://localhost:8080/api/product/" + idx, true);
httpRequest.send();
