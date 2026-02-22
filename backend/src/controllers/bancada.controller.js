const prisma = require('../config/prisma');

// --- Equipment (Keep for asset management) ---
const createEquipment = async (req, res) => {
    const { patrimony, userResponsible, type, status, warrantyUntil } = req.body;
    try {
        const equipment = await prisma.equipment.create({
            data: {
                patrimony,
                userResponsible,
                type,
                status,
                warrantyUntil: warrantyUntil ? new Date(warrantyUntil) : null
            }
        });
        res.status(201).json(equipment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating equipment', error: error.message });
    }
};

const getEquipments = async (req, res) => {
    try {
        const equipments = await prisma.equipment.findMany({
            include: { workstations: true, images: true }
        });
        res.json(equipments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching equipments', error: error.message });
    }
};

// --- Estação de Trabalho (ET) - Substituindo OS ---
const createET = async (req, res) => {
    const { etNumber, equipmentId, entryDate, reportedDefect, technicianIds } = req.body;
    try {
        const et = await prisma.eT.create({
            data: {
                etNumber,
                equipmentId,
                entryDate: entryDate ? new Date(entryDate) : new Date(),
                reportedDefect,
                status: 'OPEN',
                technicians: {
                    create: technicianIds?.map(tid => ({ userId: tid })) || []
                }
            },
            include: { technicians: { include: { user: true } } }
        });

        // AuditLog
        await prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'ET_CREATED',
                details: `ET ${etNumber} record created`
            }
        });

        res.status(201).json(et);
    } catch (error) {
        res.status(500).json({ message: 'Error creating ET record', error: error.message });
    }
};

const updateET = async (req, res) => {
    const { id } = req.params;
    const { status, repairDate, exitDate, appliedSolution, reportedDefect } = req.body;
    try {
        const et = await prisma.eT.update({
            where: { id },
            data: {
                status,
                reportedDefect,
                repairDate: repairDate ? new Date(repairDate) : undefined,
                exitDate: exitDate ? new Date(exitDate) : undefined,
                appliedSolution
            }
        });

        // AuditLog
        await prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'ET_UPDATED',
                details: `ET ${id} updated, status: ${status}`
            }
        });

        res.json(et);
    } catch (error) {
        res.status(500).json({ message: 'Error updating ET record', error: error.message });
    }
};

const deleteET = async (req, res) => {
    const { id } = req.params;
    try {
        // Primeiro deletar as relações com técnicos (TechnicianET)
        await prisma.technicianET.deleteMany({
            where: { etId: id }
        });

        await prisma.eT.delete({
            where: { id }
        });

        res.json({ message: 'ET Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting ET', error: error.message });
    }
};

const getETList = async (req, res) => {
    try {
        const etList = await prisma.eT.findMany({
            include: {
                equipment: true,
                technicians: { include: { user: true } }
            },
            orderBy: { entryDate: 'desc' }
        });
        res.json(etList);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ET list', error: error.message });
    }
};

module.exports = {
    createEquipment,
    getEquipments,
    createET,
    updateET,
    deleteET,
    getETList
};
