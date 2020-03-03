const login = document.querySelector(".login")
const loginForm = document.querySelector("#login-form")
const contents = document.querySelector('#page-contents')
const pageTitle = document.querySelector('#page-title')
const header = document.querySelector('.header')
const canvas = document.createElement('canvas')
const infoForm = document.querySelector('#info-form')
canvas.id = "my-canvas"
canvas.width = "600"
canvas.height = "300"
let canvasWidth = 600
let canvasHeight = 300

const jscolorDiv = document.querySelector('#jsc')

const jscolor = document.querySelector('.jscolor')


const ctx = canvas.getContext('2d')
ctx.strokeStyle = jscolor.value;
ctx.lineWidth = 2;

let dragging = false;
// Stores line x & ys used to make brush lines
let brushXPoints = new Array();
let brushYPoints = new Array();
// Stores whether mouse is down
let brushDownPos = new Array();

// Stores size data used to create rubber band shapes
// that will redraw as the user moves the mouse
class ShapeBoundingBox{
    constructor(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}

// Holds x & y position where clicked
class MouseDownPos{
    constructor(x,y) {
        this.x = x,
        this.y = y;
    }
}

// Holds x & y location of the mouse
class Location{
    constructor(x,y) {
        this.x = x,
        this.y = y;
    }
}

// Holds x & y position where clicked
let mousedown = new MouseDownPos(0,0);
// Holds x & y location of the mouse
let loc = new Location(0,0);

document.addEventListener('DOMContentLoaded', function(e) {
    infoForm.remove()
    jscolorDiv.remove()
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        userLogin(e)
    })
})

function userLogin(e) {
    let configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"username": e.target.username.value})
    };
    fetch("http://localhost:3000/users", configObj)
    .then(function(response) {
        return response.json();
    })
    .then(function(user) {
        login.dataset.id = user.id
        login.style.display = "block"
        login.addEventListener('click', function(e) {
            logOut()
        })
        login.parentElement.querySelector('h3').innerText = user.username
        loginForm.remove()
        buildHeader(user.balance)
        displayGallery(user)
    })
    e.target.reset()
}

function logOut(){
    pageTitle.innerText = "Please Log In"
    login.dataset.id = ''
    login.parentElement.querySelector('h3').innerText = ''
    contents.innerHTML = ''
    contents.appendChild(loginForm)
    let paras = document.getElementsByClassName('header-toggle');
    while(paras[0]) {
        paras[0].parentNode.removeChild(paras[0])
    }

    login.style.display = "none"
}

function displayGallery(user) {
    pageTitle.innerText = "My Gallery"
    contents.innerHTML = ''
    const gallery = document.createElement('div')
    gallery.id = "gallery"
    user.images.forEach(function(image) {
        let imageCard = displayImage(image)
        gallery.appendChild(imageCard)
    })

    contents.appendChild(gallery)
}

function displayImage(image) {
    const imageCard = document.createElement('div')

    const imageDisp = document.createElement('img')
    if (image.imgdata) {
        imageDisp.src = image.imgdata
        imageDisp.className = "sticker-display"
    }

    const editButton = document.createElement('button')
    editButton.innerText = "Edit Picture"
    editButton.addEventListener('click', function(e) {
        canvas.dataset.id = image.id
        createCanvas()
        OpenImage()
    })

    const deleteButton = document.createElement('button')
    deleteButton.innerText = "Delete Picture"
    deleteButton.dataset.id = image.id
    deleteButton.addEventListener('click', function(e) {
        deleteImage(e.target.dataset.id)
    })

    const imgTitle = document.createElement('h4')
    if (image.title) {
        imgTitle.innerText = image.title
    } else {
        imgTitle.innerText = "Untitled"
    }

    imageCard.appendChild(imageDisp)
    imageCard.appendChild(imgTitle)

    if (image.for_sale) {
        const salePrice = document.createElement('p')
        salePrice.innerText = `Currently for sale for $${image.cost}`
        const numSold = document.createElement('p')
        numSold.innerText = `${image.title} has been sold ${image.purchases.length} times`
        const br = document.createElement('br')
        imageCard.appendChild(salePrice)
        imageCard.appendChild(br)
        imageCard.appendChild(numSold)
    }

    imageCard.appendChild(editButton)
    imageCard.appendChild(deleteButton)

    return imageCard
}

function buildHeader(balance){
    const galleryButton = document.createElement('button')
    galleryButton.innerText = "My Gallery"
    galleryButton.className = "header-toggle"
    galleryButton.addEventListener('click', function(e){
        getGallery()
    })

    const stickersButton = document.createElement('button')
    stickersButton.innerText = "My Stickers"
    stickersButton.className = "header-toggle"
    stickersButton.addEventListener('click', function(e) {
        getStickers()
    })

    const storeButton = document.createElement('button')
    storeButton.innerText = "Store"
    storeButton.className = "header-toggle"
    storeButton.addEventListener('click', function(e) {
        renderStore()
    })

    const newDrawingButton = document.createElement('button')
    newDrawingButton.innerText = "New Drawing"
    newDrawingButton.className = "header-toggle"
    newDrawingButton.addEventListener('click', function(e) {
        canvas.dataset.id = ''
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        createCanvas()
    })

    const balanceCount = document.createElement('h4')
    balanceCount.id = 'balance-count'
    balanceCount.innerText = `Current Balance: $${balance}`
    balanceCount.className = "header-toggle"

    header.appendChild(galleryButton)
    header.appendChild(stickersButton)
    header.appendChild(balanceCount)
    header.appendChild(storeButton)
    header.appendChild(newDrawingButton)
}

function getGallery() {
    fetch(`http://localhost:3000/users/${login.dataset.id}`)
    .then(function(response) {
        return response.json();
    })
    .then(function(user) {
        displayGallery(user)
    })
}

function createCanvas() {
    pageTitle.innerText = "Sticker Canvas"
    contents.innerHTML = ''
    contents.appendChild(canvas)
    contents.appendChild(jscolorDiv)
    canvas.addEventListener("mousedown", ReactToMouseDown);
    canvas.addEventListener("mousemove", ReactToMouseMove);
    canvas.addEventListener("mouseup", ReactToMouseUp);

    const saveButton = document.createElement('button')
    saveButton.innerText = "Save Sticker"
    saveButton.addEventListener('click', function(e) {
        SaveImage()
    })

    const loadButton = document.createElement('button')
    loadButton.innerText = "Load Sticker"
    loadButton.addEventListener('click', function(e) {
        OpenImage()
    })

    contents.appendChild(saveButton)
    contents.appendChild(loadButton)
}

function GetMousePosition(x,y){
    let canvasSizeData = canvas.getBoundingClientRect();
    return { x: (x - canvasSizeData.left) * (canvas.width  / canvasSizeData.width),
        y: (y - canvasSizeData.top)  * (canvas.height / canvasSizeData.height)
    };
}

function SaveImage(){
    savedImageData = canvas.toDataURL();
    if (canvas.dataset.id) {
        let configObj = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"imgdata": savedImageData})
        };
        fetch(`http://localhost:3000/images/${canvas.dataset.id}`, configObj)
    } else {
        let configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "imgdata": savedImageData,
                "user_id": login.dataset.id
            })
        };
        fetch("http://localhost:3000/images", configObj)
        .then(function(response) {
            return response.json();
        })
        .then(function(image) {
            canvas.dataset.id = image.id
        })
    }
}

function OpenImage() {
    if (canvas.dataset.id) {
        fetch(`http://localhost:3000/images/${canvas.dataset.id}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(image) {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight)
            var img = new Image;
            img.onload = () => { ctx.drawImage(img, 0, 0); };
            img.src = image.imgdata;
            renderImageInfo(image)
        })
    }
}

function UpdateRubberbandSizeData(loc){
    shapeBoundingBox.width = Math.abs(loc.x - mousedown.x);
    shapeBoundingBox.height = Math.abs(loc.y - mousedown.y);

    if(loc.x > mousedown.x){

        shapeBoundingBox.left = mousedown.x;
    } else {
        shapeBoundingBox.left = loc.x;
    }

    if(loc.y > mousedown.y){
        shapeBoundingBox.top = mousedown.y;
    } else {
        shapeBoundingBox.top = loc.y;
    }
}


function drawRubberbandShape(loc){
    ctx.strokeStyle = jsColor;
    ctx.fillStyle = fillColor;
    DrawBrush();
}

function AddBrushPoint(x, y, mouseDown){
    brushXPoints.push(x);
    brushYPoints.push(y);
    brushDownPos.push(mouseDown);
}

function DrawBrush(){
    for(let i = lastMouseDown; i < brushXPoints.length; i++){
        ctx.beginPath();

        if(brushDownPos[i]){
            ctx.moveTo(brushXPoints[i-1], brushYPoints[i-1]);
        } else {
            ctx.moveTo(brushXPoints[i]-1, brushYPoints[i]);
        }
        ctx.lineTo(brushXPoints[i], brushYPoints[i]);
        ctx.closePath();
        ctx.stroke();
    }
}
 
function ReactToMouseDown(e){
    canvas.style.cursor = "crosshair";
    lastMouseDown = brushXPoints.length
    ctx.strokeStyle = `#${jscolor.value}`
    
    loc = GetMousePosition(e.clientX, e.clientY);

    mousedown.x = loc.x;
    mousedown.y = loc.y;

    dragging = true;

    usingBrush = true;
    AddBrushPoint(loc.x, loc.y);
};
 
function ReactToMouseMove(e){
    canvas.style.cursor = "crosshair";
    loc = GetMousePosition(e.clientX, e.clientY);

    if(dragging && usingBrush){
        if(loc.x > 0 && loc.x < canvasWidth && loc.y > 0 && loc.y < canvasHeight){
            AddBrushPoint(loc.x, loc.y, true);
        }
        DrawBrush();
    } else {
        if(dragging){
            UpdateRubberbandOnMove(loc);
        }
    }
};
 
function ReactToMouseUp(e){
    canvas.style.cursor = "default";
    loc = GetMousePosition(e.clientX, e.clientY);
    // UpdateRubberbandOnMove(loc);
    dragging = false;
    usingBrush = false;
}

function deleteImage(id) {
    let configObj = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    };
    fetch(`http://localhost:3000/images/${id}`, configObj)
    .then(function(i) {
        getGallery()
    })
}

function renderImageInfo(image) {
    imageTitle = document.createElement('h2')
    imageTitle.innerText = image.title 

    imageCost = document.createElement('h4')
    imageCost.innerText = `The current cost is ${image.cost} dollars`

    saleStatusButton = document.createElement('button')
    if (image.for_sale) {
        saleStatusButton.innerText = "Up For Sale"
    } else {
        saleStatusButton.innerText = "Not Up For Sale"
    }
    saleStatusButton.addEventListener('click', function(e) {
        let status
        if (e.target.innerText === "Up For Sale") {
            e.target.innerText = "Not Up For Sale"
            status = false
        } else {
            e.target.innerText = "Up For Sale"
            status = true
        }
        toggleSaleStatus(status)
    })

    editImageInfoButton = document.createElement('button')
    editImageInfoButton.innerText = "Edit info?"
    editImageInfoButton.addEventListener('click', function(e) {
        renderInfoForm()
    })
    contents.appendChild(imageTitle)
    contents.appendChild(imageCost)
    contents.appendChild(saleStatusButton)
    contents.appendChild(editImageInfoButton)
    infoForm.querySelector('#title').value = image.title
    infoForm.querySelector('#cost').value = image.cost
    infoForm.dataset.id = image.id
}

function renderInfoForm(){
    contents.appendChild(infoForm)
    infoForm.addEventListener('submit', function(e) {
        e.preventDefault()
        editInfo(e)
    })
}

function toggleSaleStatus(status) {
    let configObj = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"for_sale": status})
    };
    fetch(`http://localhost:3000/images/${canvas.dataset.id}`, configObj)
}

function editInfo(e) {
    let configObj = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "cost": parseFloat(e.target.cost.value),
            "title": e.target.title.value
        })
    };
    fetch(`http://localhost:3000/images/${canvas.dataset.id}`, configObj)
    .then(function(response) {
        return response.json();
    })
    .then(function(image) {
        createCanvas()
        OpenImage()
    })
}

function renderStore() {
    pageTitle.innerText = "Sticker Store"
    contents.innerHTML = ''
    const store = document.createElement('div')
    store.id = "store"

    fetch(`http://localhost:3000/images`)
    .then(function(response) {
        return response.json();
    })
    .then(function(images) {
        let saleImages = images.filter(image => image.for_sale)
        saleImages.forEach(function(image) {
            store.appendChild(renderStoreItem(image))
        })
        contents.appendChild(store)
    })
}

function renderStoreItem(image) {
    const imageCard = document.createElement('div')

    const imageDisp = document.createElement('img')
    imageDisp.src = image.imgdata
    imageDisp.className = "sticker-display"

    const imgTitle = document.createElement('h4')
    if (image.title) {
        imgTitle.innerText = image.title
    } else {
        imgTitle.innerText = "Untitled"
    }

    imageCard.appendChild(imageDisp)
    imageCard.appendChild(imgTitle)

    const seller = document.createElement('p')
    seller.innerText = `Drawn by: ${image.user.username}`
    const salePrice = document.createElement('p')
    salePrice.innerText = `Currently on sale for $${image.cost}`

    const buyForm = document.createElement('form')
    buyForm.dataset.id = image.id

    const buyField = document.createElement('input')
    buyField.type = "number"
    buyField.placeholder = "Purchase Amount"
    buyField.name = 'quantity'
    buyField.min = "1"

    const buySubmit = document.createElement('input')
    buySubmit.type = 'submit'
    buySubmit.value = 'Buy'

    buyForm.appendChild(buyField)
    buyForm.appendChild(buySubmit)

    buyForm.addEventListener('submit', function(e){
        e.preventDefault()
        buySticker(e)
        e.target.reset()
    })

    imageCard.appendChild(seller)
    imageCard.appendChild(salePrice)
    imageCard.appendChild(buyForm)


    return imageCard
}

function buySticker(e) {
    let configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "image_id": e.target.dataset.id,
            "user_id": login.dataset.id,
            "amount": parseInt(e.target.quantity.value)
        })
    };
    fetch("http://localhost:3000/purchases", configObj)
    .then(function(response) {
        return response.json();
    })
    .then(function(purchases) {
        if (purchases[0].image.user.id !== login.dataset.id) {
            let amount = (purchases.length * parseFloat(purchases[0].image.cost))
            let sellerBalance = parseFloat(purchases[0].image.user.balance) + amount
            let buyerBalance = parseFloat(purchases[0].user.balance) - amount
            sellerId = purchases[0].image.user.id
            debugger
            console.log(purchases)
            let configObj = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({"balance": sellerBalance})
            };
            fetch(`http://localhost:3000/users/${sellerId}`, configObj)
            
            let configObj2 = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({"balance": buyerBalance})
            };
            fetch(`http://localhost:3000/users/${login.dataset.id}`, configObj2)
            .then(function(response) {
                return response.json();
            })
            .then(function(user) {
                document.querySelector('#balance-count').innerText = `Current Balance: $${user.balance}`
            })
        }
    })
}

function getStickers() {
    pageTitle.innerText = "My Stickers"
    contents.innerHTML = ''
    fetch(`http://localhost:3000/users/stickers/${login.dataset.id}`)
    .then(function(response) {
        return response.json();
    })
    .then(function(stickers) {
        const gallery = document.createElement('div')
        gallery.id = "gallery"
        stickers.forEach(function(sticker) {
            stickerCard = renderSticker(sticker)
            gallery.appendChild(stickerCard)
        })
        contents.appendChild(gallery)
    })
}

function renderSticker(sticker) {
    const imageCard = document.createElement('div')
    let image = sticker.sticker

    const imageDisp = document.createElement('img')
    if (image.imgdata) {
        imageDisp.src = image.imgdata
        imageDisp.className = "sticker-display"
    }

    const imgTitle = document.createElement('h4')
    if (image.title) {
        imgTitle.innerText = image.title
    } else {
        imgTitle.innerText = "Untitled"
    }

    imageCard.appendChild(imageDisp)
    imageCard.appendChild(imgTitle)

    const salePrice = document.createElement('p')
    salePrice.innerText = `Bought ${sticker.amount} times for $${image.cost} each`
    const artistName = document.createElement('p')
    artistName.innerText = `${image.title} was drawn by ${image.user.username}`
    const br = document.createElement('br')
    imageCard.appendChild(salePrice)
    imageCard.appendChild(br)
    imageCard.appendChild(artistName)

    return imageCard
}
