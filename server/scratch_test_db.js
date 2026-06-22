const mongoose = require('mongoose');
const uri = "mongodb://deskontop7_db_user:B1Ym94jl8Kewqe3N@ac-xi4yppz-shard-00-00.3azkqqx.mongodb.net:27017,ac-xi4yppz-shard-00-01.3azkqqx.mongodb.net:27017,ac-xi4yppz-shard-00-02.3azkqqx.mongodb.net:27017/?ssl=true&replicaSet=atlas-13o6i4-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => {
    console.log("SUCCESS!");
    process.exit(0);
  })
  .catch(err => {
    console.log("FAILED!", err);
    process.exit(1);
  });
