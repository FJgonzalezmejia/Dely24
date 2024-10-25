// carrito.js

let cart = JSON.parse(localStorage.getItem('cart')) || []; // Cargar carrito desde localStorage
let isQrGenerated = false; // Controla si el QR ya fue generado

// Función para generar el contenido del QR con un resumen
function generateQrContent(cartItems) {
    let total = 0;
    let itemCount = 0;

    // Resumir la información del carrito
    cartItems.forEach(item => {
        total += item.price * item.quantity;
        itemCount += item.quantity; // Contar total de productos
    });

    // Generar un contenido más compacto
    return `Total: Q${total.toFixed(2)}\nTotal de Productos: ${itemCount}`;
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

    // Comprobar la longitud de los datos
    if (qrContent.length > 3080) {
        alert("La información es demasiado extensa para un código QR. Por favor, reduce los datos.");
        return;
    }

    // Crear el código QR
    let qrCode = new QRCode(document.getElementById("qrcode"), {
        text: qrContent,
        width: 256,
        height: 256,
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
                ${product.quantity > 1 
                    ? `<span>${product.quantity}</span>
                       <button onclick="increaseQuantity(${index})">+</button>` 
                    : `<button onclick="increaseQuantity(${index})">+</button>`
                }
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

// Cargar el carrito al cargar la página
loadCart();
updateCartTotal();
