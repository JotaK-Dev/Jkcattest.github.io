const firebaseConfig = {
    apiKey: "AIzaSyAcduVm0Y7zMzHxcY2OfdP6tgW7v7ezFiE",
    authDomain: "srcatalogo-54041.firebaseapp.com",
    projectId: "srcatalogo-54041",
    storageBucket: "srcatalogo-54041.firebasestorage.app",
    messagingSenderId: "654859364553",
    appId: "1:654859364553:web:25847894741d5ee50b0518",
    measurementId: "G-MM5RTRDR40"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", function() {
    const productGrid = document.getElementById('productGrid');
    const categoryFilter = document.getElementById('categoryFilter');
    const imageModal = document.getElementById('imageModal');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.getElementById('closeModal');

    function loadCategories() {
        db.collection("categories").get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const category = doc.data().name;
                const option = document.createElement("option");
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        });
    }

    function loadProducts(category) {
        productGrid.innerHTML = ''; // Limpiar grid
        let query = db.collection("catalog");

        if (category) {
            query = query.where("category", "==", category);
        }

        query.get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const product = doc.data();
                const productElem = document.createElement("div");
                productElem.classList.add("product");
                productElem.innerHTML = `
                    <img src="${product.imageUrls[0]}" alt="${product.name}">
                    <h2>${product.name}</h2>
                `;
                productElem.addEventListener("click", () => openModal(product.imageUrls));
                productGrid.appendChild(productElem);
            });
        });
    }

    categoryFilter.addEventListener('change', (event) => {
        const category = event.target.value;
        loadProducts(category);
    });

    function openModal(images) {
        modalContent.innerHTML = '';
        images.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.style.width = '100%'; // Ajustar el tamaño de las imágenes
            img.style.marginBottom = '10px';
            modalContent.appendChild(img);
        });
        imageModal.style.display = 'block';
    }

    closeModal.onclick = function() {
        imageModal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == imageModal) {
            imageModal.style.display = 'none';
        }
    }

    // Cargar categorías y productos al inicio
    loadCategories();
    loadProducts('');
});
