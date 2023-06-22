class ProductManager {
    constructor() {
      this.products = [];
    }
  
    getProducts() {
      return this.products;
    }
  
    addProduct(product) {
      const existingProduct = this.products.find((p) => p.code === product.code);
      if (existingProduct) {
        throw new Error("El código del producto está repetido.");
      }
  
      const newProduct = { ...product, id: this.generateId() };
      this.products.push(newProduct);
    }
  
    getProductById(id) {
      const product = this.products.find((p) => p.id === id);
      if (!product) {
        throw new Error("No se encontró el producto con el ID proporcionado.");
      }
  
      return product;
    }
  
    generateId() {
      const timestamp = Date.now().toString(36);
      const randomString = Math.random().toString(36).substring(2, 8);
      return "${timestamp}-${randomString}";
    }
  }
  
  const manager = new ProductManager();
  
  console.log(manager.getProducts());
  
  class producto {
    constructor(title,prcio,imagen,codigo,stock){
  };
      
    
    this.title: "producto prueba";
    this.description: "Este es un producto prueba";
    this.prcio: 100;
    this.imagen: "Sin imagen";
    this.codigo: "abc123";
    this.stock: 15;
  };
  manager.addProduct(producto);
  
  
  console.log(manager.getProducts()); 
  
  
  try {
    manager.addProduct(producto);
  } catch (error) {
    console.log(error.message); 
  }
  
  
  console.log(manager.getProductById("producto1")); 
  
  
  try {
    manager.getProductById('non-existent-id');
  } catch (error) {
    console.log(error.message); 
  }
