import vine from '@vinejs/vine'

export const cats = vine.compile(
    vine.object({
      category: vine.string().trim().minLength(4).unique(async (db, value) => {
        const cat = await db
          .from('categories')
          .where('category', value)
          .first()
        return !cat
      }),
    })
    
)

export const updatedcats = vine.compile(
  vine.object({
    category: vine.string().trim().minLength(4).unique(async (db, value,field) => {
      const cat = await db
        .from('categories')
        .whereNot('id', field.data.params.id)
        .where('category', value)
        .first()
      return !cat
    }),
  })
  
)