const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const { loadSequelize, dbConnect } = require('./models/index')
const { propertyModel } = require('./models/property')
const { propertyPicturesModel } = require('./models/propertyPictures')
const { propertyAmenitiesModel } = require('./models/propertyAmenities')
const { DataTypes } = require('sequelize')

AWS.config.update({region: 'us-east-1'})
AWSXRay.setContextMissingStrategy("LOG_ERROR")

let response;
let sequelize = null;

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
  const PropertyAmenities = propertyAmenitiesModel(sequelize, DataTypes)
  Property.hasMany(PropertyPictures, {foreignKey: 'property_id', onDelete: 'SET DEFAULT', onUpdate: 'SET DEFAULT', hooks: true});
  PropertyPictures.belongsTo(Property, {foreignKey: 'property_id'});
  PropertyAmenities.belongsTo(Property, {foreignKey: 'property_id'});
  Property.hasOne(PropertyAmenities, {foreignKey: 'property_id', onDelete: 'SET DEFAULT', onUpdate: 'SET DEFAULT', hooks: true});

  try {
    const listing = await Property.findOne({
      where: {id: event.pathParameters.id},
      include: [{model: PropertyAmenities}, {model: PropertyPictures, attributes: ['id', 'location']}]
    })
    response = {
      'statusCode': 200,
      'body': JSON.stringify({
        listing: listing
      })
    }
  } catch (error) {
    console.log(error);
    response = {
      'statusCode': 500,
    }
  }
  return response
}

