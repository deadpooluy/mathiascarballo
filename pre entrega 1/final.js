const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 8080;

app.use(express.json());

const productsRouter = express.Router();

productsRouter.get('/', (req, res) => {
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los productos');
      return;
    }

    const productos = JSON.parse(data);
    res.json(productos);
  });
});

productsRouter.get('/:pid', (req, res) => {
  const productId = req.params.pid;

  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los productos');
      return;
    }

    const productos = JSON.parse(data);
    const producto = productos.find((p) => p.id === productId);

    if (producto) {
      res.json(producto);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  });
});

productsRouter.post('/', (req, res) => {
  const newProduct = req.body;

  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los productos');
      return;
    }

    const productos = JSON.parse(data);

    const newProductId = generateProductId(productos);
    newProduct.id = newProductId;

    productos.push(newProduct);

    fs.writeFile('productos.json', JSON.stringify(productos), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al guardar el producto');
        return;
      }

      res.status(201).json(newProduct);
    });
  });
});

productsRouter.put('/:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;

  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los productos');
      return;
    }

    let productos = JSON.parse(data);

    const productIndex = productos.findIndex((p) => p.id === productId);

    if (productIndex !== -1) {
      productos[productIndex] = { ...productos[productIndex], ...updatedProduct };

      fs.writeFile('productos.json', JSON.stringify(productos), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error al guardar el producto');
          return;
        }

        res.json(productos[productIndex]);
      });
    } else {
      res.status(404).send('Producto no encontrado');
    }
  });
});

productsRouter.delete('/:pid', (req, res) => {
  const productId = req.params.pid;

  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los productos');
      return;
    }

    let productos = JSON.parse(data);

    productos = productos.filter((p) => p.id !== productId);

    fs.writeFile('productos.json', JSON.stringify(productos), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al eliminar el producto');
        return;
      }

      res.sendStatus(204);
    });
  });
});

app.use('/api/products', productsRouter);

const cartsRouter = express.Router();

cartsRouter.post('/', (req, res) => {
  const newCart = {
    id: generateCartId(),
    products: []
  };

  fs.writeFile('carrito.json', JSON.stringify(newCart), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al crear el carrito');
      return;
    }

    res.status(201).json(newCart);
  });
});

cartsRouter.get('/:cid', (req, res) => {
  const cartId = req.params.cid;

  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer el carrito');
      return;
    }

    const cart = JSON.parse(data);

    if (cart.id === cartId) {
      res.json(cart.products);
    } else {
      res.status(404).send('Carrito no encontrado');
    }
  });
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer el carrito');
      return;
    }

    const cart = JSON.parse(data);

    if (cart.id === cartId) {
      const existingProduct = cart.products.find((p) => p.product === productId);

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.products.push({
          product: productId,
          quantity: 1
        });
      }

      fs.writeFile('carrito.json', JSON.stringify(cart), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error al agregar el producto al carrito');
          return;
        }

        res.json(cart);
      });
    } else {
      res.status(404).send('Carrito no encontrado');
    }
  });
});

app.use('/api/carts', cartsRouter);

function generateProductId(productos) {
  let newId = Math.floor(Math.random() * 1000) + 1;

  while (productos.some((p) => p.id === newId)) {
    newId = Math.floor(Math.random() * 1000) + 1;
  }

  return newId;
}

function generateCartId() {
  return Math.random().toString(36).substr(2, 9);
}

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
