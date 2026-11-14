const app = require('./backend/server');

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`TechPulse Fullstack Server listening on port ${PORT}`);
  });
}
