const orderForm = document.getElementById("order-form");
const productInputs = document.querySelectorAll(".product-list input");
const selectedProductList = document.querySelector(".selected-product ul");
const deliveryMethodSelect = document.querySelector("select.delivery-method");
const totalAmount = document.getElementById("amount");
const jkoTransfer = document.getElementById("jko-transfer");
const bankTransfer = document.getElementById("bank-transfer");
const cash = document.getElementById("cash");
const jkoImg = document.getElementById("jko-pay-img");

let selectedProducts = [];
let totalCost = 0;

function updateSelectedProducts() {
  const allProducts = [...productInputs].map((input) => {
    return {
      name: input.dataset.caption,
      unit: input.dataset.unit,
      cost: Number(input.dataset.cost),
      quantity: Number(input.value) || 0,
    };
  });
  selectedProducts = allProducts.filter((product) => product.quantity > 0);
}

function updateTotalCost() {
  const deliveryCost = Number(
    deliveryMethodSelect.querySelector("option:checked").dataset.cost
  );

  totalCost =
    deliveryCost +
    selectedProducts.reduce((acc, obj) => acc + obj.cost * obj.quantity, 0);
}

function displaySelectedProducts() {
  selectedProductList.innerHTML = selectedProducts
    .map(
      (product) => `
  <li>
    <p>${product.name} - $${product.cost}/${product.unit} X ${
        product.quantity
      } = ${product.cost * product.quantity}</p>
  </li>`
    )
    .join("") || "<li><p>無</p></li>";
}

function displayTotalCost() {
  totalAmount.innerHTML = "$" + totalCost;
}

deliveryMethodSelect.addEventListener("change", function () {
  updateTotalCost();
  displayTotalCost();
});

productInputs.forEach((input) =>
  input.addEventListener("change", function () {
    if (Number(this.value) < 0) this.value = null;
    if (Number(this.value) > 99) this.value = 99;
    updateSelectedProducts();
    updateTotalCost();
    displaySelectedProducts();
    displayTotalCost();
  })
);

jkoTransfer.addEventListener("click", function () {
  jkoImg.classList.remove("hidden");
});

bankTransfer.addEventListener("click", function () {
  jkoImg.classList.add("hidden");
});

cash.addEventListener("click", function () {
  jkoImg.classList.add("hidden");
});

orderForm.addEventListener("submit", async function submitForm(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  productInputs.forEach((input) => {
    if (input.value < 1) {
      console.log(formData);
      console.log(formData.get(input.name));
      formData.delete(input.name);
    }
  });
  formData.append("totalCost", totalCost);
  const processedData = new URLSearchParams(formData).toString();

  // console.log(processedData);

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
