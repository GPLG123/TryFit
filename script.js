// script.js - complet, optimizat pentru vizualizare avatar

// Avatar 3D (doar pe index.html)
if (document.getElementById("avatar")) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);
    camera.position.set(0, 1.5, 5); // camera puțin mai în spate

    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("avatar"),
        alpha: true
    });
    renderer.setSize(400, 400);

    // Lumini
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    // AxesHelper pentru debugging
    const axes = new THREE.AxesHelper(5);
    scene.add(axes);

    // Cub de test pentru vizualizare scena
    const testCube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshNormalMaterial()
    );
    testCube.position.y = 0;
    scene.add(testCube);

    // Loader GLTF
    let avatar;
    const loader = new THREE.GLTFLoader();

    loader.load(
        "avatar.glb",
        function (gltf) {
            avatar = gltf.scene;
            // Ajustează dimensiunea și poziția după nevoie
            avatar.scale.set(2, 2, 2);  // crește dacă e mic
            avatar.position.y = -1;     // ajustează pivot
            scene.add(avatar);
        },
        undefined,
        function (error) {
            console.error("Error loading model:", error);
            alert("Failed to load avatar.glb. Check file name and path!");
        }
    );

    // Haine demo (cub colorat)
    const clothesGeometry = new THREE.BoxGeometry(1.2, 1.3, 0.7);
    const clothesMaterial = new THREE.MeshBasicMaterial({ color: 0x3366ff });
    const clothes = new THREE.Mesh(clothesGeometry, clothesMaterial);
    clothes.position.y = 1.0;
    scene.add(clothes);

    // Animatie
    function animate() {
        requestAnimationFrame(animate);
        if (avatar) avatar.rotation.y += 0.01;
        clothes.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();

    // Actualizare avatar dupa masuri
    window.updateAvatar = function () {
        const chest = parseFloat(document.getElementById("chest").value) || 0;
        const waist = parseFloat(document.getElementById("waist").value) || 0;
        const hips = parseFloat(document.getElementById("hips").value) || 0;
        const size = document.getElementById("size").value;

        if (avatar) {
            const scaleX = 1 + chest / 200;
            const scaleY = 1 + waist / 300;
            const scaleZ = 1 + hips / 200;
            avatar.scale.set(scaleX, scaleY, scaleZ);
        }

        if (size === "S") clothes.scale.set(0.9, 0.9, 0.9);
        if (size === "M") clothes.scale.set(1, 1, 1);
        if (size === "L") clothes.scale.set(1.15, 1.15, 1.15);

        document.getElementById("result").innerHTML = "Avatar updated for size: " + size;
    };

    // Schimbare culoare haine
    window.wearClothes = function (color) {
        clothes.material.color.set(color);
    };
}

// Cautare produse
window.searchProducts = function () {
    const q = document.getElementById("search")?.value.toLowerCase() || "";
    const allProducts = document.querySelectorAll(".product");
    allProducts.forEach(p => {
        const name = p.querySelector("p").innerText.toLowerCase();
        p.style.display = name.includes(q) ? "block" : "none";
    });
};

// Functii cart
window.addToCart = function (name, price) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(name + " added to cart!");
    loadCart();
};

window.loadCart = function () {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartList = document.getElementById("cartList");
    if (!cartList) return;
    cartList.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
        const li = document.createElement("li");
        li.innerText = item.name + " - £" + item.price;
        cartList.appendChild(li);
        total += item.price;
    });
    const totalPrice = document.getElementById("totalPrice");
    if (totalPrice) totalPrice.innerText = "Total: £" + total;
};

window.goCheckout = function () {
    window.location.href = "checkout.html";
};

window.finishOrder = function () {
    localStorage.removeItem("cart");
    alert("Order finished! Cart cleared.");
    window.location.href = "index.html";
};

// Load cart la deschidere pagina
window.addEventListener("load", loadCart);
