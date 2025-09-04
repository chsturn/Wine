const request = require('supertest');
const app = require('./index');
const fs = require('fs');
const path = require('path');

describe('GET /api/wines', () => {
  it('should return 200 OK and a list of wines', async () => {
    const response = await request(app).get('/api/wines');
    const winesFilePath = path.join(__dirname, 'wines.json');
    const expectedWines = JSON.parse(fs.readFileSync(winesFilePath, 'utf8'));

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toEqual(expectedWines);
    expect(response.body.length).toBe(3);
  });
});
