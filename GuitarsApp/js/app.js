import { db} from "./guitarras.js"

const divContainer = document.querySelector('main div')
const carritoContainer = document.querySelector('#carrito')
const btnVAI = document.querySelector('#VAI')
let Carrito = []

const createCard = (guitar) => {
    const div = document.createElement('div')
    div.className = 'col-md-6 col-lg-4 my-4 row align-items-center'
    const html  = ` <div class="col-4">
                    <img class="img-fluid" src="./img/${guitar.imagen}.jpg" alt="imagen guitarra">
                </div>
                <div class="col-8">
                    <h3 class="text-black fs-4 fw-bold text-uppercase">${ guitar.nombre }</h3>
                    <p>${guitar.descripcion}</p>
                    <p class="fw-black text-primary fs-3">$${guitar.precio}</p>
                    <button 
                        data-id="${guitar.id}"
                        type="button"
                        class="btn btn-dark w-100 "
                    >Agregar al Carrito</button>
                </div>`
    div.innerHTML = html    
    return div
}
const createCart = (Carrito) => {
    const p = document.createElement('p')
    p.className = 'text-center'
    p.innerText = 'El carrito esta vacío'
    const div = document.createElement('div')
    let total = 0
    let html = `<table class="w-100 table">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>`
    Carrito.forEach(g => {
        total += g.precio * g.cantidad
        html += `<tr data-id="${g.id}">
                    <td>
                        <img class="img-fluid" src="./img/${g.imagen}.jpg" alt="imagen guitarra">
                    </td>
                    <td>${g.nombre}</td>
                    <td class="fw-bold">
                            $${g.precio}
                    </td>
                    <td class="flex align-items-start gap-4">
                        <button
                            type="button"
                            class="btn btn-dark"
                            >-</button>
                            ${g.cantidad}
                        <button
                            type="button"
                            class="btn btn-dark"
                            >+</button>
                    </td>
                    <td>
                        <button
                            class="btn btn-danger"
                            type="button"
                            >X</button>
                    </td>
                </tr>`
    })                
    html += `</tbody>
                </table>

                <p class="text-end">Total a pagar: <span class="fw-bold">${total}</span></p>
                <button class="btn btn-dark w-100 mt-3 p-2">Vaciar Carrito</button>`
    div.innerHTML = html
    if(Carrito.length ===0){
        carritoContainer.innerHTML = ''
        carritoContainer.appendChild(p)
    }else{
        carritoContainer.innerHTML = ''
        carritoContainer.appendChild(div)
    }
}
const buttonClicked = (e) => {
    if(e.target.classList.contains('btn')){
        const dataId = e.target.getAttribute('data-id')
        //Verificar si existe guitar en carrito
        const idCarrito = Carrito.findIndex(g => g.id === Number(dataId))
        //Si no, crea un objeto nuevo
        if(idCarrito === -1){
            Carrito.push({
                ...db[Number(dataId) - 1 ],
                cantidad: 1
            })
        } else { 
            //Si si, incrementa cantidad
            Carrito[idCarrito].cantidad++
        }
        setLocalStorage()
        createCart(Carrito)
    }
}
const carritoClicked = (e) => {
    if(e.target.classList.contains('btn')){
        const btn = e.target.innerText
        const idCarrito = e.target.parentElement.parentElement.getAttribute('data-id')
        const idxCarrito = Carrito.findIndex(g => g.id === Number(idCarrito))
        if(btn === '-'){
            if(Carrito[idxCarrito].cantidad > 1){
                Carrito[idxCarrito].cantidad--
            }
        } else if (btn === '+'){
            if(Carrito[idxCarrito].cantidad < 10){
                Carrito[idxCarrito].cantidad++
            }
        }else if (btn === 'X'){
            Carrito = Carrito.filter(g => g.id !== Number(idCarrito))
        } else if (btn === 'Vaciar Carrito'.toUpperCase()){
            Carrito = []
        }
        createCart(Carrito)
    }
}
//Iterar arrays
// ciclos
// for (let i = 0; i < db.length; i++)
// {
//     console.log(db[i].nombre)
// }
//Metodos de Arrays para iterar
const getLocalStorage = () => {
    const carritoStorage = localStorage.getItem('Carrito')
    if(carritoStorage){
        Carrito = JSON.parse(carritoStorage)
    } else{
        Carrito = []
    }
}

const setLocalStorage = () => {
    localStorage.setItem('Carrito', JSON.stringify(Carrito))
}

db.forEach((guitar) => {
    console.log(guitar.nombre)
    divContainer.appendChild(createCard(guitar))
})
getLocalStorage()
createCart(Carrito)

divContainer.addEventListener('click', buttonClicked)
carritoContainer.addEventListener('click', carritoClicked)
btnVAI.addEventListener('click', buttonClicked)