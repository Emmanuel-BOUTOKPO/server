import Category from '#models/category';
import { cats, updatedcats } from '#validators/cat'
import stringHelpers from '@adonisjs/core/helpers/string';
import type { HttpContext } from '@adonisjs/core/http'
 
export default class CategoriesController {
    postsCreated = async ({request, response} : HttpContext) =>{
        const {category} = await request.validateUsing(cats);
        await Category.create({category})
        response.status(201).json({messages : 'category created successfuly !'})
    }

    getAll = async ({response} : HttpContext) =>{
        const category = await Category.all();
        response.status(200).json(category)
    }

    getOnly = async ({params, response} : HttpContext) =>{
        const {id} = params;
        const category = await Category.find(id);
        response.status(200).json(category)
    }

    updated = async ({params, request, response} : HttpContext) =>{
        const {id} = params;
        const {category} = await request.validateUsing(updatedcats);
        const cat = await Category.findByOrFail('id', id);
        const categori = cat.category !== category && stringHelpers.slug(category)
        if(categori) cat.merge({category}).save();
        
        response.status(201).json({messages : 'category updated sucesfully'})
    }

    deleted = async ({params, response} : HttpContext) =>{
        const {id} = params;
        const cat = await Category.findByOrFail('id', id);
        await cat.delete()
        response.status(201).json({message : 'category deleted sucesfully'})

    }
}