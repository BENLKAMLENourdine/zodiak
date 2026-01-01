import app from './src/main';
import request from 'supertest';
import { describe, it, expect } from 'vitest';

describe('User API Endpoints', () => {
    it('should fetch all users', async () => {
        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(1);
    });

    it('should create a new user', async () => {
        const newUser = { name: 'John Doe', email: 'john@example.com' };
        const response = await request(app).post('/users').send(newUser);
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            id: 2,
            name: 'John Doe',
            email: 'john@example.com',
            createdAt: expect.any(String)
        });
    });

    it('should update an existing user', async () => {
        const updateData = { name: 'Jane Doe' };
        const response = await request(app).put('/users/1').send(updateData);
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            id: 1,
            name: 'Jane Doe',
            email: 'john@example.com',
            createdAt: expect.any(String)
        });
    });

    it('should delete a user', async () => {
        const response = await request(app).delete('/users/1');
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body).toEqual({
            success: true
        });
    });
});