const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  visitorName:{type:String,default:'GUEST',trim:true},
  visitorEmail:{type:String,lowercase:true,trim:true},
  name:{type:String,trim:true}, age:{type:Number,min:0,max:150}, position:{type:String,trim:true},
  company:{type:String,trim:true}, goal:{type:String,trim:true},
  email:{type:String,lowercase:true,trim:true},
  identity:{type:mongoose.Schema.Types.Mixed,default:{}},
  action:{type:String,required:true,trim:true,minlength:1,maxlength:120},
  details:{type:mongoose.Schema.Types.Mixed,required:true},
  metadata:{type:mongoose.Schema.Types.Mixed,default:{}},
  sessionId:{type:String,trim:true,index:true}, visitorId:{type:String,trim:true,index:true},
  ipAddress:{type:String,trim:true}, userAgent:{type:String,trim:true},
  timestamp:{type:Date,default:Date.now}
},{timestamps:true});
schema.index({timestamp:-1}); schema.index({email:1,timestamp:-1}); schema.index({action:1,timestamp:-1});
module.exports=mongoose.model('Telemetry',schema);
