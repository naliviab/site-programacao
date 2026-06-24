// Script para filtro de itens e carrinho simples
document.addEventListener('DOMContentLoaded', ()=>{
  const filters = document.querySelectorAll('.filter');
  const cards = Array.from(document.querySelectorAll('.card'));
  const addButtons = document.querySelectorAll('.add');
  const cartToggle = document.getElementById('cart-toggle');
  const cartPanel = document.getElementById('cart-panel');
  const cartItemsEl = document.getElementById('cart-items');
  const cartCountEl = document.getElementById('cart-count');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const deliveryAddressEl = document.getElementById('delivery-address');
  const deliveryFeeEl = document.getElementById('delivery-fee');
  const totalWithDeliveryEl = document.getElementById('total-with-delivery');
  const clearBtn = document.getElementById('clear-cart');
  const checkoutBtn = document.getElementById('checkout');

  let cart = [];

  function formatBRL(v){
    return 'R$ '+v.toFixed(2).replace('.',',');
  }

  // filtros
  filters.forEach(f=>{
    f.addEventListener('click', ()=>{
      filters.forEach(b=>b.classList.remove('active'));
      f.classList.add('active');
      const cat = f.dataset.filter;
      cards.forEach(c=>{
        if(cat==='all' || c.dataset.category===cat){
          c.style.display='flex';
        } else { c.style.display='none' }
      })
    })
  })

  // adicionar ao carrinho
  addButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      addToCart({name,price,qty:1});
    })
  })

  function addToCart(item){
    const existing = cart.find(i=>i.name===item.name);
    if(existing){ existing.qty += 1; }
    else cart.push(item);
    updateCartUI();
  }

  function updateCartUI(){
    // count
    const count = cart.reduce((s,i)=>s+i.qty,0);
    cartCountEl.textContent = count;
    // items
    cartItemsEl.innerHTML = '';
    cart.forEach(i=>{
      const li = document.createElement('li');
      li.textContent = `${i.name} x${i.qty}`;
      const span = document.createElement('span');
      span.textContent = formatBRL(i.price * i.qty);
      li.appendChild(span);
      cartItemsEl.appendChild(li);
    })
    // subtotal
    const subtotal = cart.reduce((s,i)=>s + i.price * i.qty,0);
    cartSubtotalEl.textContent = formatBRL(subtotal);
    // delivery fee (5%)
    const deliveryFee = +(subtotal * 0.05);
    deliveryFeeEl.textContent = formatBRL(deliveryFee);
    // total with delivery
    totalWithDeliveryEl.textContent = formatBRL(subtotal + deliveryFee);
    // persist
    try{ localStorage.setItem('docepao_cart', JSON.stringify(cart)); }catch(e){}
  }

  // carregar do localStorage
  try{ const raw = localStorage.getItem('docepao_cart'); if(raw) cart = JSON.parse(raw); }catch(e){}
  updateCartUI();

  // toggle painel
  cartToggle.addEventListener('click', ()=>{
    const hidden = cartPanel.getAttribute('aria-hidden') === 'true';
    cartPanel.setAttribute('aria-hidden', hidden ? 'false' : 'true');
  })

  clearBtn.addEventListener('click', ()=>{
    cart = [];
    updateCartUI();
  })

  checkoutBtn.addEventListener('click', ()=>{
    if(cart.length===0){ alert('Seu carrinho está vazio.'); return }
    const subtotal = cart.reduce((s,i)=>s + i.price * i.qty,0);
    const deliveryFee = +(subtotal * 0.05);
    const total = subtotal + deliveryFee;
    const address = deliveryAddressEl.value.trim();
    let msg = `Pedido realizado!\nTotal: ${formatBRL(total)}\n`;
    if(address) msg += `Endereço: ${address}\n`;
    msg += 'Obrigado pela preferência.';
    alert(msg);
    cart = [];
    deliveryAddressEl.value = '';
    updateCartUI();
  })
});
