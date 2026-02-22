const prisma = require('../config/prisma');

const getAdminStats = async (req, res) => {
    try {
        const totalOSOpen = await prisma.serviceOrder.count({ where: { status: 'OPEN' } });
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

        res.json({
            totalOSOpen,
            securityIncidentsActive,
            contractsExpiring,
            serversOffline
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};

module.exports = { getAdminStats };
