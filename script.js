// Data storage
let shoes = [
    {
        id: 1,
        name: "Nike Running Shoes",
        image: "/api/placeholder/250/200",
        type: "olahraga",
        category: "baru",
        price: 1500000,
        stock: 10
    },
    {
        id: 2,
        name: "Formal Black Shoes",
        image: "/api/placeholder/250/200",
        type: "kantor",
        category: "baru",
        price: 800000,
        stock: 5
    }
];

let users = [
    { username: "admin", password: "admin123" }
];

let currentUser = null;

// Authentication functions
function login(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = username;
        updateAuthUI();
        document.getElementById('loginForm').classList.add('hide');
    } else {
        alert('Username atau password salah!');
    }
}

function register(event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    if (users.some(u => u.username === username)) {
        alert('Username sudah digunakan!');
        return;
    }

    users.push({ username, password });
    alert('Registrasi berhasil! Silakan login.');
    toggleLoginForm();
}

function logout() {
    currentUser = null;
    updateAuthUI();
}

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');
    const username = document.getElementById('username');

    if (currentUser) {
        loginBtn.classList.add('hide');
        logoutBtn.classList.remove('hide');
        userInfo.classList.remove('hide');
        username.textContent = currentUser;
    } else {
        loginBtn.classList.remove('hide');
        logoutBtn.classList.add('hide');
        userInfo.classList.add('hide');
    }
}

function toggleLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    loginForm.classList.toggle('hide');
    registerForm.classList.add('hide');
}

function toggleRegisterForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    registerForm.classList.toggle('hide');
    loginForm.classList.add('hide');
}

// Shoe management functions
function displayShoes(shoesToDisplay = shoes) {
    const grid = document.getElementById('shoeGrid');
    grid.innerHTML = '';

    shoesToDisplay.forEach(shoe => {
        const card = document.createElement('div');
        card.className = 'shoe-card';
        card.innerHTML = `
            <img src="${shoe.image}" alt="${shoe.name}">
            <h3>${shoe.name}</h3>
            <p>Jenis: ${shoe.type}</p>
            <p>Kategori: ${shoe.category}</p>
            <p>Harga: Rp. ${shoe.price.toLocaleString()}</p>
            <p>Stok: ${shoe.stock}</p>
            <button onclick="buyShoe(${shoe.id})" ${!currentUser ? 'disabled' : ''}>
                ${!currentUser ? 'Login untuk membeli' : 'Beli'}
            </button>
        `;
        grid.appendChild(card);
    });
}

function searchShoes() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredShoes = shoes.filter(shoe => 
        shoe.name.toLowerCase().includes(searchTerm) ||
        shoe.type.toLowerCase().includes(searchTerm)
    );
    displayShoes(filteredShoes);
}

function toggleAddShoeForm() {
    const form = document.getElementById('addShoeForm');
    form.classList.toggle('hide');
}

function addShoe(event) {
    event.preventDefault();
    
    const newShoe = {
        id: shoes.length + 1,
        name: document.getElementById('shoeName').value,
        image: document.getElementById('shoeImage').value,
        type: document.getElementById('shoeType').value,
        category: document.getElementById('shoeCategory').value,
        price: parseInt(document.getElementById('shoePrice').value),
        stock: parseInt(document.getElementById('shoeStock').value)
    };

    shoes.push(newShoe);
    displayShoes();
    toggleAddShoeForm();
    event.target.reset();
}

function buyShoe(shoeId) {
    if (!currentUser) {
        alert('Silakan login terlebih dahulu untuk membeli sepatu!');
        toggleLoginForm();
        return;
    }

    const shoe = shoes.find(s => s.id === shoeId);
    if (shoe && shoe.stock > 0) {
        document.getElementById('paymentAmount').textContent = shoe.price.toLocaleString();
        document.getElementById('paymentModal').classList.remove('hide');
        document.getElementById('overlay').classList.remove('hide');
        
        // Update stock
        shoe.stock--;
        displayShoes();
    } else {
        alert('Maaf, stok habis!');
    }
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.add('hide');
    document.getElementById('overlay').classList.add('hide');
}

// Fetch shoes from backend
async function fetchShoes(search = '') {
    const response = await fetch(`backend/shoes.php?action=list&search=${search}`);
    const shoes = await response.json();
    displayShoes(shoes);
}

// Check login status
async function checkLogin() {
    try {
        const response = await fetch('backend/auth.php');
        const data = await response.json();
        if (!data.logged_in) {
            window.location.href = 'login.html';
        }
    } catch (error) {
        window.location.href = 'login.html';
    }
}

// Initialize
checkLogin();
fetchShoes();

// Initialize display
displayShoes();