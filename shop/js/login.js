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
};//повтор


const API = `https://634e9f834af5fdff3a625f84.mockapi.io`;


const loginForm = document.querySelector('#loginForm');
const signUserEmail = document.querySelector('#signUserEmail');
const signError = document.querySelector('#signError');
const signUserPassword = document.querySelector('#signUserPassword');
const registrationForm = document.querySelector('#registrationForm');
const registrationPassword = document.querySelector('#registrationPassword');
const registrationPasswordVerify = document.querySelector('#registrationPasswordVerify');
const registrationError = document.querySelector('#registrationError');
const registrationUserEmail = document.querySelector('#registrationUserEmail');
const newUserName = document.querySelector('#newUserName');
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

//login page
const updateStatus = async (status, id) => {

    try {
        let changedStatus = await controller(API + `/users/${id} `, `PUT`, {status});
    } catch (error) {
        console.log(error)

    }

}

loginForm.addEventListener('submit', async event => {
    event.preventDefault();

    try {
        let storageUsers = await controller(API + '/users');// массив с обьктами юзеров

        let availableEmailInStorage = storageUsers.find(user => user.email === signUserEmail.value);
        let availablePasswordInStorage = storageUsers.find(user => user.password.toString() === signUserPassword.value.toString());

        if (!availableEmailInStorage) {
            signError.innerHTML = 'Invalid email address'
            signError.classList.add('active')
        } else if (!availablePasswordInStorage) {
            signError.innerHTML = 'Invalid password'
            signError.classList.add('active')

        } else {
            updateStatus(true, availablePasswordInStorage.id);
            console.log(availablePasswordInStorage);

            localStorage.setItem('user', JSON.stringify(availablePasswordInStorage));
            window.location.href = 'index.html'
        }

    } catch (error) {
        console.log(error)
    }


});//добавить обновление страницы после логина

registrationForm.addEventListener('submit', async event => {
    event.preventDefault();

    try {
        if (registrationPassword.value.toString() !== registrationPasswordVerify.value.toString()) {
            registrationError.innerHTML = 'Password not matches!'
            registrationError.classList.add('active')
            return
        }

        let storageUsers = await controller(API + '/users');// массив с обьктами юзеров
        let availableUserInStorage = storageUsers.find(user => user.email === registrationUserEmail.value);
        //обьект юзера с имеющимся эмелилом или андерфайнд

        let newUser = {
            name: newUserName.value,
            email: registrationUserEmail.value,
            password: registrationPassword.value,
            orders: [],
            shoppingCart: [],
            status: true,

        };

        if (availableUserInStorage && availableUserInStorage.email === registrationUserEmail.value) {
            registrationError.innerHTML = `User with email ${registrationUserEmail.value} already exist!`
            registrationError.classList.add('active')
        } else {
            let addedNewUser = await controller(API + `/users `, `POST`, newUser);
            localStorage.setItem('user', JSON.stringify(addedNewUser));
            window.location.href = 'index.html'
        }
    } catch (error) {
        console.log(error)
    }
})

//login page

