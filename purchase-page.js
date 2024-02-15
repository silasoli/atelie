//type:  snacks (lanches), candy (doces),  cakes (bolos),  drinks (bebidas).
let items = [
    {id:1, name:'Bolinho de Bacalhau', img:'images/doces.png', type: 'snacks', price:[8.00, 8.00, 8.00], sizes:[' ', '',''], description:'130g'},
    {id:2, name:'Bolinho de Carne seca c/ Banana', img:'images/doces.png', type: 'snacks', price:[8.00, 8.00, 8.00], sizes:[' ', '',''], description:'130g'},
];

let cart = [];
let cartItemsSaved = JSON.parse(window.localStorage.getItem("cart"));
let modalQt = 0;
let key = 0;

window.addEventListener("load", () => {
    cart.push(...cartItemsSaved || []);
    updateCart()
    window.localStorage.setItem("cart", JSON.stringify(cart));
}); 

const c = (el)=>document.querySelector(el); 
const cs = (el)=>document.querySelectorAll(el);

function getTypeFilterValue(){
    return !window.localStorage.getItem("type") ? 'snacks' : window.localStorage.getItem("type");
}

items.filter(item => item.type === getTypeFilterValue()).map((item, index)=>{
    let menuItem = c('.menu .snacks-items').cloneNode(true);
    menuItem.setAttribute('class', index + ' snacks-items');
    menuItem.setAttribute('data-key', index);
    menuItem.querySelector('.snacks-img').src= `${item.img}`;
    menuItem.querySelector('.snacks-footer p').innerHTML = `R$ ${item.price[0].toFixed(2)}`;
    menuItem.querySelector('.snacks-info h1').innerHTML = item.name;
    menuItem.querySelector('.snacks-span').innerHTML = item.description;
    menuItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault(); 
        key = e.target.closest('.snacks-items').getAttribute('data-key'); 
        modalQt = 1;
        
        c('.menuBig img').src = items[key].img;
        c('.menuInfo h1').innerHTML = items[key].name;
        c('.menuInfo--desc').innerHTML = items[key].description;
        c('.menuInfo--size.selected').classList.remove('selected');
        cs('.menuInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2) {
                size.classList.add('selected');
                c('.menuInfo--actualPrice').innerHTML = `R$ ${items[key].price[sizeIndex].toFixed(2)}`;
                //c('.menuInfo--actualPrice2').innerHTML = `R$ ${items[key].price[sizeIndex].toFixed(2)}`;

            }
            //size.innerHTML = items[key].sizes[sizeIndex];
            size.querySelector('span').innerHTML = items[key].sizes[sizeIndex];
        });
        c('.menuInfo--qt').innerHTML = modalQt;
        c('.menuWindowArea').style.opacity = 0; 
        c('.menuWindowArea').style.display = 'flex';
        setTimeout(()=> {
            c('.menuWindowArea').style.opacity = 1; 
        }, 200);
    });

    c('#snacks').append(menuItem);
    
});

function closeModal(){
    c('.menuWindowArea').style.opacity = 0; 
    setTimeout(()=> {
        c('.menuWindowArea').style.display = 'none';
    }, 500);
    
}

cs('.menuInfo--cancelButton, .menuInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

c('.menuInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1) {
        modalQt--;
        c('.menuInfo--qt').innerHTML = modalQt;
    }
});

c('.menuInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.menuInfo--qt').innerHTML = modalQt;
});

cs('.menuInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=> {
        c('.menuInfo--size.selected').classList.remove('selected');
        //e.target.classList.add('selected'); //ocorre erro se clicar no <span></span>
        size.classList.add('selected');
        c('.menuInfo--actualPrice').innerHTML = `R$ ${items[key].price[sizeIndex].toFixed(2)}`;
        //c('.menuInfo--actualPrice2').innerHTML = `R$ ${items[key].price[sizeIndex].toFixed(2)}`;
    });
});


c('.menuInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.menuInfo--size.selected').getAttribute('data-key'));
    let identifier = items[key].id+'@'+size;
    
    let locaId = cart.findIndex((item)=>item.identifier == identifier);
    if(locaId > -1){
        cart[locaId].qt += modalQt; 
    } else {
        cart.push({
            identifier,
            id: items[key].id,
            size,
            qt:modalQt
        });
        window.localStorage.setItem("cart", JSON.stringify(cart));
    }
    updateCart();
    closeModal();
});

window.addEventListener("load", () => {
    if(cart.length > 0) {
        c('.menu-openner span').innerHTML = cart.length;
    }
});


c('.menu-openner').addEventListener('click', ()=>{
    updateCart();
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
});

c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left='100vw';
});

$("#cartFinalizar").click(function(){
    $(location).attr("href", "https://wa.me/5575992137982?text=Ol%C3%A1+Gostaria+de+fazer+o+seguinte+pedido" + encodeURI( "olá, gostaria de fazer um pedido\n" + document.getElementById("cart").innerText.replace(/<br\s*\/?>/, "\n") + document.getElementById("details").textContent + "\n *Campo para endereço de entrega e observações:* \n"))
    window.localStorage.clear();
    var pegarTxt = document.getElementById("Total").innerText;
    
})

function sendOrder(){
    $(location).attr("href", "https://wa.me/5575992137982?text=Ol%C3%A1+Gostaria+de+fazer+o+seguinte+pedido" + encodeURI( "olá, gostaria de fazer um pedido\n" + document.getElementById("cart").innerText.replace(/<br\s*\/?>/, "\n") + document.getElementById("details").textContent + "\n *Campo para endereço de entrega e observações:* \n"))
    window.localStorage.clear();
    var pegarTxt = document.getElementById("Total").innerText;
}

function updateCart() {
    window.localStorage.setItem("cart", JSON.stringify(cart));
    c('.menu-openner span').innerHTML = cart.length;
    if(cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = ''; 
        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        let taxa = 5;
        cart.map((itemCart, index)=>{
            let modelItem = items.find((itemBD)=>itemBD.id == itemCart.id);
            subtotal += modelItem.price[itemCart.size] * itemCart.qt;
            let cartItem = c('.menu .cart--item').cloneNode(true);
            let menuizeName;
            switch(itemCart.size) {
                case 0:
                    menuizeName = `${items[key].sizes[0]}`;
                    break;
                case 1:
                    menuizeName = `${items[key].sizes[1]}`;
                    break;
                case 2:
                    menuizeName = `${items[key].sizes[2]}`;
            }
            //itens abaixo aparecem no carrinho enviar pedido
            cartItem.querySelector('img').src = modelItem.img;
            //cartItem.querySelector('.cart--item-nome').innerHTML = `${modelItem.name} - ${modelItem.sizes[itemCart.size]}`;
            cartItem.querySelector('.cart--item-nome').innerHTML = `${modelItem.name} ${menuizeName}`;
            cartItem.querySelector('.cart--item--qt').innerHTML = itemCart.qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(itemCart.qt > 1) {
                    itemCart.qt--
                } else {
                    cart.splice(index, 1);
                    
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                itemCart.qt++; 
                updateCart();
            });
            c('.cart').append(cartItem);
        });

        desconto = subtotal * 0.1;
        total = subtotal - desconto + taxa;
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        c('.menu-openner span').innerHTML = 0;
        c('aside').innerHTML = `
        <div class="cart--area">
            <div class="texto--cart">FINALIZE AGORA</div><br><br>

            <div class="cart" id="cart"></div>
            <div class="cart--details" id="details">
                <div class="fontes1">
                    <div class="cart--totalitem subtotal">
                        <span>Subtotal</span>
                        <span>R$ 0,00</span>
                    </div>
                    <div class="cart--totalitem taxa">
                        <span>Taxa de entrega</span>
                        <span>R$ 5,00</span>
                    </div>
                    <div class="cart--totalitem desconto">
                        <span>Desconto (-10%)</span>
                        <span>R$ 0,00</span>
                    </div>
                    <div class="cart--totalitem total big">
                        <span>Total</span>
                        <span>R$ 0,00</span>
                    </div>
                </div>
            </div>
            <div class="cart--finalizar" id="cartFinalizar" onclick="sendOrder()">ENVIAR PEDIDO</div><br><br>
            <div class="menu-closer">
                <span class="material-icons">arrow_back_ios</span>
            </div>
        </div>
        `;
        
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}
