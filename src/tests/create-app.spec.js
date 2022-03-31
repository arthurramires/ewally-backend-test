const app = require('../create-app');

describe('Start de development server', () => {
    it('should create de application', async () => {
        const spyOn = jest
            .spyOn(app, 'createApp')
            .mockImplementation(app.createApp());

        expect(spyOn).toHaveBeenCalled();

        spyOn.mockRestore();
    });
});
