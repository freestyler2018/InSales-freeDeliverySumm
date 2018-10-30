/**
  * Cart
  */
 (function () {

   var $shopcartAmount = $('.js-shopcart-amount');
   var $shopcartSumm = $('.js-shopcart-summ');
   var $shopcartDiscountSumm = $('.js-discount-summ');
   var $shopcartTotalSumm = $('.js-shopcart-total-summ');
   var $shopcartTotalPrice = $('.js-total-price');
   var $discountComment = $('#js-discount-comment');
   var $discountNotices = $('#js-discount-notices');
   var $freeDelieverySumm = $('#js-free-delivery'); // Задаем сумму минимальной бесплатной доставки.

   EventBus.subscribe('add_items:insales:cart', function (data) {
     alertify.success(Site.messages.productAddedToCart);
   });

   EventBus.subscribe('delete_items:insales:cart', function (data) {

     var itemId = data.action.items[0];

     $('[data-item-id=' + itemId + ']').slideUp('fast', function () {
       $(this).remove();
     });

     alertify.success(Site.messages.productRemovedFromCart);

     if (data.items_count == 0) {
       $('.shopping-cart.container').html('<div class="notice notice-info text-center">' + Site.messages.cartIsEmpty + '</div>');
       alertify.message('Корзина очищена');
     }

   });

   EventBus.subscribe('update_items:insales:cart', function (data) {
     if (data.discounts && data.discounts.length) {
       $discountComment.html('<div class="summ-caption discount-comment">Сумма заказа: <span class="js-shopcart-summ"> ' + Shop.money.format(data.items_price) + ' </span> <br>"' + data.discounts[0].description + '": <span class="js-discount-summ"> ' + Shop.money.format(data.discounts[0].amount) + ' </span> </div>');
     } else {
       $discountComment.html('');
     }

     $shopcartAmount.html(Math.round((data.items_count) * 1000) / 1000);

     if (data.items_count > 0) {
       if (!$shopcartAmount.hasClass('active')) {
         $shopcartAmount.addClass('active');
       }
     } else {
       if ($shopcartAmount.hasClass('active')) {
         $shopcartAmount.removeClass('active');
       }
     }

     // Выводим сообщение сколько осталось до бесплатйно доставки
     if (data.items_price < 3000) {
       $freeDelieverySumm.html('<span>До бесплатной доставки осталось: </span>' + Shop.money.format(3000 - data.items_price)); // 3000 - сумма минимальной доставки - стоимость товаров в корзине.
     } else {
       $freeDelieverySumm.html('<span>Бесплатная доставка по Санкт-Петербургу</span>');
     }

     document.getElementById("progress-bar-fill").style.width = (data.items_price / 30) + "%"; // Двигаем прогресс бар от цены (3000 = 100%) присваеванием стиля width в progress-bar-fill
     $shopcartSumm.html(Shop.money.format(data.items_price));
     $shopcartTotalSumm.html(Shop.money.format(data.total_price));
     $shopcartTotalPrice.html(Math.floor(data.total_price));
     if (data.discounts.length > 0) {
       $shopcartDiscountSumm.html(Shop.money.format(data.discounts[0].amount));
     }
   });

   EventBus.subscribe('update_variant:insales:item', function (data) {

     var $item = $(data.action.product);
     var $itemSumm = $item.find('.js-item-total-price');
     var $itemPrice = $item.find('.js-item-price');

     $itemPrice.html(Shop.money.format(data.action.price));
     $itemSumm.html(Shop.money.format(data.action.price * data.action.quantity.current));
   });

 }());
