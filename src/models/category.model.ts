import mongoose from "mongoose";

export interface ICategory extends mongoose.Document{
    name: string;
}

const CategorySchema = new mongoose.Schema({name:{type:String,required:true}});

export const Category = mongoose.model<ICategory>("Category",CategorySchema);