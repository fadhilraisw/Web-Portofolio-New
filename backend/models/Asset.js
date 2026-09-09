const mongoose=require('mongoose');
const schema=new mongoose.Schema({key:{type:String,default:'primary',unique:true},name:{type:String,required:true,trim:true},title:{type:String,required:true,trim:true},email:{type:String,required:true,lowercase:true,trim:true},cvFileUrl:String,cvFileName:String},{timestamps:true}); module.exports=mongoose.model('Asset',schema);
