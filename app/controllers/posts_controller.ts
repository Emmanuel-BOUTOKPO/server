import Category from '#models/category'
import Post from '#models/post'
import { postValidator } from '#validators/post'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { normalize, sep } from 'path'

export default class PostsController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    try {
      const categories = await Category.query().distinct('category')

      if (categories.length === 0) {
        return response.status(404).json({ message: 'Category not found!' })
      }

      const postByCategory: { [key: string]: Post[] } = {}
      const categoryNames = categories.map(category => category.category)

      const fetchBooksForCategory = async (categoryName: string) => {
        const category = await Category
          .query()
          .where('category', categoryName)
          .preload('posts', (postsQuery) => {
            postsQuery.limit(4)
          })
          .first()

        if (category && category.posts) {
          postByCategory[categoryName] = category.posts
        }
      }

      await Promise.all(categoryNames.map(fetchBooksForCategory))

      return response.json(postByCategory)
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories et des livres:', error)
      return response.status(500).send(error)
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const postId = params.id

      const post = await Post.query()
        .where('id', postId)
        .preload('comments')
        .preload('categories')
        .preload('users')
        .firstOrFail()

      return response.status(200).json(post)
    } catch (error) {

      console.error('Erreur lors de la récupération du post :', error)
      return response.status(404).json({ message: 'Post non trouvé' })
    }
  }

  async showByCat({ params, response }: HttpContext) {
    const { categorie } = params
    const decodedCategory = decodeURIComponent(categorie)
    try {
    
      const category = await Category.query().where('category', decodedCategory).first()
      
      if (!category) {
        return response.status(404).json({ message: 'Category not found!' })
      }

      
      const query = Post.query()
        .where('category_id', category.id)
    
      const results = await query

      return response.json(results)
    } catch (err) {
      console.error(`Erreur lors de la récupération des posts pour la catégorie ${categorie}:`, err)
      return response.status(500).json({ error: 'Une erreur s\'est produite' })
    }
  }
  
  /**
   * Display form to create a new record
   */
  async create({request, response}: HttpContext) {
    const {
      title,
      eventdate,
      description,
      place,
      categoryId,
      userId,
      imgprod,
      prodimgs
    } = await request.validateUsing(postValidator);
    
    await imgprod.move(app.makePath('uploads'), {
      name: `${cuid()}.${imgprod.extname}`,
    })
    const processEnv = process.env.API
    const imgprodPath = `${processEnv}uploads/${imgprod?.fileName}`;

    const prodimgsPaths: string[] = []
    for (let file of prodimgs) {
      await file.move(app.makePath('uploads'), {
        name: `${cuid()}.${file.extname}`,
      })
      const prodimgPath = `${processEnv}uploads/${file?.fileName}`
      prodimgsPaths.push(prodimgPath)
    }

      await Post.create({
      title: title,
      eventdate: eventdate,
      description: description,
      place: place,
      categoryId: categoryId,
      userId: userId,
      imgprod: imgprodPath,
      prodimgs: prodimgsPaths,
    })

    return response.status(201).json({message: "Post created succefuly"})
  }

  async update({ params, request, response }: HttpContext) {
  try {
    const postId = params.id
    const data = request.only(['title', 'eventdate', 'description', 'place', 'categoryId', 'userId'])
    const post = await Post.findOrFail(postId)

    post.title = data.title
    post.eventdate = data.eventdate
    post.description = data.description
    post.place = data.place
    post.categoryId = data.categoryId
    post.userId = data.userId

    const imgprod = request.file('imgprod')
    const prodimgs = request.files('prodimgs')
     const processEnv = process.env.API

    if (imgprod) {
      await imgprod.move(app.makePath('uploads'), {
        name: `${cuid()}.${imgprod.extname}`
      })
      if (imgprod.filePath) {
        post.imgprod = `${processEnv}uploads/${imgprod?.fileName}`;
      }
    }

    if (prodimgs && prodimgs.length > 0) {
      const prodimgPaths: string[] = []
      for (const prodimg of prodimgs) {
        await prodimg.move(app.makePath('uploads'), {
          name: `${cuid()}.${prodimg.extname}`,
        })
        if (prodimg.filePath) {
          const prodimgPath = `${processEnv}uploads/${prodimg?.fileName}`
          prodimgPaths.push(prodimgPath)
        }
      }
      post.prodimgs = prodimgPaths
    }
    await post.save()

    return response.status(200).json(post)
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

  async destroy({ params, response }: HttpContext) {
  try {
    const postId = params.id
    const post = await Post.findOrFail(postId)
    await post.delete()
    return response.status(200).json({ message: 'Post supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression du post :', error)
    return response.status(500).json({ message: 'Erreur lors de la suppression du post' })
  }
  }

}


  