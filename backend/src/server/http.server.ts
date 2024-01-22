import http from 'http';
import App from './app';

const server = http.createServer(App);

export default server;
