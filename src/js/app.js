import {productosDestacados,productos} from '../data/datos.js'

/* Variables */
const contenedorCardDestacados = document.querySelector('.contenedorDestacados');
const contenedorCardProductos = document.querySelector('.contenedorProductos');

document.addEventListener('DOMContentLoaded',() => {
    mostrarDestacados();
    mostrarProductos();
})

function mostrarDestacados(){
    productosDestacados.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('card');

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
        console.log(card);

        contenedorCardDestacados.appendChild(card);
    })
}

function mostrarProductos() {
    productos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('card');

        const imagen = document.createElement('img');
        imagen.src = producto.img;

        const tituloProducto = document.createElement('p');
        tituloProducto.classList.add('tituloProducto');
        tituloProducto.textContent = producto.nombre;

        // const precioProducto = document.createElement('p');
        // precioProducto.classList.add('precioProducto');
        // precioProducto.textContent = `$${producto.precio}`;

        card.appendChild(imagen)
        card.appendChild(tituloProducto)
        // card.appendChild(precioProducto);
        console.log(card);

        contenedorCardProductos.appendChild(card);
    })
}