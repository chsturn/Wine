const request = require('supertest');
const app = require('./index');
const Wine = require('./models/Wine');

// Mock the Wine model
jest.mock('./models/Wine');

describe('GET /api/wines', () => {
  it('should return 200 OK and a list of wines from the database', async () => {
    // Define the mock data that the model should return
    const mockWines = [
      { name: 'Mock Wine 1', year: 2020 },
      { name: 'Mock Wine 2', year: 2021 },
    ];

    // Mock the implementation of the chained Mongoose query
    Wine.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockWines)
    });

    // Make the request to the app
    const response = await request(app).get('/api/wines');

    // Assertions
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toEqual(mockWines);
    expect(response.body.length).toBe(2);

    // Verify that the find and sort methods were called
    expect(Wine.find).toHaveBeenCalled();
    expect(Wine.find().sort).toHaveBeenCalledWith({ createdAt: -1 });
  });

  it('should return 500 if there is a server error', async () => {
    // Mock the implementation to throw an error
    Wine.find.mockReturnValue({
      sort: jest.fn().mockRejectedValue(new Error('Database error'))
    });

    const response = await request(app).get('/api/wines');

    expect(response.status).toBe(500);
    expect(response.text).toBe('Server Error');
  });
});
