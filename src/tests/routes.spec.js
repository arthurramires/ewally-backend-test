const request = require('supertest');
const app = require('../server');

describe('Get info barcode', () => {
    it('should retrive the info from barcode', async () => {
        const expectedObject = {
            amount: '149.00',
            expirationDate: '2022-02-15',
            line: '00190000090340609800815223411172788970000014900',
            barCode: '00197889700000149000000003406098001522341117'
        };

        await request(app)
            .get('/api/00190.00009 03406.09800815223.411172 7 88970000014900')
            .then(res => {
                expect(res.statusCode).toEqual(200);
                expect(res.body).toEqual(expectedObject);
            });
    });
});
