import vine from '@vinejs/vine'

export const postValidator = vine.compile(
    vine.object({
        title: vine.string().trim(),
        eventdate: vine.date(),
        description: vine.string().escape(),
        place: vine.string().trim(),
        categoryId: vine.number(),
        userId: vine.number(),
        imgprod: vine.file({
            size: '2mb',
            extnames: ['jpg', 'png', 'jpeg']
          }),
        prodimgs: vine.array(
            vine.file({
              size: '2mb',
              extnames: ['jpg', 'png', 'jpeg']
            })
          ),
    })
    
)
