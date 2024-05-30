import vine from '@vinejs/vine'

export const crewValidator = vine.compile(
    vine.object({
        firstname: vine.string().trim(),
        lastname: vine.string().trim(),
        poste: vine.string().trim(),
        picture: vine.file({
            size: '2mb',
            extnames: ['jpg', 'png', 'jpeg']
          }),
          social: vine.string().trim(),
          link: vine.string().trim(),
    })
    
)
