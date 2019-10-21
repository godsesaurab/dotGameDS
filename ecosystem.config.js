module.exports = {
  apps : [{
    name: 'Server-0',
    script: 'server0.js',

    instances: 1,
    autorestart: true,
    watch: false,
    exec_mode:"fork",
    max_memory_restart: '500M',
    
  },
  {
    name: 'Server-1',
    script: 'server1.js',

    instances: 1,
    autorestart: true,
    watch: false,
    exec_mode:"fork",
    max_memory_restart: '500M',
    
  },
  {
    name: 'Server-2',
    script: 'server2.js',

    instances: 1,
    autorestart: true,
    watch: false,
    exec_mode:"fork",
    max_memory_restart: '500M',
    
  },
  {
    name: 'Server-3',
    script: 'server3.js',
    
    instances: 1,
    autorestart: true,
    watch: false,
    exec_mode:"fork",
    max_memory_restart: '500M',
    
  }


  ]

  
};
