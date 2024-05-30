import Crew from '#models/crew';
import { crewValidator } from '#validators/crew';
import { cuid } from '@adonisjs/core/helpers';
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app';
import { normalize, sep } from 'path';

export default class CrewsController {
    crewCreated = async ({request, response} : HttpContext) =>{
        const {
            firstname,
            lastname,
            poste,
            picture,
            social,
            link
          } = await request.validateUsing(crewValidator);
          
          await picture.move(app.makePath('uploads'), {
            name: `${cuid()}.${picture.extname}`,
          })
          const processEnv = process.env.API
          const pictPath = `${processEnv}uploads/${picture?.fileName}`;
      
            await Crew.create({
            firstname: firstname,
            lastname: lastname,
            poste: poste,
            picture: pictPath,
            social: social,
            link: link,
          })
      
          return response.status(201).json({message: "Crew created succefuly"})
    }

    getAll = async ({response} : HttpContext) =>{
        const category = await Crew.all();
        response.status(200).json(category)
    }

    getOnly = async ({params, response} : HttpContext) =>{
        const {id} = params;
        const category = await Crew.find(id);
        response.status(200).json(category)
    }

    updated = async ({params, request, response} : HttpContext) =>{
        try {
            const crewId = params.id
            const data = request.only(['firstname', 'lastname', 'poste', 'social', 'link'])
            const crew = await Crew.findOrFail(crewId)
        
            crew.firstname = data.firstname
            crew.lastname = data.lastname
            crew.poste = data.poste
            crew.social = data.social
        
            const picture = request.file('picture')

            const processEnv = process.env.API
        
            if (picture) {
              await picture.move(app.makePath('uploads'), {
                name: `${cuid()}.${picture.extname}`
              })
              if (picture.filePath) {
                crew.picture = `${processEnv}uploads/${picture?.fileName}`;
              }
            }
        
            await crew.save()
        
            return response.status(200).json(crew)
          } catch (error) {
            console.error('Erreur lors de la mise à jour du post :', error)
            return response.status(500).json({ message: 'Erreur lors de la mise à jour du post' })
          }
    }

    async imgeStore({ request, response } : HttpContext) {
        const filePath = request.param('*').join(sep)
        const normalizedPath = normalize(filePath)
        const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/
    
        if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
          return response.badRequest('Malformed path')
        }
      
        const absolutePath = app.makePath('uploads', normalizedPath)
        return response.download(absolutePath)
      }

    deleted = async ({params, response} : HttpContext) =>{
        const {id} = params;
        const cat = await Crew.findByOrFail('id', id);
        await cat.delete()
        response.status(201).json({message : 'category deleted sucesfully'})

    }
}