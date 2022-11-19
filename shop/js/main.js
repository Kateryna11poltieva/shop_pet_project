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

const API = `https://634e9f834af5fdff3a625f84.mockapi.io`;// не забыть поменять на актуальный апи из задания
const APIPRODUCT = 'https://634e9f834af5fdff3a625f84.mockapi.io/products'



const headerContainer = document.querySelector('#headerContainer');

// header
 let signedUser = JSON.parse(localStorage.getItem('user'));
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
const categoriesContainer = document.querySelector('#categoriesContainer');



//categories

class Categories {
    constructor(productsFromServer) {
        let categoriesArray = productsFromServer.map(product => product.category)
        this.categories = [...new Set(categoriesArray)]
    }

    getSectionHTML(categoryName) {
        const sectionCategory = `<section class="category" data-name="${categoryName}">
          <h2>${categoryName}</h2>
          <div id="${categoryName}Container" class="category__container"></div>`
        return sectionCategory

    }

    render() {
        const html = this.categories.map(categoryName => this.getSectionHTML(categoryName)).join('')
        categoriesContainer.innerHTML = html;
    }
}


class Products {
    constructor(product) {
        Object.assign(this, product);
    }

    salePercentCount = (price, salePercent) => {
        let sale = price / 100 * salePercent;
        let result = price - sale;
        return result
    }


    getProductInfoDiv(id) {

        const btnProductCart = document.createElement(`button`);
        btnProductCart.id= `btn-${id}`

        if (signedUser !== null){
            if(signedUser.shoppingCart.some(element => element.id === id)) {
                btnProductCart.classList.add('product__cart--in','product__cart')

            }else{
                btnProductCart.classList.add('product__cart')
            }
        } else {
            btnProductCart.classList.add('product__cart')
        }




        btnProductCart.innerHTML = `<img
                        src="images/shopping-cart.png"
                        alt="shopping cart"
                        height="20"
                    />`;

        const div = document.createElement('div');
        div.classList.add('product__info')
        div.innerHTML = `<span
                    class="product__price">${(this.sale === true) ? this.salePercentCount(this.price, this.salePercent) : this.price}
                    </span>`;
        div.appendChild(btnProductCart)

        btnProductCart.onclick = () =>this.clickBtn(id)

        return div


    }

   changeProductInShoppingCart = async (shoppingCart, id) => {

        try {
            let updatedUser = await controller(API + `/users/${id} `, `PUT`, {shoppingCart});
            signedUser = updatedUser;
            localStorage.setItem('user', JSON.stringify(updatedUser))

            console.log(signedUser)
        } catch (err) {
            console.log(err)

        }

    };

    clickBtn = async (id) => {
        const clickedProduct = {
            id: this.id,
            count: 1,
            img:this.img,
            title: this.title,
            salePercent: this.salePercent,
            price: this.price,
            priceAfterSale:(this.sale === true) ? this.salePercentCount(this.price, this.salePercent) : this.price,
            totalProductPrice: (this.sale === true) ? this.salePercentCount(this.price, this.salePercent) : this.price


        };
        const btn = document.querySelector(`#btn-${id}`)

        if (signedUser === null) {
            window.location.href = 'login.html'
        } else if (!signedUser.shoppingCart.some((item) => {
            return item.id === clickedProduct.id
        })) {
          await  this.changeProductInShoppingCart([...signedUser.shoppingCart, clickedProduct], signedUser.id);
            btn.classList.add('product__cart--in')

        } else {
            let newSoppingCart = [];
            signedUser.shoppingCart.map(product => {
                if (product.id !== clickedProduct.id) {
                    newSoppingCart.push(product)
                }

            })
          await  this.changeProductInShoppingCart(newSoppingCart, signedUser.id)
            btn.classList.remove('product__cart--in')

        }

        changeBusketCount()
    }


    renderProduct() {
        const salePriceDiv = `<div class="product__sale">
                <span class="product__sale--old">$${this.price}</span>
                <span class="product__sale--percent">-${this.salePercent}%</span>
            </div>`

        const isSale = (this.sale === true) ? salePriceDiv : '';


        const productHTML = `
            <img
                src="images/products/${this.img}.png"
                class="product__img"
                alt="${this.title}"
                height="80"
            />
            <p class="product__title">${this.title}</p>
            ${isSale}`


        const targetContainer = document.querySelector(`#${this.category}Container`)
        const productDiv = document.createElement('div')
        productDiv.classList.add('product')
        productDiv.dataset.id = this.id
        productDiv.innerHTML = productHTML
        const productInfoDiv = this.getProductInfoDiv(this.id)
        productDiv.appendChild(productInfoDiv)
        targetContainer.append(productDiv)

    }


}


class Boat extends Products {
    constructor(data) {
        super(data);
    }
}

class Car extends Products {
    constructor(data) {
        super(data);
    }
}

class Aircraft extends Products {
    constructor(data) {
        super(data);
    }
}

class Helicopter extends Products {
    constructor(data) {
        super(data);
    }
}

class Bus extends Products {
    constructor(data) {
        super(data);
    }
}

class Bike extends Products {
    constructor(data) {
        super(data);
    }
}

const NEW_PRODUCT = {
    Boat: product => new Boat(product),
    Car: product => new Car(product),
    Aircraft: product => new Aircraft(product),
    Helicopter: product => new Helicopter(product),
    Bus: product => new Bus(product),
    Bike: product => new Bike(product),

}


const init = async () => {
    let PRODUCTS = await controller(APIPRODUCT)
    const categoryRender = new Categories(PRODUCTS)
    categoryRender.render()
    let productClasses = PRODUCTS.map(item => NEW_PRODUCT[item.category] ? NEW_PRODUCT[item.category](item) : new Products(item));
    productClasses.forEach(productClass => productClass.renderProduct())


}

init()


//categories