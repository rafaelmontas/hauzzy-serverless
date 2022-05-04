'use strict';

const app = require('../../app.js');
const chai = require('chai');
const expect = chai.expect;
const lambdaTester = require("lambda-tester");
// let event, context;

const mockDataNull = {
  queryStringParameters: null
}
const mockData = {
  queryStringParameters: {
    province: 'Distrito Nacional',
    sector: 'Ensanche Naco',
    listing_type: 'sale',
    minPrice: 0,
    maxPrice: 2000000,
    bedrooms: 0,
    bathrooms: 0,
    property_type: 'apartment,house,villa,penthouse'
  }
}


describe('Tests index', function () {
  this.timeout(30000)
  it('verifies successful response when queryStringParameters are not provided', async () => {
    const result = await app.lambdaHandler(mockDataNull, context)

    expect(result).to.be.an('object');
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an('string');

    let response = JSON.parse(result.body);

    expect(response).to.be.an('object');
    expect(response.properties).to.be.an('array');
    expect(response.count).to.be.an('number');
    // expect(response.location).to.be.an("string");
  });
  it('verifies successful response when queryStringParameters are provided', async () => {
    const result = await app.lambdaHandler(mockData, context)

    expect(result).to.be.an('object');
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an('string');

    let response = JSON.parse(result.body);

    expect(response).to.be.an('object');
    expect(response.properties).to.be.an('array');
    expect(response.count).to.be.an('number');
  });
});
