import vine from '@vinejs/vine'
export const commentVal = vine.compile(
    vine.object({
        postId: vine.number(),
        userId: vine.number(),
        comment: vine.string().trim().escape(),
    })
    
)