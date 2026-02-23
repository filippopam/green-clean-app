// backend/src/controllers/order.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Crear Pedido (Versión Robusta con Carrito)
const createOrder = async (req, res) => {
  // Ahora esperamos recibir un arreglo de "items" desde el frontend
  // Ejemplo de items: [{ productId: 1, quantity: 2 }, { productId: 2, quantity: 1 }]
  const { userId, street, number = "S/N", zipCode, neighborhood, scheduledDate, items } = req.body;

  try {
    let subtotal = 0;
    const orderItemsData = [];

    // 1. Recorrer el carrito y calcular el precio real consultando la DB
    if (items && items.length > 0) {
      for (const item of items) {
        const product = await prisma.product.findUnique({ 
          where: { id: item.productId } 
        });
        
        if (product) {
          const itemTotal = parseFloat(product.price) * item.quantity;
          subtotal += itemTotal;
          
          // Preparamos los datos para la tabla OrderItem
          orderItemsData.push({
            productId: product.id,
            quantity: item.quantity,
            unitPrice: product.price // Guardamos una "foto" del precio al momento de comprar
          });
        }
      }
    }

    // Si el total es 0, no dejamos que hagan el pedido
    if (subtotal === 0) {
      return res.status(400).json({ error: 'El carrito está vacío o los productos no son válidos' });
    }

    // 2. Guardar la dirección del usuario (Actualizada con 'number' obligatorio)
    const newAddress = await prisma.address.create({
      data: {
        userId: Number(userId),
        alias: 'Casa',
        street: street,
        number: number,
        zipCode: zipCode,
        neighborhood: neighborhood
      }
    });

    // 3. Crear la Orden y sus Items en una sola transacción
    const newOrder = await prisma.order.create({
      data: {
        userId: Number(userId),
        totalAmount: subtotal,
        finalAmount: subtotal, // Aquí en el futuro restaremos los descuentos
        status: 'SCHEDULED', // Estado inicial según tu enum
        pickupDate: new Date(scheduledDate),
        pickupAddress: `${street} ${number}, ${neighborhood}, CP: ${zipCode}`,
        
        // Magia de Prisma: Crea los items relacionados al mismo tiempo
        items: {
          create: orderItemsData
        }
      },
      // Incluimos los items en la respuesta para confirmar
      include: { items: true } 
    });

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res.status(500).json({ error: 'No se pudo crear la orden. Revisa los datos.' });
  }
};

// 2. BUSCAR MIS PEDIDOS (¡Esta es la que te faltaba o estaba mal escrita!)
const getMyOrders = async (req, res) => {
  const { userId } = req.query;
  try {
    const orders = await prisma.order.findMany({
      where: { userId: Number(userId) },
      include: { address: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar pedidos' });
  }
};

// 3. ADMIN: Ver todo
const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true, address: true },
      orderBy: { scheduledDate: 'asc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

// 4. ADMIN: Actualizar Estatus
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { status: status }
    });
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo actualizar' });
  }
};

// EXPORTACIÓN UNIFICADA
module.exports = { 
  createOrder, 
  getMyOrders, 
  getAllOrders, 
  updateOrderStatus 
};