import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersPath = path.resolve(__dirname, '../data/users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'medisafechain_secret_key_2026';
const SALT_ROUNDS = 10;

// Load users from file
const loadUsers = () => {
    if (fs.existsSync(usersPath)) {
        return JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    }
    return [];
};

// Save users to file
const saveUsers = (users) => {
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

// POST /api/auth/signup
export const signupHandler = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const validRoles = ['manufacturer', 'distributor', 'consumer'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: 'Invalid role. Must be manufacturer, distributor, or consumer.' });
        }

        const users = loadUsers();
        const exists = users.find(u => u.email === email);
        if (exists) {
            return res.status(409).json({ error: 'An account with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            role,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: `✅ Account created successfully! Welcome, ${name}.`,
            token,
            user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
        });

    } catch (err) {
        console.error('❌ Signup error:', err);
        res.status(500).json({ error: err.message });
    }
};

// POST /api/auth/login
export const loginHandler = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ error: 'Email, password, and role are required.' });
        }

        const users = loadUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        if (user.role !== role) {
            return res.status(403).json({ error: `This account is registered as a ${user.role}, not a ${role}.` });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            success: true,
            message: `✅ Welcome back, ${user.name}!`,
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });

    } catch (err) {
        console.error('❌ Login error:', err);
        res.status(500).json({ error: err.message });
    }
};
