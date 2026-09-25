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

  // The cart item must already exist. This only pushes it.
  addItem(item) {
    this.items.push(item);
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
  }
}

// 1. Create products
var phone = new Product(1, "Phone", 500);
var book = new Product(2, "Book", 20);
var pen = new Product(3, "Pen", 2);

// 2. Create a shopping cart
var cart = new ShoppingCart();

// 3. Create cart items, then add them
var phoneItem = new ShoppingCartItem(phone, 3);
var bookItem = new ShoppingCartItem(book, 4);
var penItem = new ShoppingCartItem(pen, 1);

cart.addItem(phoneItem);
cart.addItem(bookItem);
cart.addItem(penItem);

// 4. Display the cart
console.log("--- Cart after adding ---");
cart.displayCart();

// 5. Remove the phone (id 1) and display again
cart.removeItem(1);

console.log("--- Cart after removing the phone ---");
cart.displayCart();
