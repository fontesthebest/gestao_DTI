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

    // Add dummy data for demonstration
    const eq = await prisma.equipment.upsert({
        where: { patrimony: 'TI-001' },
        update: {},
        create: {
            patrimony: 'TI-001',
            userResponsible: 'João Silva',
            type: 'Notebook Dell Latitude',
            status: 'EM USO'
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

    await prisma.server.upsert({
        where: { hostname: 'SRV-TEST-WEB' },
        update: {},
        create: {
            hostname: 'SRV-TEST-WEB',
            ip: '192.168.1.60',
            os: 'Windows Server 2022',
            physicalLocation: 'Escritório Central',
            responsible: 'Analista Teste',
            status: 'MAINTENANCE'
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
