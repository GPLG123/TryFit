// script.js - comun pentru toate paginile

// Avatar 3D (doar pe index.html)
if(document.getElementById("avatar")){
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, 400/400, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer({canvas: document.getElementById("avatar"), alpha: true});
    renderer.setSize(400, 400);

    // Lumină
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    scene.add(hemiLight);

    let dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    camera.position.set(0, 1.5, 5);

    // Debug helper (poți elimina după ce merge avatarul)
    const axes = new THREE.AxesHelper(2);
    scene.add(axes);

    const testCube = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshNormalMaterial()
    );
    testCube.position.y = 0;
    scene.add(testCube);

    let avatar;
    let loader = new THREE.GLTFLoader();

    // Încarcă avatarul tău .glb
    loader.load(
        "avatar.glb",   // asigură-te că fișierul avatar.glb este în același folder cu index.html
        function(gltf){
            avatar = gltf.scene;
            avatar.scale.set(2, 2, 2);   // ajustează după nevoie
            avatar.position.y = -1;      // ajustează pivot
            scene.add(avatar);
        },
        undefined,
        function(error){ console.error("Error loading model:", error); alert("Failed to load avatar.glb! Check filename and path."); }
    );

    // Haine simple (cub colorat) pentru demo
    let clothesGeometry = new THREE.BoxGeometry(1.2, 1.3, 0.7);
    let clothesMaterial = new THREE.MeshBasicMaterial({color: 0x3366ff});
    let clothes = new THREE.Mesh(clothesGeometry, clothesMaterial);
    clothes.position.y = 1.0;
    scene.add(clothes);

    function animate(){
        requestAnimationFrame(animate);
        if(avatar) avatar.rotation.y += 0.01;
        clothes.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();

    // Funcție pentru scalarea avatarului după măsuri
    window.updateAvatar = function(){
        let chest = parseFloat(document.getElementById("chest").value) || 0;
        let waist = parseFloat(document.getElementById("waist").value) || 0;
        let hips = parseFloat(document.getElementById("hips").value) || 0;
        let size = document.getElementById("size").value;

        if(avatar){
            let scaleX = 1 + chest / 200;
            let scaleY = 1 + waist / 300;
            let scaleZ = 1 + hips / 200;
            avatar.scale.set(scaleX, scaleY, scaleZ);
        }

        if(size == "S") clothes.scale.set(0.9, 0.9, 0.9);
        if(size == "M") clothes.scale.set(1, 1, 1);
        if(size == "L") clothes.scale.set(1.15, 1.15, 1.15);

        document.getElementById("result").innerHTML = "Avatar updated for size: " + size;
    }

    // Funcție schimbare culoare haine
    window.wearClothes = function(color){
        clothes.material.color.set(color);
    }
}

// Căutare produse
window.searchProducts = function(){
    let q = document.getElementById("search")?.value.toLowerCase() || "";
    let allProducts = document.querySelectorAll('.product');
    allProducts.forEach(p=>{
        let name = p.querySelector('p').innerText.toLowerCase();
        p.style.display = name.includes(q)?'block':'none';
    });
}

// Funcții Cart
window.addToCart = function(name, price){
    let cart = JSON.parse(localStorage.getItem('cart'))||[];
    cart.push({name: name, price: price});
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(name + " added to cart!");
    loadCart();
}

window.loadCart = function(){
    let cart = JSON.parse(localStorage.getItem('cart'))||[];
    let cartList = document.getElementById('cartList');
    if(!cartList) return;
    cartList.innerHTML = '';
    let total = 0;
    cart.forEach(item=>{
        let li = document.createElement('li');
        li.innerText = item.name + " - £" + item.price;
        cartList.appendChild(li);
        total += item.price;
    });
    let totalPrice = document.getElementById('totalPrice');
    if(totalPrice) totalPrice.innerText = "Total: £" + total;
}

window.goCheckout = function(){
    window.location.href = "checkout.html";
}

window.finishOrder = function(){
    localStorage.removeItem('cart');
    alert("Order finished! Cart cleared.");
    window.location.href = "index.html";
}

// Load cart la deschidere pagină
window.addEventListener('load', loadCart);
