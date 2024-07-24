const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const requestTracer = require('./middleware/requestTracer');
const errorHandler = require('./middleware/errorHandler');

const serviceRoutes = require('./routes/serviceRoutes');
const metricRoutes = require('./routes/metricRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const alertRuleRoutes = require('./routes/alertRuleRoutes');
const sloRoutes = require('./routes/sloRoutes');

const app = express();

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '2mb' }));
app.use(requestTracer);

app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'CloudOps-Pulse Observability Platform',
    version: '1.0.0',
    clusterZone: 'us-east-1a',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/services', serviceRoutes);
app.use('/api/metrics', metricRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/alerts', alertRuleRoutes);
app.use('/api/slo', sloRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`[CloudOps-Pulse] Observability agent listening on port ${PORT}`);
    });
  });
}

module.exports = app;
