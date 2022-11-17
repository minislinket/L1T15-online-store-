//creating the products in the shop, using a map function to generate the items with the info put into an array

let shop = document.getElementById('shop'); // links to "shop" in landing page html

let basket = JSON.parse(localStorage.getItem("basketData")) || [];

let generateShop = () => {
    return (shop.innerHTML = shopItemsData.map((x)=>{
        let{id, name, price, desc, img } = x;
        let search = basket.filter((y)=>x.id === y.id)[0] || []
        return  `
        <div id=product-id-${id} class="item">
            <img width="220" src="${img}" alt="">
            <div class="details">
                <h3>${name}</h3>
                <p>${desc}</p>
                <div class="price-quantity">
                    <h2>R ${price}</h2>
                    <div class="buttons">
                        <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
                        <div id=${id} class="quantity">
                        ${search.item === undefined ? 0: search.item} </div>
                        <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
                    </div>
                </div>
            </div>
        </div>
        `
    }).join("")); //this .join("") removes the rando extra comma
};

generateShop();


//functionality of the + and - buttons on product cards
let increment = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem.id); 

    if(search === undefined) {
        basket.push({
            id: selectedItem.id,
            item: 1,
        });
    }
    else{
        search.item += 1;
    }
    
    let amount = calcTotalAmount()
    .reduce((x,y)=>x+y,0);

    update(selectedItem.id);
    localStorage.setItem("basketData", JSON.stringify(basket));
    alert(selectedItem.id + "has been added to your cart and your new total is R" + amount);
};

// The below calctotal amount is in so that i can utilize the amount for the alert above when someone adds something to their cart
let calcTotalAmount = () => {
    return basket.map((x)=>{
        let {item,id} = x;
        let search = shopItemsData.find((y)=>y.id === id) || [];
        return item * search.price;

    })

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
    localStorage.setItem("basketData", JSON.stringify(basket));
};
let update = (id)=>{
    let search=basket.find((x)=>x.id === id); 
    document.getElementById(id).innerHTML = search.item;
    calculation();
};

// the function to add individual items added to the whole cart amount
let calculation =()=>{
 let cartIcon = document.getElementById("cartAmount");
 cartIcon.innerHTML = basket.map((x) => x.item).reduce((x,y)=> x + y, 0);
};

calculation();