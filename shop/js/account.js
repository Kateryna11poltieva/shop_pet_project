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
                  >${(signedUser === null)?'0':signedUser.shoppingCart.length}</span
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

    if (signedUsersCart==='shoppingCart'){
        signedUser.shoppingCart.forEach(product => renderProduct(product))
    }else if (signedUsersCart === 'orders') {
        signedUser.orders.forEach(product =>
            renderOrderProducts(product))

    }



}
const renderOrderProducts= (eachProduct)=>{
    console.log(eachProduct)

    const tbody = document.getElementById(`productTbody`)
    const tr = tbody.insertRow();

    const itemDescription = tr.insertCell()// cell - ячейка td

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

    const count =tr.insertCell()
    count.innerHTML =`${eachProduct.count}`

    const sumPrice = tr.insertCell();
    sumPrice.innerHTML = `$${eachProduct.totalProductPrice}`

}
const changeStatus = async (status, id) => {

    try {
        let updatedUser = await controller(API + `/users/${id} `, `PUT`, {status});
        signedUser = updatedUser;
        localStorage.setItem('user', JSON.stringify(updatedUser))

    } catch (err) {
        console.log(err)

    }

    console.log(signedUser)

};
const renderAccountSummary= () =>{
    const orderSummaryDiv = document.createElement('div')
    orderSummaryDiv.classList.add('order__summary')

    const table = document.createElement('table')
    let caption = table.createCaption()
    caption.textContent = 'My Info'
    let tbody = table.createTBody();
    const tr = tbody.insertRow();

    const nameTh=document.createElement('th')
    nameTh.innerHTML = 'Name:'
    tr.append(nameTh)
    const userName = tr.insertCell()
    userName.id = 'userInfoEmail'
    userName.innerHTML= signedUser.name

    const tr1 = tbody.insertRow();

    const emailTh = document.createElement('th')
    emailTh.innerHTML = 'Email:'
    tr1.append(emailTh)
    const userEmail = tr1.insertCell()
    userEmail.id = 'userInfoEmail'
    userEmail.innerHTML= signedUser.email

    const divBtns = document.createElement('div')
    divBtns.classList.add('order__summary--btns')
    const btn = document.createElement('button')
    btn.type= 'button'
    btn.id = 'deleteAcc'
    btn.innerHTML = 'Delete account'
    btn.classList.add('btn')
    btn.classList.add('delete__acc')
    divBtns.append(btn)




    const shoppingConteiner = document.querySelector('#shoppingCartContainer')
    shoppingConteiner.append(orderSummaryDiv)
    orderSummaryDiv.appendChild(table)
    orderSummaryDiv.appendChild(divBtns)

    btn.addEventListener('click' ,() => {
        changeStatus(false, signedUser.id)
        localStorage.removeItem('user')
        window.location.href = 'index.html'
    })
}

//accountPage

const orderThArray =  [`Item Description`, `Price`, `Sale`, `Quantity`, `Total`]
const orderCaption = 'Ordered Items'
renderStorageCartTable(orderThArray, orderCaption, 'orders' )
renderAccountSummary()

//accountPage