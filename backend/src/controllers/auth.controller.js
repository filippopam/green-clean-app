// backend/src/controllers/auth.controller.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-super-segura';

// --- 1. REGISTRAR USUARIO ---
const register = async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  try {
    // Validar si ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está registrado.' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar en Base de Datos
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        password: hashedPassword,
        role: 'CLIENT'
      }
    });

    // Crear token (el gafete de acceso)
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
      message: 'Usuario creado exitosamente', 
      user: { id: user.id, name: user.fullName, email: user.email },
      token 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario.' });
  }
};

// --- 2. INICIAR SESIÓN ---
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Credenciales inválidas.' });
    }

    // Comparar contraseña (la que escribió vs la encriptada)
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ error: 'Credenciales inválidas.' });
    }

    // Crear token nuevo
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Bienvenido de nuevo',
      user: { id: user.id, name: user.fullName, email: user.email },
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
};

module.exports = { register, login };