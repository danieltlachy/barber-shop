import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ==================== USUARIOS ====================

// GET: Obtener todos los usuarios
app.get('/api/users', async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// POST: Crear un nuevo usuario
app.post('/api/users', async (req: Request, res: Response) => {
    try {
        const { name, email, phone, password_hash } = req.body;
        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password_hash
            }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

// ==================== BARBEROS ====================

// GET: Obtener todos los usuarios
app.get('/api/users', async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios', details: error });
    }
});

// POST: Crear un nuevo barbero
app.post('/api/barbers', async (req: Request, res: Response) => {
    try {
        const { name, email, phone } = req.body;
        const barber = await prisma.barber.create({
            data: {
                name,
                email,
                phone
            }
        });
        res.json(barber);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear barbero' });
    }
});

// ==================== SERVICIOS ====================

// GET: Obtener todos los servicios
app.get('/api/services', async (req: Request, res: Response) => {
    try {
        const services = await prisma.service.findMany();
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener servicios' });
    }
});

// POST: Crear un nuevo servicio
app.post('/api/services', async (req: Request, res: Response) => {
    try {
        const { name, price, durationMinutes } = req.body;
        const service = await prisma.service.create({
            data: {
                name,
                price,
                durationMinutes
            }
        });
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear servicio' });
    }
});

// ==================== CITAS ====================

// GET: Obtener todas las citas
app.get('/api/appointments', async (req: Request, res: Response) => {
    try {
        const appointments = await prisma.appointment.findMany({
            include: {
                user: true,
                barber: true,
                service: true,
                status: true
            }
        });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener citas' });
    }
});

// POST: Crear una nueva cita
app.post('/api/appointments', async (req: Request, res: Response) => {
    try {
        const { userId, barberId, serviceId, appointmentDate, statusId } = req.body;
        const appointment = await prisma.appointment.create({
            data: {
                userId,
                barberId,
                serviceId,
                appointmentDate: new Date(appointmentDate),
                statusId
            },
            include: {
                user: true,
                barber: true,
                service: true,
                status: true
            }
        });
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear cita' });
    }
});

// PUT: Actualizar una cita
app.put('/api/appointments/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { statusId } = req.body;
        const appointment = await prisma.appointment.update({
            where: { id: parseInt(id as string) },
            data: {
                statusId
            },
            include: {
                user: true,
                barber: true,
                service: true,
                status: true
            }
        });
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar cita' });
    }
});

// ==================== NOTIFICACIONES ====================

// GET: Obtener todas las notificaciones
app.get('/api/notifications', async (req: Request, res: Response) => {
    try {
        const notifications = await prisma.notification.findMany({
            include: {
                type: true,
                status: true,
                appointment: true
            }
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener notificaciones' });
    }
});

// POST: Crear una nueva notificación
app.post('/api/notifications', async (req: Request, res: Response) => {
    try {
        const { appointmentId, message, typeId, statusId } = req.body;
        const notification = await prisma.notification.create({
            data: {
                appointmentId,
                message,
                typeId,
                statusId
            },
            include: {
                type: true,
                status: true
            }
        });
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear notificación' });
    }
});

// ==================== HEALTH CHECK ====================

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Backend de Barbería funcionando correctamente' });
});

// ==================== INICIO DEL SERVIDOR ====================

app.listen(PORT, () => {
    console.log(`✓ Servidor corriendo en http://localhost:${PORT}`);
});