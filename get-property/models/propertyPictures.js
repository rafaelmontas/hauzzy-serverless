const { propertyModel } = require('./property')


exports.propertyPicturesModel = (sequelize, DataTypes) => {
  const PropertyPictures = sequelize.define('PropertyPictures', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    original_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    encoding: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mimetype: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bucket: {
      type: DataTypes.STRING,
      allowNull: false
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    acl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    storage_class: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    label: {
      type: DataTypes.STRING,
      allowNull: true
    },
    property_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    tableName: 'property_pictures',
    indexes: [
      {
        fields: ['property_id']
      }
    ]
  });
  // PropertyPictures.belongsTo(propertyModel, {foreignKey: 'property_id'});
  // PropertyPictures.associate = function(models) {
  //   // associations can be defined here
  // };
  return PropertyPictures;
};