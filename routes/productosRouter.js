const express = require('express')
const { getData , buscarId , estaProducto , writeData } = require("../contenedor/help/helper")

const fs = require('fs')

const productosRouter = express.Router()

productosRouter.get('/', async (req, res) => {
  try {
    const contenedor = await getData('./contenedor/productos.txt');
    contenedor !== undefined
          ? res.send(contenedor)
          : res.json({ error: 'producto no encontrado' })
  } catch (error) {
      console.log(error)
  } 
})

productosRouter.get('/:Id', async (req, res) => {
  let numeroId = req.params.Id;
  if (isNaN(req.params.Id)) {
    res.json({ error: 'el parametro no es un numero' })
  } else {
    const productoBuscado = await buscarId('./contenedor/productos.txt',numeroId);
    productoBuscado !== null
      ? res.send(productoBuscado)
      : res.json({ error: 'producto no encontrado' })
  }
})

productosRouter.post('/', async (req, res) => {
  const productos = await getData('./contenedor/productos.txt');
      if (productos=='[]') {
        productos=0
      }
        const id = productos.length + 1;
        const {nombre_producto,Precio,url_de_producto} = req.body
      const productoGuardado = [];
      if (id == 1){
        try {
          productoGuardado.push({...req.body, nombre_producto: nombre_producto, Precio: Precio, url_de_producto: url_de_producto, id: id })
          writeData('./contenedor/productos.txt',[{...req.body, nombre_producto: nombre_producto, Precio: Precio, url_de_producto: url_de_producto, id: id }]);
          return res.json([{...req.body,  nombre_producto: nombre_producto, Precio: Precio, url_de_producto: url_de_producto, id: id }])
        } catch (e) {
          console.log('No se pudo guardar los objeto '+e);
        }
      }else {
        try {
          writeData('./contenedor/productos.txt',[...productos, {...req.body, nombre_producto: nombre_producto, Precio: Precio, url_de_producto: url_de_producto, id: id }]);
          productoGuardado.push(...productos,{...req.body, nombre_producto: nombre_producto, Precio: Precio, url_de_producto: url_de_producto, id: id })
          return res.json([{...req.body, nombre_producto: nombre_producto, Precio: Precio, url_de_producto: url_de_producto, id: id }])
          } catch (e) {
          console.log('No se pudo guardar el objeto '+e);
        }
      }
    
    res.json({ error: 'productos no encontrado' })
})

productosRouter.put("/:id", async (req, res) => {
  const numeroId = req.params.id;
    try {
      const productos = await getData('./contenedor/productos.txt');
      if (estaProducto(numeroId,productos)) { 
      const indexProducto = (req.params.id)-1
      const productoCargar = {...req.body, id: numeroId }
      productos.splice(indexProducto, 1 , productoCargar)
      writeData('./contenedor/productos.txt',productos);
      return res.json('se actualizo el producto')
      }
      //console.log((estaProducto(numeroId,productos)))
      res.json('no esta el producto')
    } catch (error) {
      console.log('no se pudo post producto nuevo '+error)
    }

});

productosRouter.delete("/:id", async (req, res) => {
  const id= Number(req.params.id)
  try {
    const productos = await getData('./contenedor/productos.txt');
    const indice = id-1
    if (estaProducto(id,productos)) { 
    productos.splice(indice,1)
    let indiceId=1
    productos.forEach(element => { 
      element.id = indiceId; 
      indiceId ++;
    });
    writeData('./contenedor/productos.txt',productos);
    return res.json({ mensaje: `El item con el ID ${id} fue eliminado` });
    }
    res.json({ mensaje: `El item con el ID ${id} no esta` });
  } catch (err) {
    res.json({ mensaje: `no se pudo eliminar el id`});
  }
});

module.exports = productosRouter