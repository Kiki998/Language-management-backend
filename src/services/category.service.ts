import {Request,Response} from "express";

import {Category, ICategory} from "../models/category.model";
import {Language, ILanguage} from "../models/language.model";
import {LanguageService} from "../services/language.service";

import { MongooseDocument, isValidObjectId } from "mongoose";


class CategoryHelpers{

    GetCategory(filter: any):Promise<ICategory>{        
        return new Promise<ICategory>( (resolve) => {
            Category.find(filter,(err:Error,category:ICategory)=>{
                if(err){
                    console.log(err);
                }else{
                    resolve(category);
                }
            }); 
        });
    }

}


export class CategoryService extends CategoryHelpers{

    public getAll(req:Request, res:Response){
        Category.find({},(err:Error, categories: MongooseDocument)=>{
            if(err){
                res.status(401).send(err);
            }else{
                res.status(200).json(categories);
            }
            
        });
    }

    public getAllWLanguage(req:Request, res:Response){

        Category.aggregate([{
            "$lookup":{
                from: "languages",
                localField:"_id",
                foreignField:"category",
                as: "l"
            }
        }],(err:Error,data:any)=>{
            if(err){
                res.status(401).send(err);
            }else{
                res.status(200).json(data);
            }
        })

    }

    public async NewOne(req: Request, res: Response){        
        const c = new Category(req.body);
        const old_cat:any = await super.GetCategory({name:c.name});

        if( old_cat.length === 0 ){
            await c.save((err:Error, category: ICategory)=>{
                if(err){
                    res.status(401).send(err);
                }else{
                    res.status(200).json( category? {successed:true, category: category } : {successed:false} );
                }            
            });
        }else{
            res.status(200).json({successed:false});
        }        

    }

    public async deleteOne(req: Request, res: Response){
        const language_service: LanguageService = new LanguageService();
        const languages:any = await language_service.GetLanguage({category: req.params.id});

        if( languages.length > 0 ){
            res.status(200).json({successed:false});
        }else{

            Category.findByIdAndDelete(req.params.id,(err:Error)=>{
                if(err){
                    res.status(401).send({successed:false});
                }else{
                    res.status(200).json({successed:true});
                }
            });

        }

    }

    public GetLanguagesCategory(req: Request,res: Response){
        if (!req.params.id){
            res.status(401).send({data: "error"});
        }
        let ObjectId = require('mongoose').Types.ObjectId;
        Language.aggregate([
            { "$match": {"category": ObjectId(req.params.id)} },
            {
                "$lookup":{
                    from: "categories",
                    localField:"category",
                    foreignField:"_id",
                    as: "category"
                }
            }
        ], (err: Error, data:any)=>{
            if(err){
                res.status(401).send(err);
            }else{
                res.status(200).json(data);
            }    
        })

    }
    
}
