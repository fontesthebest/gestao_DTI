const prisma = require('../config/prisma');

// --- Incidents ---
const createIncident = async (req, res) => {
    const { type, systemAffected, criticality, impact, analysisResponsibleId, status, detectionDate } = req.body;
    try {
        const incident = await prisma.securityIncident.create({
            data: { type, systemAffected, criticality, impact, analysisResponsibleId, status, detectionDate }
        });
        res.status(201).json(incident);
    } catch (error) {
        res.status(500).json({ message: 'Error creating incident', error: error.message });
    }
};

const getIncidents = async (req, res) => {
    try {
        const incidents = await prisma.securityIncident.findMany({
            include: { analysisResponsible: true }
        });
        res.json(incidents);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching incidents', error: error.message });
    }
};

const resolveIncident = async (req, res) => {  
    const { id } = req.params;
    const { correctiveMeasures, resolutionDate, status } = req.body;
    if (!correctiveMeasures || !resolutionDate || !status) {
        return res.status(400).json({ message: 'Missing required fields: correctiveMeasures, resolutionDate, status' });
    }
    try {        
        const incident = await prisma.securityIncident.update({
            where: { id: id },
            data: { correctiveMeasures, resolutionDate, status }
        });
        res.json(incident);
    } catch (error) {
        res.status(500).json({ message: 'Error updating incident', error: error.message });
    }  
}; 

// --- Vulnerabilities ---
const createVulnerability = async (req, res) => {
    const { description, criticality, actionPlan, status } = req.body;
    try {
        const vulnerability = await prisma.vulnerability.create({
            data: { description, criticality, actionPlan, status }
        });
        res.status(201).json(vulnerability);
    } catch (error) {
        res.status(500).json({ message: 'Error creating vulnerability', error: error.message });
    }
};

const getVulnerabilities = async (req, res) => {
    try {
        const vulnerabilities = await prisma.vulnerability.findMany();
        res.json(vulnerabilities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vulnerabilities', error: error.message });
    }
};

module.exports = { createIncident, getIncidents, createVulnerability, getVulnerabilities, resolveIncident };
