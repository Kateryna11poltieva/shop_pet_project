const controller = async (url, method = 'GET', obj) => {
    let options = {
        method: method,
        headers: {
            "Content-type": "application/json"
        }
    }

    if (obj) options.body = JSON.stringify(obj);

    let request = await fetch(url, options);
    let response = request.ok ? request.json() : Promise.catch(request.statusText);

    return response;
};

const API = `https://634e9f834af5fdff3a625f84.mockapi.io`;

const headerContainer = document.querySelector('#headerContainer');

// header

let signedUser = JSON.parse(localStorage.getItem('user'));
console.log(signedUser)

const changeBusketCount=()=> {
    const html = document.querySelector('#headerShoppingCartCount')
    html.innerHTML = signedUser.shoppingCart.length

}

const renderHeader = () => {

    let headerInfoHtml = `Hi,
            <a href="${(signedUser === null) ? 'login.html' : 'account.html'}" class="header__user" id="headerUser">${(signedUser === null) ? 'Log in' : signedUser.name}</a>
            <div class="header__shop">
              <a href="${(signedUser === null) ? 'login.html' : 'shoppingCart.html'}" id="headerShoppingCart">
                <img
                  src="images/shopping-cart.png"
                  alt="shopping cart"
                  height="20"
                />
                <span class="header__shop--count" id="headerShoppingCartCount"
                  >${(signedUser === null) ? '0' : signedUser.shoppingCart.length}</span
                >
              </a>
            </div>
            ${(signedUser === null) ? '' : '<button class="header__logout active" id="headerLogout">Log out</button>'}
            `
    const hrefLogo = document.createElement('a');
    hrefLogo.href = "index.html";
    hrefLogo.innerHTML = '<img src="images/logo.png" alt="logo" height="45">';
    headerContainer.append(hrefLogo);
    const hederInfoDiv = document.createElement('div');
    hederInfoDiv.classList.add('header__info');
    hederInfoDiv.innerHTML = headerInfoHtml;
    headerContainer.append(hederInfoDiv);


};
renderHeader()

// header

//orderSummary
const productTotalPriceCount = (product, count) => {

    return product * count
}
const changeProductInShoppingCart = async (shoppingCart, id) => {

    try {
        let updatedUser = await controller(API + `/users/${id} `, `PUT`, {shoppingCart});
        signedUser = updatedUser;
        localStorage.setItem('user', JSON.stringify(updatedUser))

    } catch (err) {
        console.log(err)

    }

};
const changeProductTotalPrice = async (product) => {
    let newShoppingCardTotal = []
    let carentCount = signedUser.shoppingCart.find(obj => obj.id === product.id)
    if (carentCount.count >= 0) {
        carentCount.totalProductPrice = productTotalPriceCount(product.priceAfterSale, carentCount.count)
    } else {
        carentCount.totalProductPrice = '0'
    }

    signedUser.shoppingCart.map(item => newShoppingCardTotal.push(item))

    await changeProductInShoppingCart(newShoppingCardTotal, signedUser.id)


}
const changeProductCount = async (countFromImput, productId) => {

    let newShopingCartCount = []
    signedUser.shoppingCart.map(item => {
        if (item.id !== productId) {
            newShopingCartCount.push(item)
        } else if (item.id === productId) {
            item.count = countFromImput;
            newShopingCartCount.push(item)
        }
    })

   await changeProductInShoppingCart(newShopingCartCount, signedUser.id)
}
const totalOrderSum = () => {
    let productPrices = []
    signedUser.shoppingCart.map(product => productPrices.push(product.totalProductPrice))
    const totalPrice = productPrices.reduce((sum, currentValue) => sum + currentValue, 0)
    return totalPrice
}
const changeTotalOrderSum = ()=>{
    const total = document.querySelector('#orderSummaryTotal')
    total.innerHTML = totalOrderSum()
}
const renderOrderForm = () => {
    const shoppingCartContainer = document.querySelector('#shoppingCartContainer')
    const divOrderSummary = document.createElement('div')
    divOrderSummary.classList.add('order__summary')
    const orderSummaryForm = document.createElement('form')
    orderSummaryForm.id = 'orderSummary'

    const table = document.createElement('table')
    const caption = table.createCaption()
    caption.textContent = 'My Order Summary'
    const tbody = table.createTBody();
    const tr = tbody.insertRow();

    const th = document.createElement('th')
    th.innerHTML = 'Order Total'
    tr.append(th)

    const td = tr.insertCell()
    td.id = 'orderSummaryTotal'
    td.innerHTML = `$${totalOrderSum()}`


    const orderCompleteBtn = document.createElement('button')
    orderCompleteBtn.classList.add('btn')
    orderCompleteBtn.type = 'submit'
    orderCompleteBtn.innerHTML = `Complete Order`


    shoppingCartContainer.append(divOrderSummary)
    divOrderSummary.append(orderSummaryForm)
    orderSummaryForm.append(table)
    orderSummaryForm.append(orderCompleteBtn)
}
renderOrderForm()
const moveFromShoppingToOrder = async (orders, id) => {
    console.log('in mooving')
    try {
        console.log('in mooving')
        let updatedUser = await controller(API + `/users/${id} `, `PUT`, {orders});
        signedUser = updatedUser;
        localStorage.setItem('user', JSON.stringify(updatedUser))

    } catch (err) {
        console.log(err)

    }
}
const orderSummary = document.querySelector('#orderSummary')
orderSummary.addEventListener('submit', async event => {
    event.preventDefault();

    console.log('submit')

    const orderCart = []
    const shoppingCart = []

    signedUser.shoppingCart.map(item => orderCart.push(item))
    console.log(orderCart)
    await moveFromShoppingToOrder(orderCart, signedUser.id)
    await changeProductInShoppingCart(shoppingCart, signedUser.id)
    window.location.href = 'account.html'

})

//orderSummary

//shoppingCart

const onClickDeleteBtn = async (productId) => {
    console.log(productId)
    const tr = document.querySelector(`#product${productId}`)
    let newSoppingCart = [];
    signedUser.shoppingCart.map(product => {
        if (product.id !== productId) {
            newSoppingCart.push(product)
        }

    })
    await changeProductInShoppingCart(newSoppingCart, signedUser.id)
    changeBusketCount()
    changeTotalOrderSum()
    tr.remove()
}
const renderProduct = (eachProduct) => {
    const tbody = document.getElementById(`productTbody`)
    const tr = tbody.insertRow();
    tr.id = `product${eachProduct.id}`

    const itemDescription = tr.insertCell();// cell - ячейка td

    itemDescription.innerHTML = `<div class="item__info">
                    <img
                      src="images/products/${eachProduct.img}.png"
                      alt="${eachProduct.title}"
                      height="100"
                    />
                    <div>
                      <p class="item__info--title">${eachProduct.title}</p>
                    </div>
                  </div>`;

    const price = tr.insertCell();
    price.innerHTML = `$${eachProduct.price}`;

    const sale = tr.insertCell();
    sale.innerHTML = `<span class="item__sale">${(eachProduct.salePercent) ? `${eachProduct.salePercent}%` : `-`} </span>`;


    const span = document.createElement('span')
    const count = tr.insertCell();
    const inputCount = document.createElement('input');
    inputCount.type = 'number'
    inputCount.min = '0'
    inputCount.value = `${eachProduct.count}`
    count.append(inputCount)
    inputCount.addEventListener('change', () => {
        changeProductCount(inputCount.value, eachProduct.id);
        changeProductTotalPrice(eachProduct)
        let ua = signedUser.shoppingCart.find(obj => obj.id === eachProduct.id).totalProductPrice
        span.innerHTML = `$${ua}`
        const totalPrice = document.querySelector('#orderSummaryTotal')
        totalPrice.innerHTML = `$${totalOrderSum()}`

    })


    const sumPrice = tr.insertCell();
    span.innerHTML = `$${productTotalPriceCount(eachProduct.priceAfterSale, eachProduct.count)}`
    sumPrice.append(span)

    const btnRemove = tr.insertCell();
    const btn = document.createElement('button')
    btn.classList.add('item__remove')
    btn.innerHTML = '<img src="images/delete.png" alt="delete" height="20" />'
    btnRemove.append(btn)
    btn.addEventListener('click', () => onClickDeleteBtn(eachProduct.id))


}
const renderStorageCartTable = (thArray, captionText, signedUsersCart) => {

    let table = document.createElement(`table`)
    let caption = table.createCaption()
    caption.textContent = captionText
    table.id = 'shoppingCartTable'
    table.classList.add('order__table')
    let thead = table.createTHead();
    let tr = thead.insertRow();


    thArray.forEach(name => {
        const th = document.createElement('th');
        th.innerText = name;
        tr.append(th)
    });

    let tbody = table.createTBody();
    tbody.id = `productTbody`;

    const tableContainer = document.querySelector('#tableContainer');
    tableContainer.appendChild(table)

    if (signedUsersCart === 'shoppingCart') {
        signedUser.shoppingCart.forEach(product => renderProduct(product))
    } else if (signedUsersCart === 'orders') {
        signedUser.orders.forEach(product =>
            renderOrderProducts(product))

    }


}
const theadArray = [`Item Description`, `Price`, `Sale`, `Quantity`, `Total`, `Action`]
const captionShoppingCart = 'Items in Shopping Cart'
renderStorageCartTable(theadArray, captionShoppingCart, 'shoppingCart')

//shoppingCart
