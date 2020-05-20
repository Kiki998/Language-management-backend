import {Application} from "express";
import {CategoryService} from "../services/category.service";

export class CategoryController{
    private category_service: CategoryService;
    constructor(private app: Application){
        this.category_service = new CategoryService();
        this.routes();
    }
    private routes(){
        this.app.route("/categories").get(this.category_service.getAll);
        this.app.route("/categories/languages").get(this.category_service.getAllWLanguage);
        this.app.route("/category/:id").delete(this.category_service.deleteOne);
        this.app.route("/category").post(this.category_service.NewOne);
        this.app.route("/categories/:id").get(this.category_service.GetLanguagesCategory);
        
    }
}