const prisma = require('../config/prisma');

const createServer = async (req, res) => {
    const { hostname, ip, os, physicalLocation, responsible, status } = req.body;
    try {
        const server = await prisma.server.create({
            data: { hostname, ip, os, physicalLocation, responsible, status }
        });
        res.status(201).json(server);
    } catch (error) {
        res.status(500).json({ message: 'Error creating server', error: error.message });
    }
};

const getServers = async (req, res) => {
    try {
        const servers = await prisma.server.findMany({
            include: { downtimes: true }
        });
        res.json(servers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching servers', error: error.message });
    }
};

const updateServerStatus = async (req, res) => {
    const { id } = req.params;
    const { status, reason } = req.body;
    try {
        const oldServer = await prisma.server.findUnique({ where: { id } });
        const server = await prisma.server.update({
            where: { id },
            data: { status }
        });

        if (status === 'OFFLINE' && oldServer.status !== 'OFFLINE') {
            await prisma.downtime.create({
                data: { serverId: id, start: new Date(), reason }
            });
        } else if (status === 'ONLINE' && oldServer.status === 'OFFLINE') {
            const lastDowntime = await prisma.downtime.findFirst({
                where: { serverId: id, end: null },
                orderBy: { start: 'desc' }
            });
            if (lastDowntime) {
                await prisma.downtime.update({
                    where: { id: lastDowntime.id },
                    data: { end: new Date() }
                });
            }
        }

        res.json(server);
    } catch (error) {
        res.status(500).json({ message: 'Error updating server status', error: error.message });
    }
};

module.exports = { createServer, getServers, updateServerStatus };
