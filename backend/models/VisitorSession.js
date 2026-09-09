const mongoose=require('mongoose');
const identitySchema=new mongoose.Schema({
  name:{type:String,trim:true}, age:{type:Number,min:0,max:150}, position:{type:String,trim:true},
  company:{type:String,trim:true}, goal:{type:String,trim:true}, email:{type:String,lowercase:true,trim:true}
},{_id:false});
const schema=new mongoose.Schema({
  sessionId:{type:String,required:true,trim:true,unique:true,index:true},
  visitorId:{type:String,trim:true,index:true},
  start:{type:Date,default:Date.now,required:true},
  lastSeen:{type:Date,default:Date.now,required:true},
  endedAt:{type:Date},
  durationSeconds:{type:Number,min:0},
  identity:{type:identitySchema,default:()=>({})},
  ipAddress:{type:String,trim:true}, userAgent:{type:String,trim:true}
},{timestamps:true});
module.exports=mongoose.model('VisitorSession',schema);
