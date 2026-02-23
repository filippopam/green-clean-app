const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando siembra de datos robusta...');

  // Limpieza en orden jerárquico
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.route.deleteMany({});

  // 1. Catálogo de Productos (Precios Reales)
  await prisma.product.createMany({
    data: [
      { name: 'Camisa de vestir', price: 65.00, category: 'Ropa' },
      { name: 'Pantalón / Mezclilla', price: 75.00, category: 'Ropa' },
      { name: 'Vestido sencillo', price: 120.00, category: 'Ropa' },
      { name: 'Saco / Blazer', price: 150.00, category: 'Ropa' },
      { name: 'Edredón matrimonial', price: 250.00, category: 'Blancos' }
    ]
  });

  // 2. Rutas de Cobertura (Esto arreglará el error del frontend)
  await prisma.route.createMany({
    data: [
      {
        name: 'Ruta Norte: Viñedos',
        daysOfWeek: [2, 5], 
        zipCodes: ['27018', '27019'],
        isActive: true
      },
      {
        name: 'Ruta Sur: Campestre',
        daysOfWeek: [1, 4], 
        zipCodes: ['27250', '27200'],
        isActive: true
      }
    ]
  });

  console.log('✅ Base de datos lista para operar.');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());