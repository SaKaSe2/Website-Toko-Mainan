// URL API Endpoint
const API_URL = 'https://dummyjson.com/products/category/furniture';
const PRODUCTS_CONTAINER_ID = 'products-container';
const LOADING_ID = 'loading-state';

/**
 * Fungsi utama untuk mengambil data produk dari API
 * Menggunakan async/await sesuai modul
 */
async function fetchProducts() {
  // Tampilkan loading state
  showLoading(true);
  
  try {
    // 1. Fetch data dari API menggunakan await
    const response = await fetch(API_URL);
    
    // 2. Cek apakah response berhasil (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    
    // 3. Parse response menjadi JSON
    const data = await response.json();
    
    // 4. Ambil array products dari response
    const products = data.products;
    
    // 5. Log untuk debugging (opsional)
    console.log('✅ Data berhasil diambil:', products);
    
    // 6. Tampilkan produk ke halaman (ambil 6 produk pertama)
    displayProducts(products.slice(0, 6));
    
    // Sembunyikan loading
    showLoading(false);
    
  } catch (error) {
    // Handle error jika fetch gagal
    console.error('❌ Error fetching products:', error);
    showError(error.message);
    showLoading(false);
  }
}

/**
 * Fungsi untuk menampilkan produk secara dinamis ke HTML
 * @param {Array} products - Array produk dari API
 */
function displayProducts(products) {
  const container = document.getElementById(PRODUCTS_CONTAINER_ID);
  
  if (!container) {
    console.error('Container produk tidak ditemukan!');
    return;
  }
  
  // Clear container sebelum render
  container.innerHTML = '';
  
  // Loop setiap produk dan buat card HTML
  products.forEach((product) => {
    const productCard = createProductCard(product);
    container.innerHTML += productCard;
  });
}

/**
 * Fungsi untuk membuat HTML card produk
 * @param {Object} product - Data produk dari API
 * @returns {String} HTML string untuk card produk
 */
function createProductCard(product) {
  // Format harga ke Rupiah
  const priceIDR = formatToRupiah(product.price);
  
  // Ambil gambar pertama atau default
  const image = product.images?.[0] || product.thumbnail || 'https://via.placeholder.com/300';
  
  // Potong deskripsi jika terlalu panjang
  const description = product.description.length > 80 
    ? product.description.substring(0, 80) + '...'
    : product.description;
  
  return `
    <article class="bg-card rounded-xl p-4 card-hover transition-transform cursor-pointer">
      <img
        src="${image}"
        alt="${product.title}"
        class="rounded-md object-cover h-48 w-full"
        onerror="this.src='https://via.placeholder.com/300?text=No+Image'"
      />
      <h4 class="mt-4 font-semibold">${product.title}</h4>
      <p class="text-sm text-muted mt-1">
        ${description}
      </p>
      <div class="mt-4 flex items-center justify-between">
        <div class="text-lg font-bold">${priceIDR}</div>
        <a
          href="#kontak"
          class="px-12 py-1.5 rounded-md bg-primary text-white text-sm focus-ring transition transform hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Beli
        </a>
      </div>
      ${product.rating ? `
        <div class="mt-2 flex items-center gap-1 text-sm text-yellow-400">
          <span>⭐</span>
          <span>${product.rating}/5</span>
        </div>
      ` : ''}
    </article>
  `;
}

/**
 * Fungsi helper untuk format harga ke Rupiah
 * @param {Number} price - Harga dalam USD
 * @returns {String} Harga format Rupiah
 */
function formatToRupiah(price) {
  // Konversi USD ke IDR (estimasi 1 USD = 15.500 IDR)
  const priceIDR = price * 15500;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(priceIDR);
}

/**
 * Fungsi untuk menampilkan/menyembunyikan loading state
 * @param {Boolean} show - true untuk tampilkan, false untuk sembunyikan
 */
function showLoading(show) {
  const loading = document.getElementById(LOADING_ID);
  const container = document.getElementById(PRODUCTS_CONTAINER_ID);
  
  if (loading) {
    loading.style.display = show ? 'block' : 'none';
  }
  
  if (container && show) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p class="mt-4 text-muted">Memuat produk...</p>
      </div>
    `;
  }
}

/**
 * Fungsi untuk menampilkan error message
 * @param {String} message - Pesan error
 */
function showError(message) {
  const container = document.getElementById(PRODUCTS_CONTAINER_ID);
  
  if (container) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12">
        <div class="text-red-400 text-5xl mb-4">⚠️</div>
        <p class="text-red-400 font-semibold">Gagal memuat produk</p>
        <p class="text-muted text-sm mt-2">${message}</p>
        <button 
          onclick="fetchProducts()" 
          class="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Coba Lagi
        </button>
      </div>
    `;
  }
}

// AUTO LOAD saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Memulai fetch products...');
  fetchProducts();
  
  // Untuk testing alternatif API, uncomment salah satu:
  // fetchFromFakeStore();
  // fetchPokemonToys();
});