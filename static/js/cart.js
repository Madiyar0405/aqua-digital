$(document).ready(function() {
    displayCartItems();

    // Обработчик события для кнопки "Удалить"
    $(document).on('click', '.remove-item', function() {
        const productId = $(this).data('product-id');
        removeFromCart(productId);
    });

    // Обработчик события для кнопки "Оформить заказ"
    $('#orderButton').on('click', function() {
        const cart = getCart();

        if (cart.length === 0) {
            alert('Ваша корзина пуста!');
            return;
        }

        // Формирование данных заказа для отправки на Web3Forms
        let orderMessage = "Новый заказ:\n\n";
        cart.forEach(item => {
            orderMessage += `${item.name} - ${item.price} x ${item.quantity} = ${parseInt(item.price.replace(/[^0-9]/g, '')) * item.quantity} ₸\n`;
        });
        orderMessage += `\nИтого: ${$('#cart-total .total-sum').text()}`;

        // Отправка данных на Web3Forms
        $.ajax({
            url: 'https://api.web3forms.com/submit', // Замените на URL вашего Web3Forms endpoint
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                access_key: '06bcad67-a8c4-4685-aa1b-f27d8ca2fe04', 
                message: orderMessage 
            }),
            success: function(response) {
                console.log('Заказ успешно отправлен:', response);
                // Очистка корзины
                localStorage.removeItem('cart');
                // Обновление отображения корзины
                displayCartItems();
                // Отображение сообщения об успешном заказе
                $('#orderSuccessMessage').show();
            },
            error: function(error) {
                console.error('Ошибка при отправке заказа:', error);
                alert('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте позже.');
            }
        });
    });
});

function displayCartItems() {
    let cart = getCart();
    let cartItems = $('#cart-table tbody');
    let cartTotal = $('#cart-total');
    cartItems.empty();
    cartTotal.empty();

    let totalSum = 0;

    if (cart.length === 0) {
        cartItems.append('<tr><td colspan="6" class="text-center">Ваша корзина пуста</td></tr>');
    } else {
        cart.forEach(item => {
            let totalItemPrice = (parseInt(item.price.replace(/[^0-9]/g, '')) * item.quantity);
            totalSum += totalItemPrice;
            cartItems.append(`
               <tr>
                   <td><img src="${item.image}" alt="${item.name}" style="width:50px;"></td>
                   <td>${item.name}</td>
                   <td>${item.price}</td>
                   <td>${item.quantity}</td>
                   <td>${totalItemPrice} ₸</td> 
                   <td><button class="btn btn-danger btn-sm remove-item" data-product-id="${item.id}">Удалить</button></td>
               </tr>
           `);
        });
        cartTotal.append(`<p>Итого: <span class="total-sum">${totalSum} ₸</span></p>`);
    }
}

function getCart() {
    let cartStr = localStorage.getItem('cart');
    return cartStr ? JSON.parse(cartStr) : []; 
}

function removeFromCart(productId) {
    let cart = getCart();
    let updatedCart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    displayCartItems(); 
}



