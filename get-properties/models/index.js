const Sequelize = require('sequelize')
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'})

exports.sequelize  = null;

exports.loadSequelize = async () => {
  const ssm = await new AWS.SSM().getParametersByPath({Path: '/db', Recursive: false, WithDecryption: true}).promise()
  const sequelize = new Sequelize(ssm.Parameters[0].Value, ssm.Parameters[4].Value, ssm.Parameters[2].Value, {
    host: ssm.Parameters[1].Value,
    port: parseInt(ssm.Parameters[3].Value),
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

