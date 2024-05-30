import { DateTime } from 'luxon'
import { BaseModel,belongsTo,column} from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Post from './post.js'


export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare comment: string  

  @column()
  public postId?: number
  
  @belongsTo(() => Post)
  declare posts: BelongsTo<typeof Post>

  @column()
  public userId?: number

  @belongsTo(() => User)
  declare users: BelongsTo<typeof User>
  
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}