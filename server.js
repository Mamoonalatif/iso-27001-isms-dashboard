const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware (ISO 27001 A.14.1.3 - Security in development and support processes)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com"]
        }
    }
}));

// Rate limiting (ISO 27001 A.13.1.1 - Network controls)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'your-domain.com' : 'http://localhost:3000',
    credentials: true
}));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// In-memory data store (In production, use a proper database)
let data = {
    assets: [
        {
            id: uuidv4(),
            name: 'Web Server',
            type: 'Server',
            classification: 'High',
            owner: 'IT Department',
            location: 'Data Center A',
            riskLevel: 'Medium',
            lastAssessed: moment().subtract(30, 'days').format('YYYY-MM-DD'),
            status: 'Active'
        },
        {
            id: uuidv4(),
            name: 'Customer Database',
            type: 'Database',
            classification: 'Critical',
            owner: 'Data Protection Officer',
            location: 'Secure Cloud',
            riskLevel: 'High',
            lastAssessed: moment().subtract(15, 'days').format('YYYY-MM-DD'),
            status: 'Active'
        },
        {
            id: uuidv4(),
            name: 'Employee Laptops',
            type: 'Hardware',
            classification: 'Medium',
            owner: 'HR Department',
            location: 'Distributed',
            riskLevel: 'Medium',
            lastAssessed: moment().subtract(45, 'days').format('YYYY-MM-DD'),
            status: 'Active'
        }
    ],
    risks: [
        {
            id: uuidv4(),
            title: 'Unauthorized Data Access',
            description: 'Potential unauthorized access to customer database',
            category: 'Data Security',
            probability: 'Medium',
            impact: 'High',
            riskScore: 15,
            status: 'Open',
            owner: 'CISO',
            mitigation: 'Implement multi-factor authentication',
            dueDate: moment().add(30, 'days').format('YYYY-MM-DD'),
            createdDate: moment().subtract(10, 'days').format('YYYY-MM-DD')
        },
        {
            id: uuidv4(),
            title: 'Phishing Attack',
            description: 'Employees may fall victim to phishing emails',
            category: 'Human Factor',
            probability: 'High',
            impact: 'Medium',
            riskScore: 12,
            status: 'In Progress',
            owner: 'Security Team',
            mitigation: 'Enhanced security awareness training',
            dueDate: moment().add(15, 'days').format('YYYY-MM-DD'),
            createdDate: moment().subtract(20, 'days').format('YYYY-MM-DD')
        }
    ],
    incidents: [
        {
            id: uuidv4(),
            title: 'Suspicious Login Attempt',
            description: 'Multiple failed login attempts detected from unusual location',
            severity: 'Medium',
            status: 'Resolved',
            reportedBy: 'Security Monitoring System',
            assignedTo: 'Security Team',
            reportedDate: moment().subtract(5, 'days').format('YYYY-MM-DD HH:mm'),
            resolvedDate: moment().subtract(3, 'days').format('YYYY-MM-DD HH:mm'),
            category: 'Access Control'
        },
        {
            id: uuidv4(),
            title: 'Malware Detection',
            description: 'Malware detected on employee workstation',
            severity: 'High',
            status: 'In Progress',
            reportedBy: 'Antivirus System',
            assignedTo: 'IT Security',
            reportedDate: moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm'),
            resolvedDate: null,
            category: 'Malware'
        }
    ],
    policies: [
        {
            id: uuidv4(),
            title: 'Information Security Policy',
            version: '2.1',
            status: 'Active',
            approvedBy: 'CEO',
            approvedDate: moment().subtract(90, 'days').format('YYYY-MM-DD'),
            reviewDate: moment().add(275, 'days').format('YYYY-MM-DD'),
            category: 'Security',
            description: 'Comprehensive information security policy framework'
        },
        {
            id: uuidv4(),
            title: 'Access Control Policy',
            version: '1.3',
            status: 'Active',
            approvedBy: 'CISO',
            approvedDate: moment().subtract(60, 'days').format('YYYY-MM-DD'),
            reviewDate: moment().add(305, 'days').format('YYYY-MM-DD'),
            category: 'Access Control',
            description: 'User access management and authorization procedures'
        }
    ],
    controls: [
        {
            id: 'A.5.1.1',
            name: 'Information Security Policies',
            status: 'Implemented',
            effectiveness: 85,
            lastAssessed: moment().subtract(30, 'days').format('YYYY-MM-DD'),
            nextReview: moment().add(335, 'days').format('YYYY-MM-DD'),
            category: 'Organizational'
        },
        {
            id: 'A.9.1.1',
            name: 'Access Control Policy',
            status: 'Implemented',
            effectiveness: 92,
            lastAssessed: moment().subtract(20, 'days').format('YYYY-MM-DD'),
            nextReview: moment().add(345, 'days').format('YYYY-MM-DD'),
            category: 'Access Control'
        },
        {
            id: 'A.12.6.1',
            name: 'Management of Technical Vulnerabilities',
            status: 'Partially Implemented',
            effectiveness: 70,
            lastAssessed: moment().subtract(40, 'days').format('YYYY-MM-DD'),
            nextReview: moment().add(325, 'days').format('YYYY-MM-DD'),
            category: 'Systems Security'
        }
    ],
    audits: [
        {
            id: uuidv4(),
            title: 'Internal Security Audit Q1 2024',
            type: 'Internal',
            status: 'Completed',
            auditor: 'Internal Audit Team',
            startDate: moment().subtract(120, 'days').format('YYYY-MM-DD'),
            endDate: moment().subtract(90, 'days').format('YYYY-MM-DD'),
            findings: 3,
            recommendations: 5
        },
        {
            id: uuidv4(),
            title: 'ISO 27001 Certification Audit',
            type: 'External',
            status: 'Scheduled',
            auditor: 'External Certification Body',
            startDate: moment().add(30, 'days').format('YYYY-MM-DD'),
            endDate: moment().add(35, 'days').format('YYYY-MM-DD'),
            findings: 0,
            recommendations: 0
        }
    ]
};

// Routes

// Dashboard
app.get('/', (req, res) => {
    const dashboardData = {
        totalAssets: data.assets.length,
        activeRisks: data.risks.filter(r => r.status !== 'Closed').length,
        openIncidents: data.incidents.filter(i => i.status !== 'Resolved').length,
        activePolicies: data.policies.filter(p => p.status === 'Active').length,
        implementedControls: data.controls.filter(c => c.status === 'Implemented').length,
        totalControls: data.controls.length,
        upcomingAudits: data.audits.filter(a => a.status === 'Scheduled').length,
        riskDistribution: {
            high: data.risks.filter(r => r.riskScore >= 15).length,
            medium: data.risks.filter(r => r.riskScore >= 8 && r.riskScore < 15).length,
            low: data.risks.filter(r => r.riskScore < 8).length
        },
        recentIncidents: data.incidents.slice(0, 5),
        recentRisks: data.risks.slice(0, 5)
    };
    
    res.render('dashboard', { data: dashboardData, moment });
});

// Asset Management
app.get('/assets', (req, res) => {
    res.render('assets', { assets: data.assets, moment });
});

app.post('/assets', (req, res) => {
    const newAsset = {
        id: uuidv4(),
        name: req.body.name,
        type: req.body.type,
        classification: req.body.classification,
        owner: req.body.owner,
        location: req.body.location,
        riskLevel: req.body.riskLevel,
        lastAssessed: moment().format('YYYY-MM-DD'),
        status: 'Active'
    };
    data.assets.push(newAsset);
    res.redirect('/assets');
});

// Risk Management
app.get('/risks', (req, res) => {
    res.render('risks', { risks: data.risks, moment });
});

app.post('/risks', (req, res) => {
    const probability = parseInt(req.body.probability);
    const impact = parseInt(req.body.impact);
    const riskScore = probability * impact;
    
    const newRisk = {
        id: uuidv4(),
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        probability: req.body.probability,
        impact: req.body.impact,
        riskScore: riskScore,
        status: 'Open',
        owner: req.body.owner,
        mitigation: req.body.mitigation,
        dueDate: req.body.dueDate,
        createdDate: moment().format('YYYY-MM-DD')
    };
    data.risks.push(newRisk);
    res.redirect('/risks');
});

// Incident Management
app.get('/incidents', (req, res) => {
    res.render('incidents', { incidents: data.incidents, moment });
});

app.post('/incidents', (req, res) => {
    const newIncident = {
        id: uuidv4(),
        title: req.body.title,
        description: req.body.description,
        severity: req.body.severity,
        status: 'Open',
        reportedBy: req.body.reportedBy,
        assignedTo: req.body.assignedTo,
        reportedDate: moment().format('YYYY-MM-DD HH:mm'),
        resolvedDate: null,
        category: req.body.category
    };
    data.incidents.push(newIncident);
    res.redirect('/incidents');
});

// Policy Management
app.get('/policies', (req, res) => {
    res.render('policies', { policies: data.policies, moment });
});

// Controls Management
app.get('/controls', (req, res) => {
    res.render('controls', { controls: data.controls, moment });
});

// Audit Management
app.get('/audits', (req, res) => {
    res.render('audits', { audits: data.audits, moment });
});

// Reports
app.get('/reports', (req, res) => {
    const reportData = {
        riskTrends: data.risks.map(r => ({
            date: r.createdDate,
            score: r.riskScore,
            category: r.category
        })),
        controlEffectiveness: data.controls.map(c => ({
            name: c.name,
            effectiveness: c.effectiveness,
            category: c.category
        })),
        incidentTrends: data.incidents.map(i => ({
            date: i.reportedDate,
            severity: i.severity,
            category: i.category
        }))
    };
    res.render('reports', { data: reportData, moment });
});

// API Endpoints for AJAX requests
app.get('/api/dashboard-stats', (req, res) => {
    res.json({
        totalAssets: data.assets.length,
        activeRisks: data.risks.filter(r => r.status !== 'Closed').length,
        openIncidents: data.incidents.filter(i => i.status !== 'Resolved').length,
        controlsCompliance: Math.round((data.controls.filter(c => c.status === 'Implemented').length / data.controls.length) * 100)
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', { 
        message: 'Page not found',
        error: {}
    });
});

app.listen(PORT, () => {
    console.log(`ISO 27001 ISMS Dashboard running on port ${PORT}`);
    console.log(`Open your browser and navigate to: http://localhost:${PORT}`);
});
