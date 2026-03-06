const prisma = require('../config/prisma');
const ping = require('ping');

const createServer = async (req, res) => {
    const { hostname, ip, os, physicalLocation, responsible, status } = req.body;
    const result = await ping.promise.probe(ip, { timeout: 2 });
    if (!result.alive) {
        return res.status(400).json({ message: 'Invalid server IP' });
    }  
    try {
        const server = await prisma.server.create({
            data: { hostname, ip, os, physicalLocation, responsible, status }
        });

        res.status(201).json(server);
    } catch (error) {
        res.status(500).json({
            message: 'Error creating server',
            error: error.message
        });
    }
};

const getServers = async (req, res) => {
    try {
        const servers = await prisma.server.findMany({
            include: { downtimes: true }
        });

        res.json(servers);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching servers',
            error: error.message
        });
    }
};

const updateServerStatus = async (req, res) => {
    const { id } = req.params;
    const { status, reason } = req.body;

    try {
        const serverId = id;

        const oldServer = await prisma.server.findUnique({
            where: { id: serverId }
        });

        if (!oldServer) {
            return res.status(404).json({ message: 'Server not found' });
        }

        const server = await prisma.server.update({
            where: { id: serverId },
            data: { status }
        });

        if (status === 'OFFLINE' && oldServer.status !== 'OFFLINE') {
            await prisma.downtime.create({
                data: {
                    serverId: serverId,
                    start: new Date(),
                    reason: reason || 'Servidor indisponível'
                }
            });
        } else if (status === 'ONLINE' && oldServer.status === 'OFFLINE') {
            const lastDowntime = await prisma.downtime.findFirst({
                where: {
                    serverId: serverId,
                    end: null
                },
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
        res.status(500).json({
            message: 'Error updating server status',
            error: error.message
        });
    }
};


module.exports = {
    createServer,
    getServers,
    updateServerStatus
};