let cart = JSON.parse(localStorage.getItem('cart')) || []; // Cargar carrito desde localStorage
let isQrGenerated = false; // Controla si el QR ya fue generado

// Función para generar el contenido del QR con los productos y cantidades
function generateQrContent(cartItems) {
    let total = 0;
    let cartContent = cartItems.map(item => {
        let subtotal = item.price * item.quantity;
        total += subtotal;
        return `Producto: ${item.name}, Cantidad: ${item.quantity}, Subtotal: Q${subtotal}`;
    }).join('\n');
    return `${cartContent}\nTotal: Q${total}`;
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

    // Si el contenido es demasiado largo, alertar al usuario
    if (qrContent.length > 2264) {
        alert("El contenido del código QR es demasiado largo. Reduce la información.");
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

// Cargar el carrito al cargar la página
loadCart();
updateCartTotal();
