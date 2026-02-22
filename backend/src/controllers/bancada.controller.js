const prisma = require('../config/prisma');

// --- Equipment ---
const createEquipment = async (req, res) => {
    const { patrimony, userResponsible, type, status, warrantyUntil } = req.body;
    try {
        const equipment = await prisma.equipment.create({
            data: { patrimony, userResponsible, type, status, warrantyUntil: warrantyUntil ? new Date(warrantyUntil) : null }
        });
        res.status(201).json(equipment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating equipment', error: error.message });
    }
};

const getEquipments = async (req, res) => {
    try {
        const equipments = await prisma.equipment.findMany({
            include: { serviceOrders: true, images: true }
        });
        res.json(equipments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching equipments', error: error.message });
    }
};

// --- Service Orders ---
const createOS = async (req, res) => {
    const { equipmentId, reportedDefect, technicianIds } = req.body;
    try {
        const os = await prisma.serviceOrder.create({
            data: {
                equipmentId,
                reportedDefect,
                status: 'OPEN',
                technicians: {
                    create: technicianIds?.map(tid => ({ userId: tid })) || []
                }
            },
            include: { technicians: { include: { user: true } } }
        });

        // Logging
        await prisma.auditLog.create({
            data: { userId: req.user.id, action: 'OS_CREATED', details: `OS ${os.id} created for equipment ${equipmentId}` }
        });

        res.status(201).json(os);
    } catch (error) {
        res.status(500).json({ message: 'Error creating OS', error: error.message });
    }
};

const updateOS = async (req, res) => {
    const { id } = req.params;
    const { status, technicalDiagnosis, appliedSolution, piecesUsed, formattingDone, closingDate } = req.body;
    try {
        const os = await prisma.serviceOrder.update({
            where: { id },
            data: {
                status,
                technicalDiagnosis,
                appliedSolution,
                piecesUsed,
                formattingDone,
                closingDate: closingDate ? new Date(closingDate) : (status === 'FINISHED' ? new Date() : null)
            }
        });

        // Logging
        await prisma.auditLog.create({
            data: { userId: req.user.id, action: 'OS_UPDATED', details: `OS ${id} status changed to ${status}` }
        });

        res.json(os);
    } catch (error) {
        res.status(500).json({ message: 'Error updating OS', error: error.message });
    }
};

const getOSList = async (req, res) => {
    try {
        const osList = await prisma.serviceOrder.findMany({
            include: { equipment: true, technicians: { include: { user: true } } }
        });
        res.json(osList);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching OS list', error: error.message });
    }
};

module.exports = {
    createEquipment,
    getEquipments,
    createOS,
    updateOS,
    getOSList
};
