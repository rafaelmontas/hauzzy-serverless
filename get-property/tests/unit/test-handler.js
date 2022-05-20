'use strict';

const app = require('../../app.js');
const chai = require('chai');
const expect = chai.expect;
let context;


// const eventNull =  {
//   pathParameters: {
//     id: '1b720679-aa36-48cc-b066-0984c1586x00'
//   }
// }
const event = {
  pathParameters: {
    id: '1b720679-aa36-48cc-b066-0984c1586b99'
  }
}

describe('Tests index', function () {
  this.timeout(30000)
  // it('verifies successful response when pathParameters are not valid', async () => {
  //   const result = await app.lambdaHandler(eventNull, context)

  //   expect(result).to.be.an('object');
  //   expect(result.statusCode).to.equal(500);
  // });
  it('verifies successful response when pathParameters are provided', async () => {
    const result = await app.lambdaHandler(event, context)

    expect(result).to.be.an('object');
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an('string');

    let response = JSON.parse(result.body);

    expect(response).to.be.an('object');
    expect(response.listing).to.be.an('object');
  });
});
