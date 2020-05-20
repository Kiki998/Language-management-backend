import mongoose from "mongoose";

import {ICategory} from "./category.model";

export interface ILanguage extends mongoose.Document{
    name: string;
    description: string;
    category: ICategory;
}

const LanguageSchema = new mongoose.Schema({
    name:{type:String,required:true},
    description: {type:String, required:true},
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }
});

export const Language = mongoose.model<ILanguage>("Language",LanguageSchema);