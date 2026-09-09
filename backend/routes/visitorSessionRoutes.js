const express=require('express');
const VisitorSession=require('../models/VisitorSession');
const {asyncHandler,fail,isValidId}=require('../utils/http');
const r=express.Router();
const identityFields=['name','age','position','company','goal','email'];
const identityFrom=(body)=>{const source=body.identity||body; const value={}; identityFields.forEach(k=>{if(source[k]!==undefined)value[k]=source[k];}); return value;};
const sessionId=(body)=>typeof body.sessionId==='string'&&body.sessionId.trim() ? body.sessionId.trim() : null;
r.post('/',asyncHandler(async(req,res)=>{
  const body=req.body||{}; const id=sessionId(body); if(!id||id.length>200)return fail(res,400,'sessionId is required and must be at most 200 characters');
  const now=new Date(); const data={sessionId:id,visitorId:body.visitorId,identity:identityFrom(body),start:body.start||now,lastSeen:now,ipAddress:req.ip,userAgent:req.get('user-agent')};
  const created=await VisitorSession.create(data); res.status(201).json({success:true,data:created});
}));
r.patch('/:id/heartbeat',asyncHandler(async(req,res)=>{
  const filter=isValidId(req.params.id)?{_id:req.params.id}:{sessionId:req.params.id};
  const body=req.body||{}; const update={lastSeen:new Date()}; if(body.identity||identityFields.some(field=>body[field]!==undefined))update.$set={identity:identityFrom(body)};
  const updated=await VisitorSession.findOneAndUpdate(filter,update,{new:true,runValidators:true});
  if(!updated)return fail(res,404,'Session not found'); res.json({success:true,data:updated});
}));
r.post('/:id/end',asyncHandler(async(req,res)=>{
  const filter=isValidId(req.params.id)?{_id:req.params.id}:{sessionId:req.params.id}; const endedAt=new Date();
  const current=await VisitorSession.findOne(filter); if(!current)return fail(res,404,'Session not found');
  const durationSeconds=Math.max(0,Math.round((endedAt-current.start)/1000));
  current.endedAt=endedAt; current.lastSeen=endedAt; current.durationSeconds=durationSeconds; await current.save();
  res.json({success:true,data:current});
}));
r.get('/',asyncHandler(async(req,res)=>{const limit=Math.min(Math.max(Number(req.query.limit)||100,1),500); const filter={}; if(req.query.session)filter.sessionId=req.query.session; if(req.query.visitor)filter.visitorId=req.query.visitor; if(req.query.email)filter['identity.email']=req.query.email.toLowerCase(); res.json({success:true,data:await VisitorSession.find(filter).sort({start:-1}).limit(limit)});}));
r.get('/:id',asyncHandler(async(req,res)=>{const filter=isValidId(req.params.id)?{_id:req.params.id}:{sessionId:req.params.id}; const data=await VisitorSession.findOne(filter); if(!data)return fail(res,404,'Session not found'); res.json({success:true,data});}));
module.exports=r;
