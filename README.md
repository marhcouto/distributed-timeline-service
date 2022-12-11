# SDLE Second Assignment

SDLE Second Assignment of group T06G14

Group members:

1. Marcelo Couto up201906086@up.pt
2. Francisco Oliveira up201907361@up.pt
3. Miguel Amorim up201907756@up.pt
4. André Santos up201907879@up.pt

# How to run our application

Both our frontend and our backend were developed in Javascript. To run Javascript in a computer node must be installed. We used the latest lts version of node a the date of writting 18.12.1.

## Run the frontend

To run our frontend directly run the following steps need to be taken:

Installation of dependencies:
```
 npm install --force
```

To run the frontend:
```
  npm start
```

However this commands are mostly useless because our frontend is prepared to run as static files served by our backend and running it directly will result in host not found errors.

## Run the backend

Firstly the needed dependencies must be installed:

```
npm install
```

## Pre-configured nodes

We have prepared three backend nodes that are called respectively: initial, second and third they can be ran with the following commands:

```
npm run start:initial
```

```
npm run start:second
```

```
npm run start:third
```

Keep in mind that the nodes called initial and second use node third as bootstrap so the latter must be started first.

## User configured nodes

The user can configure it's own node by providing a JSON configuration files as command line arguments.
To use that configuration file the user must launch our backend using the following command:

```
node main.mjs --config-file [path to config file]
```

More options can be found by calling our backed with the following argument:
```
node main.mjs -h
```

### Configuration file syntax

The configuration JSON has the following parameters:

 - **userName**: string representing the user's name in the system
 - **peerFinderPort**: port used to make kademlia communications
 - **timelineServerPort**: port used in internode communication
 - **bootstrapNodes**: a list of IP addresses of bootstrap nodes
