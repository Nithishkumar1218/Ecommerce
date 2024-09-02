import {cart, removeFromCart, updateDeiveryOption} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';
import deliveryOptions from '../data/deliveryOptions.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';


let cartSummaryHTML = '';
const today = dayjs();

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingItem;

  products.forEach((product) => {
    if(product.id === productId) {
      matchingItem = product;
    }
  });

  const today = dayjs();
  const deliveryDate = today.add(
    deliveryOptions.deliveryDays,
    'days'
  );

  const dateString = deliveryDate.format(
    'dddd MMMM D'
  )

  cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${productId}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingItem.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingItem.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingItem.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">2</span>
            </span>
            <span class="update-quantity-link link-primary">
              Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-link"
            data-product-id="${productId}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options js-delivery-options">
        <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(matchingItem, cartItem)}
        </div>
      </div>
    </div>
  `;
  });

  function deliveryOptionsHTML(matchingItem, cartItem)
  { 
    let html = '';
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(
        deliveryOption.deliveryDays,
        'days'
      );

      const dateString = deliveryDate.format(
        'dddd MMMM D'
      )

      const priceString = deliveryOption.priceCents === 0 
      ? 'FREE'
      : `$${deliveryOption.priceCents / 100} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionsId;

      html += `
        <div class="delivery-option">
          <input type="radio"
          ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingItem.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      `
    }
  )
  return html;
};


  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        )
        container.remove();
    });
});