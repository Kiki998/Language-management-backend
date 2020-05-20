import {Request,Response} from "express";

import {Language, ILanguage} from "../models/language.model";
import {CategoryService} from "./category.service";

import { MongooseDocument } from "mongoose";


class LanguageHelpers{

    GetLanguage(filter: any):Promise<ILanguage>{        
        return new Promise<ILanguage>( (resolve) => {
            Language.find(filter,(err:Error,Language:ILanguage)=>{
                if(err){
                    console.log(err);
                }else{
                    resolve(Language);
                }
            }); 
        });
    }
}


export class LanguageService extends LanguageHelpers{
    
    public getAll(req:Request, res:Response){
        Language.aggregate([
            {
                "$lookup":{
                    from: "categories",
                    localField:"category",
                    foreignField:"_id",
                    as: "category"
                }
            }
        ],(err:Error, data:any)=>{
            if(err){
                res.status(401).send(err);
            }else{
                res.status(200).json(data);
            } 
          })
    }

    public async NewOne(req: Request, res: Response){        
        const l = new Language(req.body);
        const old_lan:any = await super.GetLanguage({name:l.name});

        console.log(l);
        console.log(req.body);

        if( old_lan.length === 0 ){
            await l.save((err:Error, Language: ILanguage)=>{
                if(err){
                    res.status(401).send(err);
                }else{
                    res.status(200).json( Language? {successed:true, Language: Language } : {successed:false} );
                }            
            });
        }else{
            res.status(200).json({successed:false});
        } 
    }

    public async deleteOne(req:Request, res:Response){
        Language.findByIdAndDelete(req.params.id,(err:Error)=>{
            if(err){
                res.status(401).json({successed:false, message:"server got an error, contact support if this error is still happening"});
            }else{
                res.status(200).json({successed:true,message:"Language deleted successfully"});
            }
        });
    }

    public async getOne(req:Request, res:Response){
        const lan:any = await super.GetLanguage({_id:req.params.id});
        res.status(200).json(lan[0]);
    }

    public async updateOne(req:Request, res:Response){       
        const old_lan:any = await super.GetLanguage({
            name:req.body.name,
            _id: { $nin: [req.params.id] }
        });

        if( old_lan.length === 0 ){

            Language.findByIdAndUpdate(req.params.id,req.body,(err:Error)=>{
                if(err){
                    res.status(401).json({successed:false, message:"server got an error, contact support if this error is still happening"});
                }else{
                    res.status(200).json({successed:true,message:"Language updated successfully"});
                }
            });

        }else{
            res.status(200).json({successed:false});
        } 
    }

}
