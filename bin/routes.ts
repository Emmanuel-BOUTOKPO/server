/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
import CategoriesController from '#controllers/categories_controller'
import CommentsController from '#controllers/comments_controller'
import PostsController from '#controllers/posts_controller'
import router from '@adonisjs/core/services/router'

router.post('/register', [AuthController, 'signup'] )
router.post('/login', [AuthController, 'login'] )

/*Categorie routes*/
router.post('/cat/post', [CategoriesController, 'postsCreated'] )
router.get('/cat/getAll', [CategoriesController, 'getAll'] )
router.get('/cat/getOn/:id', [CategoriesController, 'getOnly'] )
router.put('/cat/update/:id', [CategoriesController, 'updated'] )
router.delete('/cat/delete/:id', [CategoriesController, 'deleted'] )

/*Comment routes*/
router.post('/comment/post', [CommentsController, 'store'] )
router.get('/comment/getAll', [CommentsController, 'index'] )
router.get('/comment/getOn/:id', [CommentsController, 'show'] )
router.put('/comment/update/:id', [CommentsController, 'update'] )
router.delete('/comment/delete/:id', [CommentsController, 'destroy'] )


/*Post routes*/
router.post('/post/post', [PostsController, 'create'] )
router.get('/post/getAll', [PostsController, 'index'] )
router.get('/post/getOn/:id', [PostsController, 'show'] )
router.get('/post/get/:categorie', [PostsController, 'showByCat'] )
router.put('/post/update/:id', [PostsController, 'update'] )
router.delete('/post/delete/:id', [PostsController, 'destroy'] )

