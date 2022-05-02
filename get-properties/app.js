// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
const { loadSequelize, dbConnect } = require('./models/index')
const { propertyModel } = require('./models/property')
const { propertyPicturesModel } = require('./models/propertyPictures')
const { Sequelize, QueryTypes, DataTypes } = require('sequelize')
const Op = Sequelize.Op

let response;
let sequelize = null;


/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context) => {
  if (!sequelize) {
    sequelize = await loadSequelize();
  } else {
    // restart connection pool to ensure connections are not re-used across invocations
    sequelize.connectionManager.initPools();

    // restore `getConnection()` if it has been overwritten by `close()`
    if (sequelize.connectionManager.hasOwnProperty("getConnection")) {
      delete sequelize.connectionManager.getConnection;
    }
  }
  // await dbConnect(sequelize, loadSequelize)
  const Property = propertyModel(sequelize, DataTypes)
  const PropertyPictures = propertyPicturesModel(sequelize, DataTypes)
  Property.hasMany(PropertyPictures, {foreignKey: 'property_id', onDelete: 'SET DEFAULT', onUpdate: 'SET DEFAULT', hooks: true});
  PropertyPictures.belongsTo(Property, {foreignKey: 'property_id'});

  
  try {
    if(event.queryStringParameters == null || event.queryStringParameters.utm_source) {
      const properties = await Property.findAndCountAll({
        where: {listing_active: true, listing_type: 'sale'},
        include: [{model: PropertyPictures, attributes: ['location']}],
        distinct: true,
        order: [['createdAt', 'DESC']]
      })
      console.log(JSON.stringify(event.queryStringParameters))
      response = {
        'statusCode': 200,
        'body': JSON.stringify({
            message: 'hello world',
            properties: properties.rows,
            count: properties.count,
            logs: context.logStreams
        })
      }
    } else {
      let bedsQuery;
      let bathsQuery;
      if (event.queryStringParameters.bedrooms == 0 && event.queryStringParameters.bathrooms == 0) {
        bedsQuery = {
          [Op.gte]: parseInt(event.queryStringParameters.bedrooms)
        },
        bathsQuery = {
          [Op.gte]: parseInt(event.queryStringParameters.bathrooms)
        }
      } else if (event.queryStringParameters.bedrooms != 0 && event.queryStringParameters.bathrooms != 0) {
          bedsQuery = {
            [Op.eq]: parseInt(event.queryStringParameters.bedrooms)
          },
          bathsQuery = {
            [Op.eq]: parseInt(event.queryStringParameters.bathrooms)
          }
      } else if (event.queryStringParameters.bedrooms != 0 && event.queryStringParameters.bathrooms == 0) {
          bedsQuery = {
            [Op.eq]: parseInt(event.queryStringParameters.bedrooms)
          },
          bathsQuery = {
            [Op.gte]: parseInt(event.queryStringParameters.bathrooms)
          }
      } else if (event.queryStringParameters.bedrooms == 0 && event.queryStringParameters.bathrooms != 0) {
          bedsQuery = {
            [Op.gte]: parseInt(event.queryStringParameters.bedrooms)
          },
          bathsQuery = {
            [Op.eq]: parseInt(event.queryStringParameters.bathrooms)
          }
      } else {
          bedsQuery = {
            [Op.eq]: parseInt(event.queryStringParameters.bedrooms)
          },
          bathsQuery = {
            [Op.eq]: parseInt(event.queryStringParameters.bathrooms)
          }
      }
      let propertyTypeString = event.queryStringParameters.property_type;
      let propertyTypeResult = propertyTypeString.split(",");
      // Province
      let province;
      if(event.queryStringParameters.province === "All") {
        province = {
          [Op.like]: "%"
        }
      } else {
        province = {
          [Op.eq]: event.queryStringParameters.province
        }
      }
      // let sector = req.query.sector;
      let sector;
      if(event.queryStringParameters.sector === "All") {
        sector = {
          [Op.like]: "%"
        }
      } else {
        sector = {
          [Op.eq]: event.queryStringParameters.sector
        }
      }
      const properties = await Property.findAndCountAll({
        where: {
          listing_active: true,
          province: province,
          sector: sector,
          listing_type: event.queryStringParameters.listing_type,
          listing_price: {
            [Op.between]: [parseInt(event.queryStringParameters.minPrice), parseInt(event.queryStringParameters.maxPrice)]
          },
          bedrooms: bedsQuery,
          bathrooms: bathsQuery,
          property_type: {
            [Op.or]: propertyTypeResult
          }
        },
        include: [{model: PropertyPictures, attributes: ['location']}],
        distinct: true,
        order: [['createdAt', 'DESC']]
      })

      response = {
        'statusCode': 200,
        'body': JSON.stringify({
            message: 'with query string',
            properties: properties.rows,
            count: properties.count,
            logs: context.logStreams
        })
      }
    }

  } catch (err) {
      console.log(err);
      response = {
        'statusCode': 500,
      }
      // return err;
  }

  return response
};

// function dbConnect() {
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