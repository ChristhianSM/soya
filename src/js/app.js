import {productos} from '../data/datos.js'

/* Variables */
const contenedorCardDestacados = document.querySelector('.contenedorDestacados');
const contenedorCardProductos = document.querySelector('.contenedorProductos');
const btnVelas = document.querySelector('.btnVelas');
const btnOtros = document.querySelector('.btnOtros');

eventosListener();
function eventosListener() {
    btnVelas.addEventListener("click", () => {
        const productosVela = productos.filter( producto => producto.tipo === "vela");
        mostrarProductos(productosVela);

        /* Pintar btn Velas */
        btnVelas.classList.add('btnSeleccionado');
        btnOtros.classList.remove('btnSeleccionado')
    })

   btnOtros.addEventListener("click", () => {
        const productosOtros = productos.filter( producto => producto.tipo === "otro");
        mostrarProductos(productosOtros);

        /* Pintar btn Velas */
        btnVelas.classList.remove('btnSeleccionado');
        btnOtros.classList.add('btnSeleccionado')
    })
}

document.addEventListener('DOMContentLoaded',() => {
    mostrarDestacados();
    mostrarProductos(productos);
})

function mostrarDestacados(){
    productos.forEach(producto => {
        if (producto.destacado) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.id = producto.id;
            card.dataset.bsToggle = "modal";
            card.dataset.bsTarget = "#productoSeleccionado";
    
            const imagen = document.createElement('img');
            imagen.src = producto.img;
    
            const tituloProducto = document.createElement('p');
            tituloProducto.classList.add('tituloProducto');
            tituloProducto.textContent = producto.nombre;
    
            const precioProducto = document.createElement('p');
            precioProducto.classList.add('precioProducto');
            precioProducto.textContent = `$${producto.precio}`;
    
            card.appendChild(imagen)
            card.appendChild(tituloProducto)
            card.appendChild(precioProducto);
    
            contenedorCardDestacados.appendChild(card);
        }
    })
}

function mostrarProductos(arregloProductos) {

    limpiarHtml();

    arregloProductos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.id = producto.id
        card.dataset.bsToggle = "modal";
        card.dataset.bsTarget = "#productoSeleccionado";

        const imagen = document.createElement('img');
        imagen.src = producto.img;

        const tituloProducto = document.createElement('p');
        tituloProducto.classList.add('tituloProducto');
        tituloProducto.textContent = producto.nombre;

        card.appendChild(imagen)
        card.appendChild(tituloProducto)

        contenedorCardProductos.appendChild(card);
    });

    productoSeleccionado();
}

function productoSeleccionado(){
    const cardsProducto = document.querySelectorAll('.card');
    cardsProducto.forEach( producto => {
        producto.addEventListener('click', () => {
            const idProducto = parseInt(producto.dataset.id);
            const productoEcontrado = productos.find(elemento => elemento.id === idProducto);

            /* Mostramos la informacion en el modal */
            const modalTitle = document.querySelector('.modal-title');
            modalTitle.textContent = productoEcontrado.nombre;

            const modalBody = document.querySelector('.modal-body');
            modalBody.innerHTML = `
                <div class = "info">
                    <h3>Vela</h3>
                    <h2>${productoEcontrado.nombre}</h2>
                    <div class = "estrellas">
                        <img src = './src/img/Estrella-06.png' alt="Imagen no encontrada"/>
                        <img src = './src/img/Estrella-06.png' alt="Imagen no encontrada"/>
                        <img src = './src/img/Estrella-06.png' alt="Imagen no encontrada"/>
                        <img src = './src/img/Estrella-06.png' alt="Imagen no encontrada"/>
                        <img src = './src/img/Estrella-06.png' alt="Imagen no encontrada"/>
                        <img src = './src/img/Estrella-06.png' alt="Imagen no encontrada"/>
                    </div>
                    <p>${productoEcontrado.descripcion}</p>
                    <div class = "aromas">
                        <p>Aromas disponibles</p>
                        <ul class = "listaAromas">
                            ${productoEcontrado.aromas.map( aroma =>`<li>${aroma}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class = "imagenVela">
                    <img src = ${productoEcontrado.img} />
                </div>
            `
            const modalFooter = document.querySelector('.modal-Footer');
            modalFooter.innerHTML = `
                <div class="informacionPago">
                    <p><span>Medios de pago : </span> Efectivo o transferencia Bancaria</p>
                    <p><span>Envios : </span> Pick up gratuito en lobos - Pcia de Bs As - CABA Zona alta palermo</p>
                  </div>
                <a href="#" class="btnComprar" data-id = ${productoEcontrado.id}>Comprar</a>
            `

            comprarProducto();
        })
    })
}

function comprarProducto(){
    const btnComprar = document.querySelector('.btnComprar');
    btnComprar.addEventListener('click', ()=>{
        /* Extraemos el id */
        const idProducto = parseInt(btnComprar.dataset.id);
        console.log(idProducto);

        const productoEcontrado = productos.find(elemento => elemento.id === idProducto);
        const {descripcion, nombre, precio} = productoEcontrado;
        const URL = `https://api.whatsapp.com/send?phone=+051959686193&text=*_Soya_*%0A*Hola ¿Qué tal como estas?*%0A%0A*Quisiera confirmar la siguiente Orden:*%0A*${nombre}   ->Precio: $${precio}`
        window.open(URL, "_blank")
    })
}

function limpiarHtml() {
    while (contenedorCardProductos.firstChild) {
        contenedorCardProductos.removeChild(contenedorCardProductos.firstChild)
    }
}