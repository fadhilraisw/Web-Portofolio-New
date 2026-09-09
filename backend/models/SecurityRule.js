const mongoose=require('mongoose');
const schema=new mongoose.Schema({ipAddress:{type:String,required:true,trim:true},status:{type:String,enum:['BANNED','WHITELISTED','MONITOR'],default:'BANNED'},reason:{type:String,required:true,trim:true}},{timestamps:true});
schema.index({ipAddress:1},{unique:true}); module.exports=mongoose.model('SecurityRule',schema);
