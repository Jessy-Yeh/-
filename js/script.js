const orderForm = document.getElementById("order-form");
const submitBtn = document.querySelector(".order-submit-btn");
const submittingMessage = document.querySelector(".status-msg");
const productInputs = document.querySelectorAll(".product-list input");
const selectedProductList = document.querySelector(".selected-product ul");
const deliveryMethodSelect = document.querySelector("select.delivery-method");
const deliveryMethodOptions = document.querySelectorAll(
  "select.delivery-method option"
);
const totalAmount = document.getElementById("amount");
const totalAmountHiddenInput = document.getElementById("amount-hidden");
const jkoTransfer = document.getElementById("jko-transfer");
const bankTransfer = document.getElementById("bank-transfer");
const cash = document.getElementById("cash");
const jkoImg = document.getElementById("jko-pay-img");
const lineImg = document.getElementById("linepay-img");

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
  const productCost = selectedProducts.reduce(
    (acc, obj) => acc + obj.cost * obj.quantity,
    0
  );

  let deliveryCost;
  // if (productCost >= 600) {
  //   deliveryCost = 0;
  //   displayDeliveryOptionCosts(true);
  // } else {
  //   deliveryCost = Number(
  //     deliveryMethodSelect.querySelector("option:checked").dataset.cost
  //   );
  //   displayDeliveryOptionCosts(false);
  // }

  deliveryCost = Number(
    deliveryMethodSelect.querySelector("option:checked").dataset.cost
  );
  displayDeliveryOptionCosts(false);

  totalCost = productCost + deliveryCost;
}

function displayDeliveryOptionCosts(freeDelivery) {
  const chargedOptions = [...deliveryMethodOptions].filter(
    (option) => Number(option.dataset.cost) > 0
  );

  if (freeDelivery) {
    chargedOptions.forEach((option) => {
      const caption = option.dataset.caption;
      option.innerHTML = `${caption}0`;
    });
  } else {
    chargedOptions.forEach((option) => {
      const caption = option.dataset.caption;
      const cost = option.dataset.cost;
      option.innerHTML = `${caption}${cost}`;
    });
  }
}

function displaySelectedProducts() {
  selectedProductList.innerHTML =
    selectedProducts
      .map(
        (product) => `
  <li>
    <p>${product.name} - $${product.cost}/${product.unit} X ${
          product.quantity
        } = $${product.cost * product.quantity}</p>
  </li>`
      )
      .join("") || "<li><p>無</p></li>";
}

function displayTotalCost() {
  totalAmount.innerHTML = "$" + totalCost;
  totalAmountHiddenInput.value = totalCost;
}

function showSubmittingMsg() {
  submitBtn.style.display = "none";
  submittingMessage.style.display = "flex";
}

function getFormData() {
  const elements = orderForm.elements;
  let honeypot;

  const fields = Object.keys(elements)
    .filter(function (k) {
      if (elements[k].name === "honeypot") {
        honeypot = elements[k].value;
        return false;
      }
      return true;
    })
    .map(function (k) {
      if (elements[k].name !== undefined) {
        return elements[k].name;
        // special case for Edge's html collection
      } else if (elements[k].length > 0) {
        return elements[k].item(0).name;
      }
    })
    .filter(function (item, pos, self) {
      return self.indexOf(item) == pos && item;
    });

  const formData = {};
  fields.forEach(function (name) {
    const element = elements[name];

    // singular form elements just have one value
    formData[name] = element.value;

    // when our element has multiple items, get their values
    if (element.length) {
      var data = [];
      for (var i = 0; i < element.length; i++) {
        var item = element.item(i);
        if (item.checked || item.selected) {
          data.push(item.value);
        }
      }
      formData[name] = data.join(", ");
    }
  });

  // add form-specific values into the data
  formData.formDataNameOrder = JSON.stringify(fields);
  formData.formGoogleSheetName = orderForm.dataset.sheet || "responses"; // default sheet name
  formData.formGoogleSendEmail = orderForm.dataset.email || ""; // no email by default

  return { data: formData, honeypot: honeypot };
}

deliveryMethodSelect.addEventListener("change", function () {
  updateTotalCost();
  displayTotalCost();
});

productInputs.forEach((input) =>
  input.addEventListener("input", function () {
    if (Number(this.value) <= 0) this.value = null;
    if (Number(this.value) > 99) this.value = 99;
    updateSelectedProducts();
    updateTotalCost();
    displaySelectedProducts();
    displayTotalCost();
  })
);

linepay.addEventListener("click", function () {
  lineImg.classList.remove("hidden");
  jkoImg.classList.add("hidden");
});

jkoTransfer.addEventListener("click", function () {
  jkoImg.classList.remove("hidden");
  lineImg.classList.add("hidden");
});

bankTransfer.addEventListener("click", function () {
  jkoImg.classList.add("hidden");
  lineImg.classList.add("hidden");
});

cash.addEventListener("click", function () {
  jkoImg.classList.add("hidden");
  lineImg.classList.add("hidden");
});

orderForm.addEventListener("submit", function (event) {
  event.preventDefault(); // we are submitting via xhr below
  const formData = getFormData();
  const data = formData.data;

  // If a honeypot field is filled, assume it was done so by a spam bot.
  if (formData.honeypot) {
    return false;
  }

  showSubmittingMsg();
  const url = orderForm.action;
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  // xhr.withCredentials = true;
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      orderForm.reset();
      window.location.assign("/thankyou.html");
    }
  };
  // url encode form data for sending as post data
  const encoded = Object.keys(data)
    .map(function (k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
    })
    .join("&");
  xhr.send(encoded);
});
