import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title', 95).notNullable()
      table.date('eventdate').defaultTo(this.now())
      table.string('imgprod', 255).notNullable() 
      table.text('description', 'mediumtext ').notNullable() 
      table.json('prodimgs').notNullable()
      table.string('place', 100).notNullable()
      table.integer('category_id').unsigned().references('categories.id').onDelete('CASCADE')    
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE') 
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}