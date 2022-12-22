// console.clear();

let contentTitle;

function dynamicClothingSection(ob, img) {
    let boxDiv = document.createElement("div");
    boxDiv.id = "box";

    let boxLink = document.createElement("a");
    // boxLink.href = '#'
    boxLink.href = "../html/contentDetails.html?" + ob.id;
    // console.log('link=>' + boxLink);

    let imgTag = document.createElement("img");
    // imgTag.id = 'image1'
    // imgTag.id = ob.photos
    imgTag.src = img;

    let detailsDiv = document.createElement("div");
    detailsDiv.id = "details";

    let h3 = document.createElement("h3");
    let h3Text = document.createTextNode(ob.title);
    h3.appendChild(h3Text);

    let h4 = document.createElement("h4");
    let h4Text = document.createTextNode(ob.brand.name);
    h4.appendChild(h4Text);

    let h2 = document.createElement("h2");
    let h2Text = document.createTextNode("rs  " + ob.price);
    h2.appendChild(h2Text);

    boxDiv.appendChild(boxLink);
    boxLink.appendChild(imgTag);
    boxLink.appendChild(detailsDiv);
    detailsDiv.appendChild(h3);
    detailsDiv.appendChild(h4);
    detailsDiv.appendChild(h2);

    return boxDiv;
}

let mainContainer = document.getElementById("mainContainer");
let containerClothing = document.getElementById("containerClothing");
let containerAccessories = document.getElementById("containerAccessories");

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

httpRequest.onreadystatechange = async function () {
    if (this.readyState === 4) {
        if (this.status == 200) {
            // console.log('call successful');
            contentTitle = JSON.parse(this.responseText);
            for (let i = 0; i < contentTitle.length; i++) {
                let img = await downloadFile(contentTitle[i].image);
                if (i < 5) {
                    containerClothing.appendChild(
                        dynamicClothingSection(contentTitle[i], img)
                    );
                }
                containerAccessories.appendChild(
                    dynamicClothingSection(contentTitle[i], img)
                );
            }
        } else {
            console.log("call failed!");
        }
    }
};
httpRequest.open("GET", "http://localhost:8080/api/product", true);
httpRequest.send();
