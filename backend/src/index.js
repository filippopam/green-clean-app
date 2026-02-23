// backend/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

// Importamos los controladores
const authController = require('./controllers/auth.controller');
const orderController = require('./controllers/order.controller'); // <--- ¡ESTA ES LA CLAVE QUE FALTABA!

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' })); 

// --- RUTAS ---

// 1. Prueba
app.get('/', (req, res) => res.send('🚀 API GreenClean Operativa'));

// 2. Ubicaciones y Cobertura (Actualizado al MVP)
app.get('/api/locations/neighborhoods', async (req, res) => {
  const { zipCode } = req.query;
  try {
    // Buscamos si alguna ruta activa contiene este Código Postal
    const routes = await prisma.route.findMany({
      where: {
        isActive: true,
        zipCodes: { has: String(zipCode) } // Busca dentro del arreglo de CPs
      }
    });

    if (routes.length === 0) {
      return res.json({ covered: false, neighborhoods: [] });
    }

    // Si hay cobertura, le devolvemos un éxito al frontend
    res.json({ covered: true, neighborhoods: ["Zona de Cobertura GreenClean"] });
  } catch (error) {
    console.error("Error buscando cobertura:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/locations/validate-route', async (req, res) => {
  const { zipCode } = req.body;
  try {
    const routes = await prisma.route.findMany({
      where: {
        isActive: true,
        zipCodes: { has: String(zipCode) }
      }
    });

    if (routes.length === 0) {
      return res.status(400).json({ error: 'Zona sin servicio' });
    }

    res.json({ 
      success: true, 
      route: routes[0].name, 
      days: routes[0].daysOfWeek 
    });
  } catch (error) {
    console.error("Error validando ruta:", error);
    res.status(500).json({ error: 'Error validando ruta' });
  }
});

// 3. Usuarios (Auth)
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

// --- AQUÍ ES EL LUGAR IDEAL PARA LOS PRODUCTOS ---
// 4. Catálogo de Productos
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// 5. Pedidos (Orders)
app.post('/api/orders', orderController.createOrder);

// --- RUTAS ADMIN ---
app.get('/api/admin/orders', orderController.getAllOrders);      // Ver todo
app.put('/api/admin/orders/:id', orderController.updateOrderStatus); // Actualizar


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n🏁 Servidor listo en: http://localhost:${PORT}`);
});