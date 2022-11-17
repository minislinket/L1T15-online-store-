

let label = document.getElementById('label');
let vatDiv = document.getElementById("vat");
let subtotalDiv = document.getElementById("subtotal");
let shoppingCart = document.getElementById('shoppingCart'); 

let basket = JSON.parse(localStorage.getItem("basketData")) || [];

let calculation = () => {
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x,y)=> x + y, 0);
   };
    
   calculation();

let generateCartItems = () => {
    if (basket.length !== 0){
        return (shoppingCart.innerHTML = basket
            .map((x)=>{
            let {id, item } = x;
            let search = shopItemsData.find((y)=>y.id === id) || [];
            return `
            <div class="cartItem">
                <img width="150" src=${search.img} alt"" />
                <div class="details">

                    <div class="titlePriceX">
                        <h4 class="titlePrice">
                            <p>${search.name} </p>
                            <p class="cartItemPrice">R ${search.price}</p>
                        </h4>
                        <i onclick="removeItem(${id})"class="bi bi-x-lg"></i>
                    </div>

                    <div class="buttons">
                        <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
                        <div id=${id} class="quantity">${item}</div>
                        <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
                    </div>
                    
                    <h3>R ${item * search.price}</h3>
                </div>
            </div>`;
        }).join(''));
    } else{
        shoppingCart.innerHTML = ``;
        label.innerHTML = `
        <h2> Cart is Empty</h2>
        <a href="/Landingpage.html">
        <button class="homeBtn">Back to home</button>
        </a>
        `;
    }
};

generateCartItems();

let increment = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem.id); 

    if(search === undefined) {
        basket.push({
            id: selectedItem.id,
            item: 1,
        });
    } else{
        search.item += 1;
    }
    let amount = calcTotalAmount()
    .reduce((x,y)=>x+y,0);

    generateCartItems();
    update(selectedItem.id);
    localStorage.setItem("basketData", JSON.stringify(basket));
    alert(selectedItem.id + "has been added to your cart and your new total is R" + amount);
};

let decrement = (id)=>{
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem.id); 
    
    if(search === undefined) return;
    else if(search.item === 0) return;
    else {
        search.item -= 1;
    }
    update(selectedItem.id);
    basket = basket.filter((x)=>x.item !== 0); //this selects all of the objects with an item not of 0 item count 
    generateCartItems(); //re render cart
    localStorage.setItem("basketData", JSON.stringify(basket));
};
let update = (id)=>{
    let search = basket.find((x)=>x.id === id);
    document.getElementById(id).innerHTML = search.item;
    calculation();
    totalAmount();
};

let removeItem = (id)=>{
    let selectedItem = id
    basket = basket.filter((x)=>x.id !== selectedItem.id); 
    generateCartItems();
    calculation();
    totalAmount();
    
    localStorage.setItem("basketData", JSON.stringify(basket)); 
};

let clearCart = ()=> {
    basket = [];
    generateCartItems();
    calculation();
    totalAmount(); // runs so that all the other buttons are also zeroed when cart is cleared
    localStorage.setItem("basketData", JSON.stringify(basket));
}

let calcsubtotal = (amount) => {
    let vat = amount * 0.15;
    let subtotal = amount - vat;
    subtotalDiv.innerHTML = `
        <h4>Sub Total : R ${subtotal}</h4>
        `;
   
}

let calcVat = (amount) => {
    let vat = amount * 0.15;

    vatDiv.innerHTML = `
        <h4>VAT : R ${vat}</h4>
        `;
    
}

let calcTotalAmount = () => {
    return basket.map((x)=>{
        let {item,id} = x;
        let search = shopItemsData.find((y)=>y.id === id) || [];
        return item * search.price;

    })

};

 
let totalAmount = () =>{


    if(basket.length !== 0 ){
        let amount = calcTotalAmount()
        .reduce((x,y)=>x+y,0);
        label.innerHTML = `
        <h2>Total Bill : R</h2> <h2 id="totalBill"> ${amount}</h2>
        <br>
        <button class="checkOut">Checkout</button>
        <button onclick="clearCart()" class="removeAll">Clear cart</button>`;
        calcsubtotal(amount);
        calcVat(amount);

}
    else { // these two are added so that when there is nothing in the cart (it was cleared) calcsub and calcVat are run to zero their amounts
        calcsubtotal(0);
        calcVat(0);
    };
}


totalAmount();
 

            //coupon code form functionality 

    function validate(coupon,e) { 
        e.preventDefault(); //prevents the form from refreshing the page and losing my changes 
        codes = new Object();
        codes.GOLD20 = 123456;
        codes.GOLD = 30;
        codes.GOLD40 = 40;
        codes.GOLD50 = 50;
        
        if (codes[coupon]) 
         { 
         window.alert("Coupon Code Accepted! check your new total!"); 

        let amount = calcTotalAmount()
        .reduce((x,y)=>x+y,0); // This goes through the basket and caculates 1 single total
        let discountedPrice = amount * 0.85;
        label.innerHTML = `
        <h2 id="totalBill">Total Bill : R ${discountedPrice}</h2>
        <br>
        <button class="checkOut">Checkout</button>
        <button onclick="clearCart()" class="removeAll">Clear cart</button>`;
        calcsubtotal(discountedPrice);
        calcVat(discountedPrice);
          
         } 
        else 
         { 
         window.alert("Sorry, The Coupon Code you entered is invalid. Please check and try again!"); 
         } 
        }

        //initially hide the delivery/collection dropdown
        //hiding the collect and deliver divs
        $(document).ready(function(){
            $("ul.dropdown").hide();
            $('.collectDetails').hide();
            $('.deliveryDetails').hide();
        });
        //toggle the delivery/collection ul
        $(".recieveOrder").click(function(){
           
            $("ul.dropdown").css("color","blue").toggle('slow');
        });
      
       $('#collect').click(function(){
            $('.collectDetails').toggle().css('color','black');
       })

       $('#deliver').click(function (){
            $('.deliveryDetails').toggle().css('color','black');
       })

       //adding delivery cost to total 
      
       function addDelivery() {
        let value = Number(document.getElementById('totalBill').innerHTML);
        value += 150;
        label.innerHTML = `
        <h2 id="totalBill">Total Bill : R ${value}</h2>`
       };


    confirmOrder = () => {
        $('#confirm').animate({
            height: '+=100px',
            opacity: '0.5'
            // height:'toggle' //makes it disapear once clicked
        });
        let x = Math.floor((Math.random()*1000)+1);
        alert(`Your order is confirmed and your reference number is ${x}.`)
    };
