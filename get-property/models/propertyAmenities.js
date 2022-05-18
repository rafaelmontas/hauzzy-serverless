

exports.propertyAmenitiesModel = (sequelize, DataTypes) => {
  const PropertyAmenities = sequelize.define('PropertyAmenities', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    half_bathrooms: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    air_conditioner: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    game_zone: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    laundry_room: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    social_area: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    elevator: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    balcony: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    family_room: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    shared_gas: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    gym: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    service_room: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    jacuzzy: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lobby: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    swimming_pool: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    marble_floor: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    power_plant: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    security: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    walk_in_closet: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    furnished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    security_system: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    hardwood_floor: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    property_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'property_amenities',
    indexes: [
      {
        unique: true,
        fields: ['property_id']
      }
    ]
  });
  // PropertyAmenities.associate = function(models) {
  //   associations can be defined here
  // };
  return PropertyAmenities;
}