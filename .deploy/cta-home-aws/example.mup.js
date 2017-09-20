module.exports = {
  servers: {
    one: {
      host: '127.0.0.1',
      username: 'user',
      // pem:
      // password:
      // or leave blank for authenticate from ssh-agent
      pem: '/full/path/to/key.pem',
    },
  },

  meteor: {
    name: 'home-cta',
    path: '../../',
    docker: {
      image: 'abernix/meteord:base',
    },
    servers: {
      one: {},
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      PORT: '3000',
      ROOT_URL: 'https://home.ctagroup.org',
      MONGO_URL: 'mongodb://localhost/meteor',
    },

    // dockerImage: 'kadirahq/meteord'
    deployCheckWaitTime: 60,
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};
