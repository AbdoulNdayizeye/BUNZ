/* ── NAV BURGER ── */
const burger = document.querySelector('.nav__burger');
const navLinks = document.querySelector('.nav__links');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.addEventListener('click', (e) => {
  if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
    navLinks.classList.remove('open');
  }
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── MIN DATE (today + 1) ── */
const pickupInput = document.getElementById('pickup');
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
pickupInput.min = tomorrow.toISOString().split('T')[0];

/* ── PRICE MAP ── */
const priceMap = {
  'Dozen Classic – $50': 50,
  'Dozen Maple Pecan – $60': 60,
  'Dozen Mix – $55': 55,
  '1/2 Dozen Classic – $25': 25,
  '1/2 Dozen Maple Pecan – $35': 35,
  '1/2 Dozen Mix – $30': 30,
  '36 Mini Bunz Classic – $30': 30,
  'Focaccia Cinnamon – $25': 25,
};

/* ── LIVE TOTAL ── */
const totalDiv = document.getElementById('orderTotal');
const totalAmt  = document.getElementById('totalAmt');

document.querySelectorAll('input[name="item"]').forEach(cb => {
  cb.addEventListener('change', updateTotal);
});

function updateTotal() {
  const checked = [...document.querySelectorAll('input[name="item"]:checked')];
  const sum = checked.reduce((acc, cb) => acc + (priceMap[cb.value] || 0), 0);
  if (checked.length > 0) {
    totalDiv.style.display = 'block';
    totalAmt.textContent = '$' + sum;
  } else {
    totalDiv.style.display = 'none';
  }
}

/* ── FORM SUBMIT ── */
const form   = document.getElementById('orderForm');
const modal  = document.getElementById('successModal');
const overlay = document.getElementById('modalOverlay');
const closeBtn = document.getElementById('closeModal');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  // Build a mailto link as a lightweight "send" mechanism
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const phone   = document.getElementById('phone').value.trim();
  const pickup  = document.getElementById('pickup').value;
  const notes   = document.getElementById('notes').value.trim();
  const items   = [...document.querySelectorAll('input[name="item"]:checked')].map(c => c.value).join('\n  - ');

  const body = encodeURIComponent(
    `New Pre-order Request from Bunz website\n\n` +
    `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n` +
    `Pickup date: ${pickup}\n\nItems:\n  - ${items}\n\nNotes: ${notes || 'None'}\n\n` +
    `Estimated total: ${totalAmt.textContent || 'N/A'}`
  );

  // Open mailto — replace with your actual business email
  window.location.href = `mailto:bunz.ott@gmail.com?subject=Pre-order%20Request%20from%20${encodeURIComponent(name)}&body=${body}`;

  showModal();
  form.reset();
  totalDiv.style.display = 'none';
});

function validateForm() {
  const name   = document.getElementById('name');
  const email  = document.getElementById('email');
  const pickup = document.getElementById('pickup');
  const items  = document.querySelectorAll('input[name="item"]:checked');

  clearErrors();
  let valid = true;

  if (!name.value.trim())  { showError(name,   'Please enter your name.');      valid = false; }
  if (!email.value.trim()) { showError(email,  'Please enter your email.');     valid = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    showError(email, 'Please enter a valid email.'); valid = false;
  }
  if (!pickup.value)       { showError(pickup, 'Please choose a pickup date.'); valid = false; }
  if (items.length === 0)  {
    const fs = document.querySelector('.form__fieldset');
    const err = document.createElement('p');
    err.className = 'form__error';
    err.textContent = 'Please select at least one item.';
    fs.appendChild(err);
    valid = false;
  }
  return valid;
}

function showError(input, msg) {
  const err = document.createElement('p');
  err.className = 'form__error';
  err.textContent = msg;
  input.after(err);
  input.style.borderColor = '#e53935';
}

function clearErrors() {
  document.querySelectorAll('.form__error').forEach(el => el.remove());
  document.querySelectorAll('.form__row input, .form__row textarea').forEach(el => {
    el.style.borderColor = '';
  });
}

/* ── MODAL ── */
function showModal() {
  modal.hidden   = false;
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

function hideModal() {
  modal.hidden   = true;
  overlay.hidden = true;
  document.body.style.overflow = '';
}

closeBtn.addEventListener('click', hideModal);
overlay.addEventListener('click', hideModal);


/* ── SMOOTH NAV HIGHLIGHT ── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

/* ── NAV ACTIVE STYLE (added dynamically) ── */
const style = document.createElement('style');
style.textContent = `
  .nav__links a.active { color: var(--pink-dark); }
  .form__error { color: #e53935; font-size: .82rem; font-weight: 700; margin-top: .2rem; }
`;
document.head.appendChild(style);
