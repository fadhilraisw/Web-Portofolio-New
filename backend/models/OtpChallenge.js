const mongoose=require('mongoose');
const schema=new mongoose.Schema({email:{type:String,required:true,lowercase:true,trim:true,index:true},codeHash:{type:String,required:true},attempts:{type:Number,default:0},expiresAt:{type:Date,required:true},verifiedAt:Date},{timestamps:true}); schema.index({expiresAt:1},{expireAfterSeconds:0}); module.exports=mongoose.model('OtpChallenge',schema);
