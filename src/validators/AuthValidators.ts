import { z } from 'zod'

export const loginUserDto = z
  .strictObject({
    email: z
      .string({
        error: (issue) => issue.input === undefined ? " es obligatorio" : "no es un string"
      })
      .min(1, { message: 'no puede estar vacío' }),
    password: z
      .string({
        error: (issue) => issue.input === undefined ? "password es obligatorio" : "no es un string"
      })
      .min(8, { message: 'el password debe tener al menos 8 caracteres' })
  })

export const registerUserDto = z.object({
  user: z.object({
    idUser: z.number(),
    name: z.string(),
    email: z.string(),
  }),
  modules: z.array(z.number())
});

export const userDto = z.strictObject({
  idUser: z.number({ message: 'es obligatorio' }),
  name: z.string().min(1, { message: 'es obligatorio' }),
  email: z.email({ message: 'es obligatorio' }),
})

export type LoginUserDto = z.infer<typeof loginUserDto>
export type UserResponseDto = z.infer<typeof registerUserDto>
export type UserDto = z.infer<typeof userDto>
