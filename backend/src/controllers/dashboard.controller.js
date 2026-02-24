const prisma = require('../config/prisma');

const getAdminStats = async (req, res) => {
    try {
        const totalETOpen = await prisma.eT.count({ where: { status: 'OPEN' } });
        const totalETInProgress = await prisma.eT.count({ where: { status: 'IN_PROGRESS' } });
        const totalETWaitingParts = await prisma.eT.count({ where: { status: 'WAITING_PARTS' } });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalETFinishedToday = await prisma.eT.count({
            where: {
                status: 'FINISHED',
                repairDate: {
                    gte: today
                }
            }
        });

        const securityIncidentsActive = await prisma.securityIncident.count({ where: { status: { not: 'RESOLVED' } } });

        const now = new Date();
        const nextMonth = new Date();
        nextMonth.setMonth(now.getMonth() + 1);

        const contractsExpiring = await prisma.contract.count({
            where: {
                termEnd: {
                    gte: now,
                    lte: nextMonth
                }
            }
        });

        const serversOffline = await prisma.server.count({ where: { status: 'OFFLINE' } });

        const totalProjects = await prisma.project.count({ where: { status: { not: 'Concluído' } } });
        const totalInventory = await prisma.equipment.count();

        res.json({
            totalETOpen,
            totalETInProgress,
            totalETWaitingParts,
            totalETFinishedToday,
            securityIncidentsActive,
            contractsExpiring,
            serversOffline,
            totalProjects,
            totalInventory
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};

module.exports = { getAdminStats };
