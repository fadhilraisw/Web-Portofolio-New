require('dotenv').config();
const express=require('express');
const AiCortex=require('../models/AiCortex');
const Project=require('../models/Project'); const Card=require('../models/Card');
const Logistic=require('../models/Logistic'); const Asset=require('../models/Asset');
const Telemetry=require('../models/Telemetry'); const SecurityRule=require('../models/SecurityRule');
const {asyncHandler,fail}=require('../utils/http');
const r=express.Router();

const text=(value)=>typeof value==='string'?value.trim():value&&typeof value==='object'?JSON.stringify(value):'';
const compact=(items)=>items.slice(0,50).map(item=>({id:item._id,title:item.title||item.name||item.itemName||item.key,status:item.status,category:item.category,description:item.desc||item.notes||item.strategy}));
async function portfolioContext(){
  const [projects,cards,logistics,assets,cortex,telemetry,security]=await Promise.all([
    Project.find().lean(),Card.find({isVisible:{$ne:false}}).lean(),Logistic.find().lean(),Asset.find().lean(),AiCortex.find({enabled:true}).lean(),
    Telemetry.find().sort({timestamp:-1}).limit(100).lean(), SecurityRule.find().lean()
  ]);
  return {projects, cards, logistics, assets, cortex, telemetry, security};
}
function deterministic(message,data){
  const terms=message.toLowerCase().split(/\s+/).filter((term)=>term.length>2); const all=[...data.projects,...data.cards,...data.logistics,...data.assets,...data.cortex,...data.telemetry];
  const matches=all.filter(item=>terms.some((term)=>JSON.stringify(item).toLowerCase().includes(term))).slice(0,8);
  const focus=matches.length?matches:all.slice(0,5);
  return {text:focus.length?`Recommendation: focus on ${focus.map(x=>x.title||'this portfolio item').join(', ')}. This is based on the portfolio data and the request “${message}”.`:'Recommendation: collect or publish more portfolio data before making a targeted recommendation.',source:'deterministic',matches:focus};
}
async function providerRecommendation(systemPrompt,message,data){
  const url=process.env.OPENAI_API_URL||process.env.OPENAI_BASE_URL;
  const key=process.env.OPENAI_API_KEY;
  if(!url||!key)return deterministic(message,data);
  const requestBody={model:process.env.OPENAI_MODEL||'gpt-4o-mini',temperature:0.2,messages:[{role:'system',content:systemPrompt||'Give a concise recommendation using the supplied portfolio context.'},{role:'user',content:`Portfolio context:\n${JSON.stringify(data)}\n\nUser request:\n${message}`}]};
  const response=await fetch(url.replace(/\/$/,'')+'/chat/completions',{method:'POST',headers:{'content-type':'application/json',authorization:`Bearer ${key}`},body:JSON.stringify(requestBody)});
  if(!response.ok)throw new Error(`AI provider returned ${response.status}`);
  const body=await response.json(); const answer=body.choices?.[0]?.message?.content;
  if(!answer)throw new Error('AI provider returned no recommendation');
  return {text:answer,source:'openai-compatible',matches:[]};
}
r.post('/chat',asyncHandler(async(req,res)=>{
  const message=text(req.body.userMessage||req.body.message);
  if(!message||message.length>10000)return fail(res,400,'userMessage is required and must be at most 10000 characters');
  const systemPrompt=text(req.body.systemPrompt||req.body.context);
  const data=await portfolioContext();
  let recommendation;
  try{recommendation=await providerRecommendation(systemPrompt,message,data);}
  catch(error){recommendation={...deterministic(message,data),providerError:error.message};}
  res.json({success:true,data:{recommendation:recommendation.text,source:recommendation.source,matches:recommendation.matches,context:data}});
}));
r.use(require('./crudFactory')(AiCortex,{sort:{updatedAt:-1}}));
module.exports=r;
