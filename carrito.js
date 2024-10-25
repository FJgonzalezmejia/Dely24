let cart = JSON.parse(localStorage.getItem('cart')) || []; // Cargar carrito desde localStorage
let isQrGenerated = false; // Controla si el QR ya fue generado

// Función para generar el contenido del QR con los productos, cantidades y el total
function generateQrContent(cartItems) {
    let total = 0;
    let cartContent = cartItems.map(item => {
        let subtotal = item.price * item.quantity;
        total += subtotal;
        return `Producto: ${item.name}, Cantidad: ${item.quantity}, Subtotal: Q${subtotal.toFixed(2)}`;
    }).join('\n');
    return `${cartContent}\nTotal: Q${total.toFixed(2)}`;
}

// Evento para generar el QR
document.getElementById("checkout-button").addEventListener("click", function() {
    if (isQrGenerated) {
        alert("Ya se generó un código QR para este pedido. No se puede generar nuevamente.");
        return;
    }

    if (cart.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    // Generar el contenido del QR
    let qrContent = generateQrContent(cart);

    // Crear el código QR
    let qrCode = new QRCode(document.getElementById("qrcode"), {
        text: qrContent,
        width: 256,
        height: 256,
        correctLevel: QRCode.CorrectLevel.H
    });

    // Marcar como QR generado para evitar generar múltiples códigos
    isQrGenerated = true;

    alert("Código QR generado con éxito.");
});

// Actualiza el total mostrado en el carrito
function updateCartTotal() {
    let total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    document.getElementById("cart-total").innerText = `Total: Q${total.toFixed(2)}`;
}

// Función para cargar el carrito desde localStorage
function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTable = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartTable.innerHTML = ''; // Limpiar la tabla

    let total = 0;

    cart.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>Q${product.price.toFixed(2)}</td>
            <td>
                <span>${product.quantity}</span>
                <button onclick="increaseQuantity(${index})">+</button>
            </td>
            <td>Q${(product.price * product.quantity).toFixed(2)}</td>
            <td><button class="removeButton" onclick="removeFromCart(${index})">Eliminar</button></td>
        `;

        cartTable.appendChild(row);
        total += product.price * product.quantity;
    });

    cartTotal.innerText = `Total: Q${total.toFixed(2)}`;
    updateCartCount(cart); // Actualizar el contador de productos
}

// Función para contar productos en el carrito
function updateCartCount(cart) {
    const cartCountElement = document.getElementById('cart-count');
    const totalCount = cart.reduce((sum, product) => sum + product.quantity, 0);
    cartCountElement.innerText = totalCount; // Actualizar el contador en el HTML
}

// Función para aumentar la cantidad de un producto
window.increaseQuantity = function(index) {
    cart[index].quantity += 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// Función para eliminar productos del carrito
window.removeFromCart = function(index) {
    cart.splice(index, 1); // Eliminar producto por índice
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

