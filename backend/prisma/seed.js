const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@painelti.com' },
        update: {},
        create: {
            email: 'admin@painelti.com',
            name: 'Administrador Central',
            password: hashedPassword,
            role: 'ADMIN',
            team: 'DIRETORIA'
        },
    });

    console.log({ admin });

    // Seed data for ETs
    await prisma.eT.create({
        data: {
            etNumber: 'ET-FIN-001',
            entryDate: new Date(),
            reportedDefect: 'Não liga',
            status: 'OPEN'
        }
    });

    await prisma.server.upsert({
        where: { hostname: 'SRV-PROD-DB' },
        update: {},
        create: {
            hostname: 'SRV-PROD-DB',
            ip: '192.168.1.50',
            os: 'Ubuntu 22.04 LTS',
            physicalLocation: 'Datacenter A',
            responsible: 'Equipe Infra',
            status: 'ONLINE'
        }
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
