const Card=require('../models/Card'); module.exports=require('./crudFactory')(Card,{sort:{order:1,createdAt:1}});
