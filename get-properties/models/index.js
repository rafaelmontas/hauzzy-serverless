const Sequelize = require('sequelize')

exports.sequelize  = null;

exports.loadSequelize = async () => {
  const sequelize = new Sequelize(process.env.RDS_DB_NAME, process.env.RDS_USERNAME, process.env.RDS_PASSWORD, {
    host: process.env.RDS_HOSTNAME,
    port: process.env.RDS_PORT,
    dialect: 'postgres',
    pool: {
      max: 2,
      min: 0,
      idle: 0,
      acquire: 3000,
      evict: 15
    }
  });

  // or `sequelize.sync()`
  await sequelize.authenticate();

  return sequelize;
}

// exports.dbConnect = async (sequelize, loadSequelize) => {
//   if (!sequelize) {
//     sequelize = await loadSequelize();
//   } else {
//     // restart connection pool to ensure connections are not re-used across invocations
//     sequelize.connectionManager.initPools();

//     // restore `getConnection()` if it has been overwritten by `close()`
//     if (sequelize.connectionManager.hasOwnProperty("getConnection")) {
//       delete sequelize.connectionManager.getConnection;
//     }
//   }
// }

