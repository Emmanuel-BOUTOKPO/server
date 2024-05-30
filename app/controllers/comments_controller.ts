import Comment from '#models/comment';
import { commentVal } from '#validators/comment';
import stringHelpers from '@adonisjs/core/helpers/string';
import type { HttpContext } from '@adonisjs/core/http'

export default class CommentsController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    try {
      const comments = await Comment.query()
        .preload('posts', (postQuery) => {
          postQuery.preload('users')
        })

      response.status(200).json(comments)
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires, des posts et des utilisateurs:', error)
      return response.status(500).json({ error: 'Une erreur s\'est produite' })
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response}: HttpContext) {
    const {postId,userId,comment} = await request.validateUsing(commentVal);
    await Comment.create({postId,userId,comment})
    response.status(201).json({messages : 'Comment created successfuly !'})

  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const { id } = params

    try {
      const comment = await Comment.query()
        .where('id', id)
        .preload('posts', (postQuery) => {
          postQuery.preload('users')
        })
        .first()

      if (!comment) {
        return response.status(404).json({ message: 'Comment not found!' })
      }

      response.status(200).json(comment)
    } catch (error) {
      console.error('Erreur lors de la récupération du commentaire:', error)
      return response.status(500).json({ error: 'Une erreur s\'est produite' })
    }
  }


  /**
   * Handle form submission for the edit action
   */
  async update({ params, request , response}: HttpContext) {
    const {id} = params;
    const {comment} = await request.validateUsing(commentVal);
    const comments = await Comment.findByOrFail('id', id);
    const categori = comments.comment !== comment && stringHelpers.slug(comment)
    if(categori) comments.merge({comment}).save();
    
    response.status(201).json({messages : 'Comment updated sucesfully'})

  }

  /**
   * Delete record
   */
  async destroy({ params , response}: HttpContext) {
        const {id} = params;
        const comment = await Comment.findByOrFail('id', id);
        await comment.delete()
        response.status(201).json({message : 'Comment deleted sucesfully'})

  }
}