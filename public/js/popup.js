// Generate a popup...

export function popup() {
  
  // Creating a form...
  const formBlur = document.createElement('div'); // We create a div element that will display a blurred div under the form...
  formBlur.classList.add('formBlur'); // We add the 'formBlur' class list to the div we created...

  const body = document.querySelector("body"); // We select body in html...
  body.appendChild(formBlur); // We add the blurred div to the body...
  
  const form = document.createElement('form'); // Creating the form...
  form.action = '/login'; // With the /login route as action...
  form.method = 'post'; // And the post method...
  form.classList.add('login-form'); // We add 'login-form' class to the form...

  // Creating form's HTML code :)
  form.innerHTML = `

  <i id="closebtn" class='bx bx-x bx-md bx-spin-hover' style="cursor:pointer;animation-duration: 0.5s; animation-iteration-count:1;"></i>
  
  <img src="/images/logo2.png" width="50px" style="display:block; margin:auto;">

  <h2 id="titlepopup" style="margin: 40px;">Login</h2>

  <div class="form-group">

    <label for="email">Email</label>
    <input type="email" id="emailpopup" name="email" required>

  </div>

  <div class="form-group">

    <label for="password">Password</label>
    <input type="password" id="passwordpopup" name="password" required>

  </div>
  
  <button id="follow" type="submit">Log In</button>
  `;

  // Additionnal form CSS...
  form.style.minWidth = '600px';
  form.style.margin = '0 auto';
  form.style.padding = '20px';
  form.style.border = '1px solid #ccc';

  // If we want to add some form submission on submit...
  form.addEventListener('submit', (e) => {
    // Handle form submission logic here
  });

  // Adding the form to blurred form...
  formBlur.appendChild(form);

  // Adding an event listener to the close button...
  const closeBtn = form.querySelector('#closebtn'); // We select #closebtn id from the page...

  closeBtn.addEventListener('click', () => { // When we click on the button..

    formBlur.style.display = 'none'; // Remove the pop-up when the close button is clicked
    form.style.display = 'none'; // Remove the form when the button is clicked...

  });

  return;

}

const userlink = document.getElementsByClassName('userlink'); // Select userlink classes...

for (let i = 0; i < userlink.length; i++) { // Iteration around userlinks elements...

  // For each userlink we have, it will display a popup when they're clicked...
  userlink[i].addEventListener('click', (e) => {

    e.preventDefault(); // Remove default element action
    popup(); // Execute the popup function...
  });

}
