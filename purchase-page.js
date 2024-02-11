let cart = [];
let cartItemsSaved = JSON.parse(window.localStorage.getItem("cart"));
let modalQt = 0;
let key = 0;

window.addEventListener("load", () => {
    cart.push(...cartItemsSaved || []);
    window.localStorage.setItem("cart", JSON.stringify(cart));
}); 

const c = (el)=>document.querySelector(el); 
const cs = (el)=>document.querySelectorAll(el); 
menuJson.map((item, index)=>{
    let menuItem = c('.menu .menu-item').cloneNode(true);
    menuItem.setAttribute('data-key', index);
    menuItem.querySelector('.menu-item--img img').src= item.img;
    menuItem.querySelector('.menu-item--price').innerHTML = `R$ ${item.price[0].toFixed(2)}`;
    menuItem.querySelector('.menu-item--name').innerHTML = item.name;
    menuItem.querySelector('.menu-item--desc').innerHTML = item.description;
    menuItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault(); 
        key = e.target.closest('.menu-item').getAttribute('data-key'); 
        modalQt = 1;
        c('.menuBig img').src = menuJson[key].img;
        c('.menuInfo h1').innerHTML = menuJson[key].name;
        c('.menuInfo--desc').innerHTML = menuJson[key].description;
        c('.menuInfo--size.selected').classList.remove('selected');
        cs('.menuInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2) {
                size.classList.add('selected');
                c('.menuInfo--actualPrice').innerHTML = `R$ ${menuJson[key].price[sizeIndex].toFixed(2)}`;
                //c('.menuInfo--actualPrice2').innerHTML = `R$ ${menuJson[key].price[sizeIndex].toFixed(2)}`;

            }
            //size.innerHTML = menuJson[key].sizes[sizeIndex];
            size.querySelector('span').innerHTML = menuJson[key].sizes[sizeIndex];
        });
        c('.menuInfo--qt').innerHTML = modalQt;
        c('.menuWindowArea').style.opacity = 0; 
        c('.menuWindowArea').style.display = 'flex';
        setTimeout(()=> {
            c('.menuWindowArea').style.opacity = 1; 
        }, 200);
    });

    c('.menu-area').append(menuItem);
    
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
        c('.menuInfo--actualPrice').innerHTML = `R$ ${menuJson[key].price[sizeIndex].toFixed(2)}`;
        //c('.menuInfo--actualPrice2').innerHTML = `R$ ${menuJson[key].price[sizeIndex].toFixed(2)}`;
    });
});


c('.menuInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.menuInfo--size.selected').getAttribute('data-key'));
    let identifier = menuJson[key].id+'@'+size;
    
    let locaId = cart.findIndex((item)=>item.identifier == identifier);
    if(locaId > -1){
        cart[locaId].qt += modalQt; 
    } else {
        cart.push({
            identifier,
            id: menuJson[key].id,
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
            let modelItem = menuJson.find((itemBD)=>itemBD.id == itemCart.id);
            subtotal += modelItem.price[itemCart.size] * itemCart.qt;
            let cartItem = c('.menu .cart--item').cloneNode(true);
            let menuizeName;
            switch(itemCart.size) {
                case 0:
                    menuizeName = `${menuJson[key].sizes[0]}`;
                    break;
                case 1:
                    menuizeName = `${menuJson[key].sizes[1]}`;
                    break;
                case 2:
                    menuizeName = `${menuJson[key].sizes[2]}`;
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
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }


}
