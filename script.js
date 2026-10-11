// Product is the blueprint. One object is one real product.
class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

// A cart item stores a Product object and a quantity.
// price lives on the product. quantity lives on the cart item.
class ShoppingCartItem {
  constructor(product, quantity) {
    this.product = product;
    this.quantity = quantity;
  }

  // Line total: this.product.price * this.quantity
  getTotalPrice() {
    return this.product.price * this.quantity;
  }
}

// The cart keeps an array of ShoppingCartItem objects.
class ShoppingCart {
  constructor() {
    this.items = [];
  }

  // Count of products: sum of quantities, not items.length
  getTotalItems() {
    var total = 0;

    for (var i = 0; i < this.items.length; i++) {
      total = total + this.items[i].quantity;
    }

    return total;
  }

  // Money total of the cart: sum of each line total.
  getTotalPrice() {
    var total = 0;

    for (var i = 0; i < this.items.length; i++) {
      total = total + this.items[i].getTotalPrice();
    }

    return total;
  }

  findItem(productId) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].product.id === productId) {
        return this.items[i];
      }
    }

    return null;
  }

  // The cart item must already exist. This only pushes it.
  addItem(item) {
    this.items.push(item);
  }

  // Plus button: add 1 to a product that is already in the cart.
  increaseQuantity(productId) {
    var item = this.findItem(productId);

    if (item) {
      item.quantity = item.quantity + 1;
    }
  }

  // Minus button: remove 1, and never go below 0.
  decreaseQuantity(productId) {
    var item = this.findItem(productId);

    if (item && item.quantity > 0) {
      item.quantity = item.quantity - 1;
    }
  }

  // Find the line by the product id, then keep every other line.
  removeItem(productId) {
    var keptItems = [];

    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].product.id !== productId) {
        keptItems.push(this.items[i]);
      }
    }

    this.items = keptItems;
  }

  // Read-only. Printing does not change items.
  displayCart() {
    if (this.items.length === 0) {
      console.log("The cart is empty.");
      return;
    }

    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];

      console.log(
        item.product.name +
          " | price: " +
          item.product.price +
          " | quantity: " +
          item.quantity +
          " | line total: " +
          item.getTotalPrice()
      );
    }

    console.log("Total items: " + this.getTotalItems());
    console.log("Total price: " + this.getTotalPrice() + " $");
  }
}

// --------------------------------------------------
// 1. Create the products shown on the page
// --------------------------------------------------
var baskets = new Product(1, "Baskets", 100);
var socks = new Product(2, "Socks", 20);
var bag = new Product(3, "Bag", 50);

// --------------------------------------------------
// 2. Create a shopping cart
// --------------------------------------------------
var cart = new ShoppingCart();

// --------------------------------------------------
// 3. Create cart items, then add them
//    Quantity starts at 0, same as the page
// --------------------------------------------------
cart.addItem(new ShoppingCartItem(baskets, 0));
cart.addItem(new ShoppingCartItem(socks, 0));
cart.addItem(new ShoppingCartItem(bag, 0));

// --------------------------------------------------
// 4. Link each card on the page to its product id
// --------------------------------------------------
var productCards = document.getElementsByClassName("card");
var cardIndex;
var cardName;
var itemIndex;

for (cardIndex = 0; cardIndex < productCards.length; cardIndex++) {
  cardName = productCards[cardIndex].getElementsByClassName("card-title")[0].innerText;

  for (itemIndex = 0; itemIndex < cart.items.length; itemIndex++) {
    if (cart.items[itemIndex].product.name === cardName) {
      productCards[cardIndex].setAttribute("data-id", cart.items[itemIndex].product.id);
    }
  }
}

// --------------------------------------------------
// 5. Paint the page from the cart
//    The objects are the source of truth.
//    The HTML only shows what the cart already knows.
// --------------------------------------------------
var totalPriceElement = document.getElementsByClassName("total")[0];

function updatePage() {
  var cards = document.getElementsByClassName("card");
  var i;
  var productId;
  var item;
  var quantityElement;

  for (i = 0; i < cards.length; i++) {
    productId = parseInt(cards[i].getAttribute("data-id"));
    item = cart.findItem(productId);

    if (item) {
      quantityElement = cards[i].getElementsByClassName("quantity")[0];
      quantityElement.innerText = item.quantity;
    }
  }

  totalPriceElement.innerText = cart.getTotalPrice() + " $";
}

function productIdFromButton(button) {
  var card = button.parentElement;

  while (card && !card.classList.contains("card")) {
    card = card.parentElement;
  }

  return parseInt(card.getAttribute("data-id"));
}

// --------------------------------------------------
// 6. PLUS buttons : add 1 through the cart
// --------------------------------------------------
var plusButtons = document.getElementsByClassName("fa-plus-circle");
var plusIndex;

for (plusIndex = 0; plusIndex < plusButtons.length; plusIndex++) {
  plusButtons[plusIndex].addEventListener("click", function () {
    cart.increaseQuantity(productIdFromButton(this));
    updatePage();
    cart.displayCart();
  });
}

// --------------------------------------------------
// 7. MINUS buttons : remove 1 through the cart
// --------------------------------------------------
var minusButtons = document.getElementsByClassName("fa-minus-circle");
var minusIndex;

for (minusIndex = 0; minusIndex < minusButtons.length; minusIndex++) {
  minusButtons[minusIndex].addEventListener("click", function () {
    cart.decreaseQuantity(productIdFromButton(this));
    updatePage();
    cart.displayCart();
  });
}

// --------------------------------------------------
// 8. DELETE buttons : remove the item from the cart,
//    then remove its card from the page
//
//    HTML structure (from the button going up):
//    delete image  ->  icons div  ->  inner card-body  ->  .card  ->  wrapper
// --------------------------------------------------
var deleteButtons = document.getElementsByClassName("delete-btn");
var deleteIndex;

for (deleteIndex = 0; deleteIndex < deleteButtons.length; deleteIndex++) {
  deleteButtons[deleteIndex].addEventListener("click", function () {
    var productId = productIdFromButton(this);
    var iconsDiv = this.parentElement;
    var innerCardBody = iconsDiv.parentElement;
    var card = innerCardBody.parentElement;
    var productWrapper = card.parentElement;

    cart.removeItem(productId);
    productWrapper.remove();
    updatePage();

    console.log("--- Cart after removing a product ---");
    cart.displayCart();
  });
}

// --------------------------------------------------
// 9. HEART buttons : like / unlike a product
//    This stays on the page. It is not part of the cart total.
// --------------------------------------------------
var heartButtons = document.getElementsByClassName("fa-heart");
var heartIndex;

for (heartIndex = 0; heartIndex < heartButtons.length; heartIndex++) {
  heartButtons[heartIndex].addEventListener("click", function () {
    if (this.classList.contains("liked")) {
      this.classList.remove("liked");
    } else {
      this.classList.add("liked");
    }
  });
}

// --------------------------------------------------
// 10. Show the cart once, before any click
// --------------------------------------------------
console.log("--- Cart after adding ---");
cart.displayCart();
updatePage();
