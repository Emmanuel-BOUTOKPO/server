import User from '#models/user'
import { signinValidator, signupValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
    signup = async ({request, response} : HttpContext) =>{
        const {firstname,lastname,email, password} = await request.validateUsing(signupValidator)
        await User.create({firstname,lastname,email,password})
        response.status(201).json({messages : 'Signup successfuly !'})
    }

    login = async ({request, response} : HttpContext) =>{
        const {email, password} = await request.validateUsing(signinValidator)
        const users = await User.verifyCredentials(email, password);
         
        response.json({users})
    }

}