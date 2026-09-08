const mongoose=require('mongoose');
const schema=new mongoose.Schema({name:{type:String,required:true,trim:true},strategy:{type:String,required:true,trim:true},prompt:{type:String,required:true,trim:true},enabled:{type:Boolean,default:true},metadata:mongoose.Schema.Types.Mixed},{timestamps:true}); module.exports=mongoose.model('AiCortex',schema);
