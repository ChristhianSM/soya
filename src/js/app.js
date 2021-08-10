import {productos} from '../data/datos.js'

/* Variables */
const contenedorCardDestacados = document.querySelector('.contenedorDestacados');
const contenedorCardProductos = document.querySelector('.contenedorProductos');
const contenedorCompra = document.querySelector('.contenedor-compra');
const vaciarCarrito = document.querySelector('.vaciar-carrito');
const btnComprar = document.querySelector('.comprar');

let carritoCompras = [];
let totalPagar = 0;

document.addEventListener('DOMContentLoaded',() => {
    mostrarDestacados();
    mostrarProductos();

    carritoCompras = JSON.parse(localStorage.getItem("productos")) || [];
    mostrarProductosCarrito();
})

eventosListener()
function eventosListener(){
    btnComprar.addEventListener('click', () =>{

        Swal.fire({
            title: '¿Esta seguro que desea Confirmar este pedido?',
            icon: 'question',
            showDenyButton: true,
            confirmButtonText: `Confirmar`,
            denyButtonText: `Cancelar`,
            customClass : {
                title : 'sweet-title',
                icon : "sweet-icon",
                confirmButton: 'sweet-confirm',
                denyButton : 'sweet-deny',
            }
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                const textoFormateado = carritoCompras.map( producto => {
                    return `${producto.nombre}  -> ${producto.precio}  ->Cantidad : ${producto.cantidad}`
                }).join("%0A");
        
                const URL = `https://api.whatsapp.com/send?phone=+051959686193&text=*_Soya_*%0A*Hola ¿Qué tal como estas?*%0A%0A*Quisiera confirmar la siguiente Orden:*%0A${textoFormateado} %0A%0A----->Total a pagar : $${totalPagar}`
                window.open(URL, "_blank");

                carritoCompras = [];
                guardarLocalStorage();
                mostrarProductosCarrito();
            }
        })

        
    })

    vaciarCarrito.addEventListener('click', () => {
        carritoCompras = [];
        guardarLocalStorage();
        mostrarProductosCarrito();
    })
}

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

function mostrarProductos() {
    productos.forEach(producto => {
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
                        <img src = './src/img/Estrella-06.png'/>
                        <img src = './src/img/Estrella-06.png'/>
                        <img src = './src/img/Estrella-06.png'/>
                        <img src = './src/img/Estrella-06.png'/>
                        <img src = './src/img/Estrella-06.png'/>
                        <img src = './src/img/Estrella-06.png'/>
                    </div>
                    <p>${productoEcontrado.descripcion}</p>
                    <div class = "aromas">
                        <p>Aromas disponibles</p>
                        <ul class = "listaAromas">
                            ${productoEcontrado.aromas.map( aroma =>`<li>${aroma}</li>`).join('')}
                        </ul>
                    </div>
                    <div class = "divCantidad">
                        <label> Cantidad : </label>
                        <input type = "number" value = "1" min= "1" max = "20"/>
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
                <button class="btnAnnadirProducto" data-id = ${productoEcontrado.id} data-pushbar-target="pushbar-menu" data-bs-dismiss="modal">Añadir al carrito</button>
            `
            annadirProducto();
        })
    })
}

function annadirProducto(){
    const btnAnnadirProducto = document.querySelector('.btnAnnadirProducto');
    btnAnnadirProducto.addEventListener('click', ()=>{
        /* Mostrar alerta de producto */
        mostrarAlerta('success', 'Producto añadido al carrito correctamente');
        
        /* Extraemos el id y la cantidad que desea comprar*/
        const idProducto = parseInt(btnAnnadirProducto.dataset.id);
        const inputCantidad = parseInt(document.querySelector('.divCantidad input').value);
        console.log(inputCantidad);

        /* Verificar si el producto existe en el carrito de compras */
        const existeProducto = carritoCompras.some(producto => producto.id === idProducto);
        if (!existeProducto ) {
            const productoEcontrado = productos.find(elemento => elemento.id === idProducto);
            productoEcontrado.cantidad = inputCantidad;
            carritoCompras = [...carritoCompras, productoEcontrado];
        }else{
            mostrarAlerta('success', 'Cantidad actualizada')
            const productoEcontrado = carritoCompras.find(elemento => elemento.id === idProducto);
            productoEcontrado.cantidad = productoEcontrado.cantidad + inputCantidad;
        }
        
        guardarLocalStorage();
        mostrarProductosCarrito();      
    })
}

function mostrarProductosCarrito() {
    limpiarCarritoCompras();
    if (carritoCompras.length === 0) {
        document.querySelector('.cantidad-compras').textContent = 0;
        const divIcono = document.createElement('div');
        divIcono.classList.add('div-icono')
        const icono = document.createElement('i');
        icono.classList.add('fas', 'fa-shopping-cart');
        const p = document.createElement('p');
        p.classList.add('mensaje-vacio')
        p.textContent = "El carrito de productos está vacío";
        divIcono.appendChild(icono)
        divIcono.appendChild(p);
        contenedorCompra.appendChild(divIcono);

        /* Deshabilitamos los botones de compra y de vaciar carrito*/
        vaciarCarrito.classList.remove('activo');
        vaciarCarrito.classList.add('inactivo');
        vaciarCarrito.disabled = true;
        btnComprar.classList.remove('activo');
        btnComprar.classList.add('inactivo');
        btnComprar.disabled = true

    }else{
        document.querySelector('.cantidad-compras').textContent = carritoCompras.length;

        /* Deshabilitamos el boton */
        vaciarCarrito.classList.remove('inactivo');
        vaciarCarrito.classList.add('activo');
        vaciarCarrito.disabled = false;
        btnComprar.classList.remove('inactivo');
        btnComprar.classList.add('activo');
        btnComprar.disabled = false
    }

    carritoCompras.forEach( producto => {
        const {id, img, precio, nombre, cantidad} = producto;
        const divProducto = document.createElement('div');
        divProducto.classList.add('div-producto');
        
        const imagenProducto = document.createElement('img');
        imagenProducto.src = img;

        const divInformacion = document.createElement('div');
        divInformacion.classList.add('div-informacion');

        const nombreProducto = document.createElement('p');
        nombreProducto.classList.add('nombre-producto')
        nombreProducto.textContent = nombre;

        const precioProducto = document.createElement('p');
        precioProducto.classList.add('precio-producto')
        precioProducto.textContent = '$ ' +precio;

        const cantidadProducto = document.createElement('p');
        cantidadProducto.classList.add('cantidad-producto')
        cantidadProducto.textContent = cantidad;

        const precioPorCantidad = document.createElement('p');
        precioPorCantidad.classList.add('precio-por-cantidad')
        precioPorCantidad.textContent = cantidad * precio;

        const btnEliminar = document.createElement('a');
        btnEliminar.classList.add('btn-eliminar');
        btnEliminar.textContent = "X";
        btnEliminar.onclick = () => {
            eliminarProducto(id)
        }

        totalPagar = totalPagar + cantidad*precio;

        divInformacion.appendChild(nombreProducto);
        divInformacion.appendChild(precioProducto);
        
        divProducto.appendChild(imagenProducto)
        divProducto.appendChild(divInformacion)
        divProducto.appendChild(cantidadProducto);
        divProducto.appendChild(precioPorCantidad);
        divProducto.appendChild(btnEliminar)

        contenedorCompra.appendChild(divProducto)
    })

    document.querySelector('.total').textContent = ` $ ${totalPagar}`;
}

function eliminarProducto(id){
    // const confirmacion = confirm('¿Esta seguro que desea eliminar este producto?');
    Swal.fire({
        title: '¿Esta seguro que desea eliminar este producto?',
        icon: 'question',
        showDenyButton: true,
        confirmButtonText: `Confirmar`,
        denyButtonText: `Cancelar`,
        customClass : {
            title : 'sweet-title',
            icon : "sweet-icon",
            confirmButton: 'sweet-confirm',
            denyButton : 'sweet-deny',
        }
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            carritoCompras = carritoCompras.filter(producto => producto.id !== id);
            guardarLocalStorage();
            mostrarProductosCarrito();
        }
    })
}

function limpiarCarritoCompras(){
    totalPagar = 0;
    while(contenedorCompra.firstElementChild){
        contenedorCompra.removeChild(contenedorCompra.firstElementChild);
    }
}

function guardarLocalStorage(){
    localStorage.setItem("productos",JSON.stringify(carritoCompras))
}

function mostrarAlerta(tipo, mensaje) {
    Swal.fire({
        title: mensaje,
        icon: tipo,
        confirmButtonText: 'Aceptar',
        padding : "2rem",
        timer: 3000,
        timerProgressBar : true,

        customClass : {
            title : 'sweet-title',
            icon : "sweet-icon",
            confirmButton: 'sweet-confirm',
        }
    })
}

