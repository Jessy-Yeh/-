const orderForm = document.getElementById("order-form");
const selectedProductList = document.querySelector(".selected-product ul");
const totalAmount = document.getElementById("amount");
const jkoTransfer = document.getElementById("jko-transfer");
const bankTransfer = document.getElementById("bank-transfer");
const jkoImg = document.getElementById("jko-pay-img");
const productInputs = document.querySelectorAll('.product-list input');

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

productInputs.forEach((input, index) => input.addEventListener('change', function () {
  const allProducts = [...productInputs].map(input => {
    return { name: input.dataset.caption, unit: input.dataset.unit, cost: input.dataset.cost, quantity: Number(input.value) || 0 }
  });
  const selectedProducts = allProducts.filter(product => product.quantity > 0);

  const totalCost = selectedProducts.reduce((acc, obj) => acc + obj.cost * obj.quantity, 0);
  totalAmount.innerHTML = "$" + totalCost;

  selectedProductList.innerHTML = selectedProducts.map(product => `
  <li>
    <p>${product.name} - $${product.cost}/${product.unit} X ${product.quantity} = ${product.cost * product.quantity}</p>
  </li>`).join('');
}));