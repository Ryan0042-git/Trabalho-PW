const cart = JSON.parse(localStorage.getItem('cart')) || [];
const user = JSON.parse(localStorage.getItem('user')) || null;
const orders = JSON.parse(localStorage.getItem('orders')) || [];

// Função para atualizar contador de itens no carrinho
function updateCartCount() {
  const cartCountElements = document.querySelectorAll('.cart-count');
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  cartCountElements.forEach(element => {
    element.textContent = itemCount;
  });
}

// Função para exibir toast de notificação
function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show';
  
  if (type) {
    toast.classList.add(type);
  }
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Função para adicionar item ao carrinho
function addToCart(id, name, price) {
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id,
      name,
      price: parseFloat(price),
      quantity: 1
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showToast(`${name} adicionado ao carrinho!`, 'success');
}

// Função para remover item do carrinho
function removeFromCart(id) {
  const index = cart.findIndex(item => item.id === id);
  
  if (index !== -1) {
    const item = cart[index];
    
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.splice(index, 1);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
  }
}

// Função para atualizar quantidade de um item no carrinho
function updateQuantity(id, quantity) {
  const item = cart.find(item => item.id === id);
  
  if (item) {
    item.quantity = quantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
  }
}

// Função para limpar carrinho
function clearCart() {
  cart.length = 0;
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// Função para calcular total do carrinho
function calculateTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Função para formatar preço em Real brasileiro
function formatPrice(price) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// Função para renderizar itens do carrinho
function renderCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  
  if (!cartItemsContainer) return;
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <p>Seu carrinho está vazio</p>
        <a href="cardapio.html" class="btn btn-primary">Ver Cardápio</a>
      </div>
    `;
    
    document.getElementById('checkout-btn').disabled = true;
    document.getElementById('subtotal').textContent = formatPrice(0);
    document.getElementById('delivery-fee').textContent = formatPrice(0);
    document.getElementById('total').textContent = formatPrice(0);
    return;
  }
  
  // Definir taxa de entrega fixa
  const deliveryFee = 10.00;
  
  // Calcular subtotal
  const subtotal = calculateTotal();
  
  // Calcular total
  const total = subtotal + deliveryFee;
  
  // Atualizar resumo do pedido
  document.getElementById('subtotal').textContent = formatPrice(subtotal);
  document.getElementById('delivery-fee').textContent = formatPrice(deliveryFee);
  document.getElementById('total').textContent = formatPrice(total);
  document.getElementById('checkout-btn').disabled = false;
  
  // Se existir total no modal, atualizar também
  const modalTotal = document.getElementById('modal-total');
  if (modalTotal) {
    modalTotal.textContent = formatPrice(total);
  }
  
  // Renderizar itens
  let cartHTML = '';
  
  cart.forEach(item => {
    cartHTML += `
      <div class="cart-item">
        <div class="cart-item-img">
          <img src="https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="${item.name}">
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatPrice(item.price)}</div>
          <div class="cart-item-actions">
            <div class="quantity-control">
              <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${Math.max(1, item.quantity - 1)})">-</button>
              <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', parseInt(this.value) || 1)">
              <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
            </div>
            <div class="remove-item" onclick="removeFromCart('${item.id}')">
              <i class="fas fa-trash-alt"></i>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  
  cartItemsContainer.innerHTML = cartHTML;
}

// Função para manipular o checkout
function handleCheckout() {
  const checkoutBtn = document.getElementById('checkout-btn');
  const checkoutModal = document.getElementById('checkout-modal');
  const closeButtons = document.querySelectorAll('.close-modal');
  const confirmOrderBtn = document.getElementById('confirm-order');
  
  if (!checkoutBtn || !checkoutModal) return;
  
  // Abrir modal de checkout
  checkoutBtn.addEventListener('click', () => {
    checkoutModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  });
  
  // Fechar modal de checkout
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      checkoutModal.classList.remove('show');
      document.body.style.overflow = '';
    });
  });
  
  // Fechar modal ao clicar fora do conteúdo
  checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) {
      checkoutModal.classList.remove('show');
      document.body.style.overflow = '';
    }
  });
  
  // Alternar entre métodos de pagamento
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  const paymentDetails = document.querySelectorAll('.payment-details');
  
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      paymentDetails.forEach(detail => {
        detail.classList.add('hidden');
      });
      
      const selectedMethod = document.getElementById(`${radio.value}-details`);
      if (selectedMethod) {
        selectedMethod.classList.remove('hidden');
      }
    });
  });
  
  // Confirmar pedido
  confirmOrderBtn.addEventListener('click', () => {
    // Simular processamento
    confirmOrderBtn.disabled = true;
    confirmOrderBtn.textContent = 'Processando...';
    
    setTimeout(() => {
      const orderId = 'ORD' + Math.floor(Math.random() * 10000);
      
      // Criar novo pedido
      const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        items: [...cart],
        status: 'confirmed',
        total: calculateTotal() + 10.00,
        address: document.getElementById('address').value,
        payment: document.querySelector('input[name="payment"]:checked').value
      };
      
      // Adicionar à lista de pedidos
      orders.unshift(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      // Limpar carrinho
      clearCart();
      
      // Fechar modal e redirecionar
      checkoutModal.classList.remove('show');
      document.body.style.overflow = '';
      
      // Redirecionar para página de pedidos
      window.location.href = 'pedidos.html';
    }, 2000);
  });
}

// Função para alternar entre abas do cardápio
function initMenuTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  if (tabButtons.length === 0) return;
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remover classe active de todos os botões
      tabButtons.forEach(btn => btn.classList.remove('active'));
      
      // Adicionar classe active ao botão clicado
      button.classList.add('active');
      
      // Esconder todas as seções
      document.querySelectorAll('.menu-section').forEach(section => {
        section.classList.add('hidden');
      });
      
      // Mostrar seção correspondente
      const targetId = button.getAttribute('data-target');
      document.getElementById(targetId).classList.remove('hidden');
    });
  });
}

// Função para inicializar menu mobile
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  
  if (!menuToggle || !menu) return;
  
  menuToggle.addEventListener('click', () => {
    menu.classList.toggle('show');
  });
  
  // Fechar menu ao clicar em um link
  document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('show');
    });
  });
  
  // Fechar menu ao clicar fora
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== menuToggle) {
      menu.classList.remove('show');
    }
  });
}

// Função para validação de formulários
function validateForm(formId, validations) {
  const form = document.getElementById(formId);
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    
    // Limpar mensagens de erro anteriores
    form.querySelectorAll('.error-message').forEach(error => {
      error.textContent = '';
    });
    
    // Validar cada campo
    for (const field in validations) {
      const input = form.querySelector(`#${field}`);
      const errorElement = input.parentElement.querySelector('.error-message');
      
      if (!input || !errorElement) continue;
      
      const value = input.value.trim();
      const validationRules = validations[field];
      
      // Verificar cada regra de validação
      for (const rule of validationRules) {
        if (rule.required && value === '') {
          errorElement.textContent = rule.message || 'Este campo é obrigatório';
          isValid = false;
          break;
        }
        
        if (rule.minLength && value.length < rule.minLength) {
          errorElement.textContent = rule.message || `Mínimo de ${rule.minLength} caracteres`;
          isValid = false;
          break;
        }
        
        if (rule.pattern && !rule.pattern.test(value)) {
          errorElement.textContent = rule.message || 'Formato inválido';
          isValid = false;
          break;
        }
        
        if (rule.match && value !== document.getElementById(rule.match).value) {
          errorElement.textContent = rule.message || 'Os valores não coincidem';
          isValid = false;
          break;
        }
      }
    }
    
    // Se formulário for válido
    if (isValid) {
      if (formId === 'login-form') {
        // Simular login
        showToast('Login realizado com sucesso!', 'success');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      } else if (formId === 'register-form') {
        // Simular cadastro
        showToast('Cadastro realizado com sucesso!', 'success');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      }
    }
  });
}

// Função para alternar visibilidade da senha
function initPasswordToggle() {
  const toggleButtons = document.querySelectorAll('.toggle-password');
  
  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const input = button.parentElement.querySelector('input');
      const icon = button.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });
}

// Função para renderizar pedidos
function renderOrders() {
  const ordersContainer = document.getElementById('orders-container');
  
  if (!ordersContainer) return;
  
  // Se não houver pedidos
  if (orders.length === 0) {
    ordersContainer.innerHTML = `
      <div class="no-orders">
        <i class="fas fa-pizza-slice"></i>
        <h3>Você ainda não tem pedidos</h3>
        <p>Que tal fazer seu primeiro pedido agora?</p>
        <a href="cardapio.html" class="btn btn-primary">Ver Cardápio</a>
      </div>
    `;
    return;
  }
  
  // Caso contrário, renderizar pedidos
  let ordersHTML = '';
  
  orders.forEach(order => {
    // Converter data do pedido
    const orderDate = new Date(order.date);
    const today = new Date();
    const isToday = orderDate.toDateString() === today.toDateString();
    const dateStr = isToday 
      ? `Hoje, ${orderDate.getHours()}:${orderDate.getMinutes().toString().padStart(2, '0')}`
      : `${orderDate.toLocaleDateString('pt-BR')}, ${orderDate.getHours()}:${orderDate.getMinutes().toString().padStart(2, '0')}`;
    
    // Determinar status do pedido
    let statusClass = '';
    let statusText = '';
    let progressWidth = '0%';
    
    switch(order.status) {
      case 'confirmed':
        statusClass = 'preparing';
        statusText = 'Preparando';
        progressWidth = '35%';
        break;
      case 'delivering':
        statusClass = 'delivering';
        statusText = 'A caminho';
        progressWidth = '70%';
        break;
      case 'delivered':
        statusClass = 'delivered';
        statusText = 'Entregue';
        progressWidth = '100%';
        break;
    }
    
    // Construir HTML do pedido
    const isActiveOrder = order.status !== 'delivered';
    
    ordersHTML += `
      <div class="order-card ${isActiveOrder ? 'active-order' : ''}">
        <div class="order-header">
          <div>
            <h3>Pedido #${order.id}</h3>
            <span class="order-date">${dateStr}</span>
          </div>
          <span class="order-status ${statusClass}">${statusText}</span>
        </div>
        
        ${isActiveOrder ? `
        <div class="order-progress">
          <div class="progress-steps">
            <div class="progress-step completed">
              <div class="step-icon">
                <i class="fas fa-check"></i>
              </div>
              <div class="step-label">Pedido Confirmado</div>
            </div>
            <div class="progress-step ${order.status === 'confirmed' || order.status === 'delivering' || order.status === 'delivered' ? 'active' : ''}">
              <div class="step-icon">
                <i class="fas fa-pizza-slice"></i>
              </div>
              <div class="step-label">Preparando</div>
            </div>
            <div class="progress-step ${order.status === 'delivering' || order.status === 'delivered' ? 'active' : ''}">
              <div class="step-icon">
                <i class="fas fa-motorcycle"></i>
              </div>
              <div class="step-label">Saiu para Entrega</div>
            </div>
            <div class="progress-step ${order.status === 'delivered' ? 'active' : ''}">
              <div class="step-icon">
                <i class="fas fa-home"></i>
              </div>
              <div class="step-label">Entregue</div>
            </div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressWidth};"></div>
          </div>
        </div>
        ` : ''}
        
        <div class="order-items">
          <h4>Itens do Pedido</h4>
          <ul>
            ${order.items.map(item => `
              <li>
                <span class="item-name">${item.quantity}x ${item.name}</span>
                <span class="item-price">${formatPrice(item.price * item.quantity)}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        
        <div class="order-footer">
          <div class="order-total">
            <span>Total:</span>
            <span>${formatPrice(order.total)}</span>
          </div>
          ${isActiveOrder ? `
          <div class="order-address">
            <i class="fas fa-map-marker-alt"></i>
            <span>${order.address}</span>
          </div>
          ` : `
          <div class="order-actions">
            <button class="btn btn-sm" onclick="reorderItems('${order.id}')">Pedir Novamente</button>
          </div>
          `}
        </div>
      </div>
    `;
  });
  
  ordersContainer.innerHTML = ordersHTML;
}

// Função para pedir novamente
function reorderItems(orderId) {
  const order = orders.find(order => order.id === orderId);
  
  if (order) {
    // Limpar carrinho atual
    cart.length = 0;
    
    // Adicionar itens do pedido anterior
    order.items.forEach(item => {
      cart.push({...item});
    });
    
    // Atualizar localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Atualizar contador do carrinho
    updateCartCount();
    
    // Redirecionar para carrinho
    window.location.href = 'carrinho.html';
  }
}

// Simular progresso do pedido (para fins de demonstração)
function simulateOrderProgress() {
  // Verificar se há pedidos ativos
  const activeOrders = orders.filter(order => order.status !== 'delivered');
  
  if (activeOrders.length > 0) {
    // A cada 20 segundos, avançar o status de um pedido aleatório
    setInterval(() => {
      const activeOrders = orders.filter(order => order.status !== 'delivered');
      
      if (activeOrders.length > 0) {
        const randomOrder = activeOrders[Math.floor(Math.random() * activeOrders.length)];
        
        if (randomOrder.status === 'confirmed') {
          randomOrder.status = 'delivering';
        } else if (randomOrder.status === 'delivering') {
          randomOrder.status = 'delivered';
        }
        
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Se estiver na página de pedidos, atualizar a exibição
        if (document.getElementById('orders-container')) {
          renderOrders();
        }
      }
    }, 20000);
  }
}

// Função para inicializar eventos dos botões de adicionar ao carrinho
function initAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll('.btn[data-id]');
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      const name = button.getAttribute('data-name');
      const price = button.getAttribute('data-price');
      
      addToCart(id, name, price);
    });
  });
}

// Inicializar app quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // Atualizar contador do carrinho
  updateCartCount();
  
  // Inicializar menu mobile
  initMobileMenu();
  
  // Inicializar tabs do cardápio
  initMenuTabs();
  
  // Inicializar botões de adicionar ao carrinho
  initAddToCartButtons();
  
  // Renderizar carrinho se estiver na página de carrinho
  if (window.location.pathname.includes('carrinho.html')) {
    renderCart();
    handleCheckout();
  }
  
  // Renderizar pedidos se estiver na página de pedidos
  if (window.location.pathname.includes('pedidos.html')) {
    renderOrders();
    simulateOrderProgress();
  }
  
  // Inicializar toggle de senha
  initPasswordToggle();
  
  // Inicializar validação de formulários
  if (window.location.pathname.includes('login.html')) {
    validateForm('login-form', {
      'login-email': [
        { required: true, message: 'O e-mail é obrigatório' },
        { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' }
      ],
      'login-password': [
        { required: true, message: 'A senha é obrigatória' },
        { minLength: 6, message: 'A senha deve ter pelo menos 6 caracteres' }
      ]
    });
  }
  
  if (window.location.pathname.includes('cadastro.html')) {
    validateForm('register-form', {
      'register-name': [
        { required: true, message: 'O nome é obrigatório' },
        { minLength: 3, message: 'O nome deve ter pelo menos 3 caracteres' }
      ],
      'register-email': [
        { required: true, message: 'O e-mail é obrigatório' },
        { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' }
      ],
      'register-cpf': [
        { required: true, message: 'O CPF é obrigatório' },
        { pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/, message: 'CPF inválido (000.000.000-00)' }
      ],
      'register-phone': [
        { required: true, message: 'O telefone é obrigatório' },
        { pattern: /^\(\d{2}\) \d{5}-\d{4}$/, message: 'Telefone inválido ((00) 00000-0000)' }
      ],
      'register-address': [
        { required: true, message: 'O endereço é obrigatório' }
      ],
      'register-city': [
        { required: true, message: 'A cidade é obrigatória' }
      ],
      'register-zipcode': [
        { required: true, message: 'O CEP é obrigatório' },
        { pattern: /^\d{5}-\d{3}$/, message: 'CEP inválido (00000-000)' }
      ],
      'register-password': [
        { required: true, message: 'A senha é obrigatória' },
        { minLength: 6, message: 'A senha deve ter pelo menos 6 caracteres' }
      ],
      'register-confirm-password': [
        { required: true, message: 'Confirme sua senha' },
        { match: 'register-password', message: 'As senhas não coincidem' }
      ]
    });
  }
});