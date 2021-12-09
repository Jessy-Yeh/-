const orderForm = document.getElementById('order-form');

orderForm.addEventListener('submit', async function submitForm(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const processedData = new URLSearchParams(formData).toString();
  console.log(processedData);

  try {
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: processedData,
    });
    window.location.assign('/thankyou.html');
  } catch (error) {
    console.log(error);
  }
});
