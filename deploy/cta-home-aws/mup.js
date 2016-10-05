module.exports = {
  servers: {
    one: {
      host: '54.186.120.26',
      username: 'ubuntu',
      // pem:
      // password:
      // or leave blank for authenticate from ssh-agent
      pem: '/Users/udit/.ssh/home.pem',
    }
  },

  meteor: {
    name: 'home-cta',
    path: '../../',
    docker: {
      image: 'abernix/meteord:base',
    },
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      PORT: '3000',
      ROOT_URL: 'https://home.ctagroup.org',
      MONGO_URL: 'mongodb://localhost/meteor'
    },

    //dockerImage: 'kadirahq/meteord'
    deployCheckWaitTime: 60
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};
