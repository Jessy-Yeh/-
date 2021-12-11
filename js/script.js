const orderForm = document.getElementById("order-form");
const selectedProductList = document.querySelector(".selected-product ul");
const deliveryMethodSelect = document.querySelector("select.delivery-method");
const totalAmount = document.getElementById("amount");
const jkoTransfer = document.getElementById("jko-transfer");
const bankTransfer = document.getElementById("bank-transfer");
const jkoImg = document.getElementById("jko-pay-img");
const productInputs = document.querySelectorAll('.product-list input');

let allProducts = [];
let selectedProducts = [];

jkoTransfer.addEventListener("click", function () {
  jkoImg.classList.remove("hidden");
});

bankTransfer.addEventListener("click", function () {
  jkoImg.classList.add("hidden");
});

orderForm.addEventListener("submit", async function submitForm(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const processedData = new URLSearchParams(formData).toString();
  console.log(processedData);

  try {
    await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: processedData,
    });
    window.location.assign("/thankyou.html");
  } catch (error) {
    console.log(error);
  }
});

deliveryMethodSelect.addEventListener('change', function () {
  updateTotalCost();
});

productInputs.forEach(input => {
  const label = input.previousElementSibling;
  const captionSpan = label.querySelector('.caption');
  const costSpan = label.querySelector('.cost');
  const unitSpan = label.querySelector('.unit');

  captionSpan.innerHTML = input.dataset.caption;
  costSpan.innerHTML = input.dataset.cost;
  unitSpan.innerHTML = input.dataset.unit;

  input.addEventListener('change', function () {
    updateTotalCost();
    updateSelectedProducts();
  });
})

function updateTotalCost() {
  allProducts = [...productInputs].map(input => {
    return { name: input.dataset.caption, unit: input.dataset.unit, cost: Number(input.dataset.cost), quantity: Number(input.value) || 0 }
  });
  selectedProducts = allProducts.filter(product => product.quantity > 0);

  const deliveryCost = Number(deliveryMethodSelect.querySelector("option:checked").dataset.cost);

  const totalCost = deliveryCost + selectedProducts.reduce((acc, obj) => acc + obj.cost * obj.quantity, 0);
  totalAmount.innerHTML = "$" + totalCost;
}

function updateSelectedProducts() {
  selectedProductList.innerHTML = selectedProducts.map(product => `
  <li>
    <p>${product.name} - $${product.cost}/${product.unit} X ${product.quantity} = ${product.cost * product.quantity}</p>
  </li>`).join('');
}