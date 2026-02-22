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

module.exports = { createContract, getContracts };
