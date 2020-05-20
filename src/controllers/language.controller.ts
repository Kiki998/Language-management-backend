import {Application} from "express";
import {LanguageService} from "../services/language.service";

export class LanguageController{
    private Language_service: LanguageService;
    constructor(private app: Application){
        this.Language_service = new LanguageService();
        this.routes();
    }
    private routes(){
            
        this.app.route("/languages").get(this.Language_service.getAll);

        this.app.route("/language").post(this.Language_service.NewOne);

        this.app.route("/language/:id")
        .delete(this.Language_service.deleteOne)
        .get(this.Language_service.getOne)
        .put(this.Language_service.updateOne);
        
    }
}