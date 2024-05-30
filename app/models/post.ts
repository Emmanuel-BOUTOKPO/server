import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Comment from './comment.js'
import User from './user.js'
import Category from './category.js'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  
  @column()
  declare title: string

  @column()
  declare eventdate: Date

  @column()
  declare imgprod: string  

  @column()
  declare description: string  

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
    //consume: (value: string) => JSON.parse(value),
  })

  declare prodimgs: string[]
 

  @column()
  declare place: string

  @column()
  public categoryId?: number
  
  @belongsTo(() => Category)
  declare categories: BelongsTo<typeof Category>

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare users: BelongsTo<typeof User>
 
  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}