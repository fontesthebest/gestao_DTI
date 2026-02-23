const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                team: true,
                createdAt: true
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    }
};

const createUser = async (req, res) => {
    const { name, email, password, role, team } = req.body;

    try {
        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'E-mail já cadastrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'TECHNICIAN',
                team
            }
        });

        // Auditoria
        await prisma.auditLog.create({
            data: {
                userId: req.user.id, // Quem criou
                action: 'USER_CREATED_BY_ADMIN',
                details: `Usuário ${user.email} criado com role ${user.role}`
            }
        });

        res.status(201).json({
            message: 'Usuário criado com sucesso',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                team: user.team
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role, team, password } = req.body;

    try {
        const data = { name, email, role, team };

        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id },
            data
        });

        // Auditoria
        await prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'USER_UPDATED',
                details: `Dados do usuário ${user.email} atualizados`
            }
        });

        res.json({ message: 'Usuário atualizado com sucesso', user });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Não permitir se auto-deletar
        if (id === req.user.id) {
            return res.status(400).json({ message: 'Você não pode excluir o seu próprio usuário' });
        }

        const user = await prisma.user.delete({ where: { id } });

        // Auditoria
        await prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'USER_DELETED',
                details: `Usuário ${user.email} removido`
            }
        });

        res.json({ message: 'Usuário removido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover usuário', error: error.message });
    }
};

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
};
