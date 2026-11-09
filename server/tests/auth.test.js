const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const sequelize = require('../config/database');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

beforeAll(async () => {
  // Sync database tables for testing
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close database connection after tests finish
  await sequelize.close();
});

describe('Auth Endpoints & Business Logic', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'SecurePassword123!',
        bio: 'Cybersecurity student and developer',
        location: 'Indiana'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toEqual('testuser@example.com');
  });

  it('should fail login with incorrect credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'WrongPassword'
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message');
  });
});
