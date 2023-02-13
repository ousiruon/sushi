import { menuArray,orderListArray } from "./data.js";
function renderItems() {
    const menuDiv = document.querySelector('#menu');
    let menuHTML = '';
    menuArray.forEach((item,index) => {
        menuHTML += 
        `
            <div class="item" data-id=${item.id}>
                <img src="${item.img}" alt="${item.name}'s photo">
                <div class="item-presentation">
                    <h3>${item.name}</h3>
                    <div class="details">More details</div>
                    <div class="price">$CAD ${item.price}</div>
                </div>
                <div class="quantity">
                    <div class="decrement inactive"><img src="./img/minus.png"></div>
                    <div class="number-items with-${item.id}">0</div>
                    <div class="increment"><img src="./img/plus.png"></div>
                </div>
            </div>
            <div class="item more-details with-${item.id} hidden" data-id=${item.id}>
                <img class="close" src="./img/close.png"/>   
                <h3>${item.name}</h3>      
                <img class="details-img" src="${item.img}" alt="${item.name}'s photo">
                <div class="quantity">
                    <div class="decrement inactive"><img src="./img/minus.png"></div>
                    <div class="number-items with-${item.id}">0</div>
                    <div class="increment"><img src="./img/plus.png"></div>
                </div>
                <div class="desc">Description: ${item.desc}</div>
                <div class="ingredients">Ingredients: ${item.ingredients}</div>
            </div>
        `;
    });
    menuDiv.innerHTML = menuHTML;
}
renderItems();
function renderOrder(orderListArray) {
    const orderList = document.querySelector('#order-list');
    const orderContainer = document.querySelector('.your-order');
    if (orderListArray.length > 0 && orderContainer.classList.contains('hidden')) {
        orderContainer.classList.toggle('hidden');
    }
    else if (orderListArray.length < 1 && !(orderContainer.classList.contains('hidden'))) {
        orderContainer.classList.toggle('hidden');
    }
    let orderItem = '';
    let finalPrice = 0;
    orderListArray.forEach((element) => {
        const idFromMainList = element.idFromMainList;
        const numberOfItems = element.numberOfItems;
        const nameOfProduct = menuArray[idFromMainList].name;
        const priceOfProduct = menuArray[idFromMainList].price;
        let productTotalPrice = priceOfProduct * numberOfItems;
        productTotalPrice = productTotalPrice.toFixed(2);
        productTotalPrice = parseFloat(productTotalPrice);
        orderItem += 
        `
        <li>
            <h4>${nameOfProduct}</h4>
        `;
        if (numberOfItems > 1) {
            orderItem += 
                    `                  
                    <div class="quantity">
                        x <div class="number-items with-${idFromMainList}">${numberOfItems}</div>
                    </div>
                    `;
        }
        orderItem += 
        `
            <div class="price">$ CAD ${productTotalPrice}</div>
        </li>
        `;
        finalPrice += productTotalPrice;
    });
    orderItem += 
    `
    <li class="total-price">
        Total price:
        <div class="final-price">$ CAD ${finalPrice}</div>
    </li>
    <li class="order">
        Complete order
    </li>
    `;
    orderList.innerHTML = orderItem;
}
window.addEventListener('load',()=> {
    const divClicked = document.querySelector('.main-container');
    const form = document.querySelector("#payment");
    function getIDfromDIv(closestParent) {
        if (closestParent.dataset.id) {
            let dataID;
            return dataID = closestParent.dataset.id;
        }
    }
    function incrementOrderArray (currentProductID) {
        const currentItems = document.querySelectorAll('.number-items.with-'+currentProductID);
        currentProductID = parseInt(currentProductID);
        if (orderListArray.length === 0) {
            let idNumber = 0;
            orderListArray.push(
                {
                    id: idNumber,
                    idFromMainList: currentProductID,
                    numberOfItems: 1,
                }
            );
            currentItems.forEach((element) => {
                element.textContent = "1";
                const currentMinus = element.previousElementSibling;
                if (currentMinus && currentMinus.classList.contains('inactive')) {
                    currentMinus.classList.remove('inactive');
                }
            });
        } 
        else {
            function filterByID(element) {
                if ((element.idFromMainList) === currentProductID) {
                    return true;
                }
                else {
                    return false;
                }
            }
            const currentproductArray = orderListArray.filter(filterByID);
            if (currentproductArray.length > 0) {
                currentproductArray[0].numberOfItems++;
                currentItems.forEach((element) => {
                    element.textContent = currentproductArray[0].numberOfItems;
                    const currentMinus = element.previousElementSibling;
                    if (currentMinus && currentMinus.classList.contains('inactive')) {
                        currentMinus.classList.remove('inactive');
                    }
                });
            }
            else {         
                orderListArray.push(
                    {
                        id: orderListArray.length,
                        idFromMainList: currentProductID,
                        numberOfItems: 1,
                    }
                );
                currentItems.forEach((element) => {
                    element.textContent = "1";
                    const currentMinus = element.previousElementSibling;
                    if (currentMinus && currentMinus.classList.contains('inactive')) {
                        currentMinus.classList.remove('inactive');
                    }
                });
            }
        }        
    }
    function decrementOrderArray(currentProductID) {
        const currentItems = document.querySelectorAll('.number-items.with-'+currentProductID);
        currentProductID = parseInt(currentProductID);
        if (orderListArray.length > 0) {
            function filterByID(element) {
                if ((element.idFromMainList) === currentProductID) {
                    return true;
                }
                else {
                    return false;
                }
            }
            let currentproductArray = orderListArray.filter(filterByID);
            if (currentproductArray.length > 0) {
                if (currentproductArray[0].numberOfItems > 1) {
                    currentproductArray[0].numberOfItems--;
                    currentItems.forEach((element) => {
                        element.textContent = currentproductArray[0].numberOfItems;
                    });
                }
                else if (currentproductArray[0].numberOfItems === 1) {
                    let currentArrayID = currentproductArray[0].id;
                    if (orderListArray.length === 1) {
                        orderListArray.pop();
                        currentItems.forEach((element) => {
                            element.textContent = '0';
                            const currentMinus = element.previousElementSibling;
                            if (currentMinus && !(currentMinus.classList.contains('inactive'))) {
                                currentMinus.classList.add('inactive');
                            }
                        });
                    }
                    else {
                        orderListArray.splice(currentArrayID,1);
                        currentItems.forEach((element) => {
                            element.textContent = '0';
                            const currentMinus = element.previousElementSibling;
                            if (currentMinus && !(currentMinus.classList.contains('inactive'))) {
                                currentMinus.classList.add('inactive');
                            }
                        });
                    }
                }
            }
        } 
    }
    function incrementProduct (currentProductID) {
        incrementOrderArray (currentProductID);
        renderOrder(orderListArray);
    }
    function decrementProduct (currentProductID) {
        decrementOrderArray (currentProductID);
        renderOrder(orderListArray);
    }
    function showDetails (currentProductID) {
        const currentProductDetail = document.querySelector('.more-details.with-'+currentProductID);
        const oldProductDetail = document.querySelectorAll('.more-details');
        oldProductDetail.forEach((element) => {
            if (!(element.classList.contains('hidden'))) {
                element.classList.toggle('hidden');
            }
        });
        currentProductDetail.classList.toggle('hidden');
    }
    function closeDetails (currentProductID) {
        const currentProductDetail = document.querySelector('.more-details.with-'+currentProductID);
        currentProductDetail.classList.toggle('hidden');  
    }
    function processPayment(e) {
        e.preventDefault();
        const formProcess = new FormData(form);
        let paymentModal = document.querySelector(".payment-modal");
        const content =
        `
            <h3>Processing payment...</h3>
            <img src="./img/loading.gif">
        `;
        paymentModal.innerHTML = content;
        const content2 = 
        `
            <img class="close-pay" src="./img/close.png"/>   
            <h3>Success!</h3>
        `;
        setTimeout(()=>{
            paymentModal.innerHTML = content2;
            orderListArray.splice(0,orderListArray.length);
            renderOrder(orderListArray);
            const currentItems = document.querySelectorAll('.number-items');
            currentItems.forEach((element) => {
                element.textContent = "0";
            });
        },4000);
    }
    function renderPayment(total) {
        togglePayment();
    }
    function togglePayment() {
        const cancelBackground = document.querySelector('.cancel-background');
        const paymentModal = document.querySelector('.payment-modal');
        cancelBackground.classList.toggle('block');
        paymentModal.classList.toggle('hidden');
        paymentModal.innerHTML=
        `
        <img class="close-pay" src="./img/close.png"/>   
        <h3>Enter card details</h3>
        <form method="GET" id="payment">
            <input type="text" name="name" placeholder="Enter your name" required>
            <input type="number" name="cardNumber" placeholder="Enter card number" required>
            <input type="number" name="CVV" placeholder="Enter CVV" required>
            <button id="pay">Pay</button>
        </form>
        `;
    }
    function coreApp (e) {
        if (e.target.classList.contains('order')) {
            const total = e.target.dataset.totalPrice;
            renderPayment(total);
        }
        else {
            const closestParent = e.target.closest('.item');
            if (e.target.parentElement.classList.contains('increment')) {
                const currentProductID = getIDfromDIv(closestParent);
                incrementProduct (currentProductID);
            }
            else if (e.target.parentElement.classList.contains('decrement')) {
                const currentProductID = getIDfromDIv(closestParent);
                decrementProduct (currentProductID);
            }
            else if (e.target.classList.contains('details')) {
                const currentProductID = getIDfromDIv(closestParent);
                showDetails(currentProductID);
            }
            else if (e.target.classList.contains('close')) {
                const currentProductID = getIDfromDIv(closestParent);
                closeDetails(currentProductID);
            }
            else if (e.target.classList.contains('close-pay')) {
                togglePayment();
            }
        }
    }
    form.addEventListener('submit',processPayment);
    divClicked.addEventListener('click', coreApp);
});
