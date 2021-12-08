const orderForm = document.querySelector('#order-form');
orderForm.addEventListener('submit', async function submitForm(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  console.log(formData);
  const processedData = new URLSearchParams(formData).toString();
  console.log(processedData);

  // try {
  //   await fetch('/', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //     body: new URLSearchParams(formData).toString(),
  //   });
  //   history.push('/thankyou.html');
  // } catch (error) {
  //   console.log(error);
  // }
});
