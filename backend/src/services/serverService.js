const prisma = require('../config/prisma');
const ping = require('ping');

const checkAll = async () => {
    try {
        const servers = await prisma.server.findMany();

        for (const server of servers) {
            try {
                const result = await ping.promise.probe(server.ip, { timeout: 2 });

                if (result.alive) {
                    // servidor respondeu
                    if (server.status === 'OFFLINE') {
                        const lastDowntime = await prisma.downtime.findFirst({
                            where: {
                                serverId: server.id,
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

                    await prisma.server.update({
                        where: { id: server.id },
                        data: {
                            status: 'ONLINE',
                            failureCount: 0
                        }
                    });

                    console.log(`[ONLINE] ${server.hostname} (${server.ip}) - ${result.time} ms`);

                } else {
                    // falha no ping
                    const newFailureCount = server.failureCount + 1;

                    if (newFailureCount >= 3 && server.status !== 'OFFLINE') {

                        await prisma.server.update({
                            where: { id: server.id },
                            data: {
                                status: 'OFFLINE',
                                failureCount: newFailureCount
                            }
                        });

                        await prisma.downtime.create({
                            data: {
                                serverId: server.id,
                                start: new Date(),
                                reason: 'Servidor não respondeu ao ping (3 falhas consecutivas)'
                            }
                        });

                        console.log(`[OFFLINE] ${server.hostname} (${server.ip})`);

                    } else {

                        await prisma.server.update({
                            where: { id: server.id },
                            data: {
                                failureCount: newFailureCount
                            }
                        });

                        console.log(`[FAIL ${newFailureCount}/3] ${server.hostname} (${server.ip})`);
                    }
                }

            } catch (error) {
                console.error(`Erro ao verificar ${server.hostname}:`, error.message);
            }
        }

    } catch (error) {
        console.error('Erro geral no monitoramento:', error.message);
    }
};

module.exports = {
    checkAll
};