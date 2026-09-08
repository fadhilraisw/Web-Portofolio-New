const mongoose=require('mongoose');
const schema=new mongoose.Schema({
  name:{type:String,required:true,trim:true,minlength:1,maxlength:120},
  strategy:{type:String,required:true,trim:true,minlength:1,maxlength:120},
  prompt:{type:String,required:true,trim:true,minlength:1,maxlength:10000},
  enabled:{type:Boolean,default:true},
  metadata:{type:mongoose.Schema.Types.Mixed,default:{}}
},{timestamps:true});
module.exports=mongoose.model('AiCortex',schema);
