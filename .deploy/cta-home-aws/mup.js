module.exports = {
  plugins: ['mup-git'],
  servers: {
    one: {
      host: '54.191.131.191',
      username: 'ubuntu',
      pem: '/home/pgorecki/.ssh/home-cta.pem',
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
