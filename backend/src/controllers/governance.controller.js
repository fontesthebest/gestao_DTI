const prisma = require('../config/prisma');

const createContract = async (req, res) => {
    const { name, provider, termStart, termEnd, value, responsibleId, status, costCenter, slaMetrics } = req.body;
    try {
        const contract = await prisma.contract.create({
            data: {
                name, provider,
                termStart: new Date(termStart),
                termEnd: new Date(termEnd),
                value: parseFloat(value),
                responsibleId, status, costCenter, slaMetrics
            }
        });
        res.status(201).json(contract);
    } catch (error) {
        res.status(500).json({ message: 'Error creating contract', error: error.message });
    }
};

const getContracts = async (req, res) => {
    try {
        const contracts = await prisma.contract.findMany({
            include: { responsible: true }
        });
        res.json(contracts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contracts', error: error.message });
    }
};

const deleteContract = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.contract.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contract', error: error.message });
    }
};

// Projetos
const createProject = async (req, res) => {
    const { name, description, status, budget } = req.body;
    try {
        const project = await prisma.project.create({
            data: { name, description, status, budget: budget ? parseFloat(budget) : null }
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await prisma.project.findMany();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
};

const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.project.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
};

module.exports = {
    createContract,
    getContracts,
    deleteContract,
    createProject,
    getProjects,
    deleteProject
};
