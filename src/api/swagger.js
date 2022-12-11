const swaggerAutogen = require('swagger-autogen')()

const outputFileClient = './swagger_output_client.json'
const endpointsFilesClient = ['./timeline/timeline-client-controller.mjs']
const outputFileServer = './swagger_output_server.json'
const endpointsFilesServer = ['./timeline/timeline-propagator-controller.mjs']

swaggerAutogen(outputFileClient, endpointsFilesClient);
swaggerAutogen(outputFileServer, endpointsFilesServer);