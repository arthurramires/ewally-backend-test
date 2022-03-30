import { config as envConfig } from 'dotenv';
envConfig();
import { createServer } from 'http';
import { createApp } from './create-app';

const port = 8080;
const app = createApp();
const server = createServer(app);
server.listen(port, () => console.log('Listening on port ' + port));

process.on('SIGINT', () => {
    console.log('SIGINT received ...');
    console.log('Shutting down the server');

    server.close(() => {
        console.log('Server has been shutdown');
        console.log('Exiting process ...');
        process.exit(0);
    });
});
