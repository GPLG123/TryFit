// script.js - comun pentru toate paginile

// Verificăm dacă suntem pe pagina cu avatar
if(document.getElementById("avatar")){
    // Creăm scena Three.js
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 1.5, 3);

    // Renderer pe canvas-ul existent
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("avatar"),
        alpha: true,
        antialias: true
    });
    renderer.setSize(400, 400);

    // Lumină
    const light = new THREE.HemisphereLight(0xffffff, 0x444444);
    scene.add(light);

    // Loader pentru GLB
    let avatar;
    const loader = new THREE.GLTFLoader();

    loader.load(
        "avatar.glb", // fișierul tău în același folder cu index.html
        function(gltf){
            avatar = gltf.scene;
            avatar.scale.set(1,1,1);     // ajustează dimensiunea după nevoie
            avatar.position.y = -0.5;    // ajustează poziția dacă e nevoie
            scene.add(avatar);
            console.log("Avatar loaded successfully!");
        },
        undefined,
        function(error){
            console.error("Error loading avatar:", error);
        }
    );

    // Haine demo (cub)
    const clothesGeometry = new THREE.BoxGeometry(1.2, 1.3, 0.7);
    const clothesMaterial = new THREE.MeshBasicMaterial({color: 0x3366ff});
    const clothes = new THREE.Mesh(clothesGeometry, clothesMaterial);
    clothes.position.y = 1.0;
    scene.add(clothes);

    // Funcție animare
    function animate(){
        requestAnimationFrame(animate);
        if(avatar) avatar.rotation.y += 0.01;
        clothes.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();

    // Funcție scalare după măsuri
    window.updateAvatar = function(){
        const chest = parseFloat(document.getElementById("chest").value) || 0;
        const waist = parseFloat(document.getElementById("waist").value) || 0;
        const hips = parseFloat(document.getElementById("hips").value) || 0;
        const size = document.getElementById("size").value;

        if(avatar){
            const scaleX = 1 + chest / 200;
            const scaleY = 1 + waist / 300;
            const scaleZ = 1 + hips / 200;
            avatar.scale.set(scaleX, scaleY, scaleZ);
        }

        if(size == "S") clothes.scale.set(0.9,0.9,0.9);
        if(size == "M") clothes.scale.set(1,1,1);
        if(size == "L") clothes.scale.set(1.15,1.15,1.15);

        document.getElementById("result").innerHTML = "Avatar updated for size: " + size;
    }

    // Schimbare culoare haine
    window.wearClothes = function(color){
        clothes.material.color.set(color);
    }
}

// ------------------- Produse & Cart (pentru toate paginile) -------------------

// Căutare produse
window.searchProducts = function(){
    const q = document.getElementById("search")?.value.toLowerCase() || "";
    const allProducts = document.querySelectorAll('.product');
    allProducts.forEach(p=>{
        const name = p.querySelector('p').innerText.toLowerCase();
        p.style.display = name.includes(q)?'block':'none';
    });
}

// Adaugă în cart
window.addToCart = function(name, price){
    const cart = JSON.parse(localStorage.getItem('cart'))||[];
    cart.push({name, price});
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(name + " added to cart!");
    loadCart();
}

// Încarcă cart
window.loadCart = function(){
    const cart = JSON.parse(localStorage.getItem('cart'))||[];
    const cartList = document.getElementById('cartList');
    if(!cartList) return;
    cartList.innerHTML = '';
    let total = 0;
    cart.forEach(item=>{
        const li = document.createElement('li');
        li.innerText = item.name + " - £" + item.price;
        cartList.appendChild(li);
        total += item.price;
    });
    const totalPrice = document.getElementById('totalPrice');
    if(totalPrice) totalPrice.innerText = "Total: £" + total;
}

// Navigare Checkout
window.goCheckout = function(){
    window.location.href = "checkout.html";
}

// Finalizare comandă
window.finishOrder = function(){
    localStorage.removeItem('cart');
    alert("Order finished! Cart cleared.");
    window.location.href = "index.html";
}

// Load cart la deschidere pagină
window.addEventListener('load', loadCart);
