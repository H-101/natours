/*eslint-disable*/

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};
export const showAlert = (type, msg) => {
  hideAlert();
  const markup = document.createElement('div'); // Create a real element
  markup.className = `alert alert--${type}`; // Add classes
  markup.textContent = msg; // Set text content
  document.querySelector('body').insertAdjacentElement('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};
