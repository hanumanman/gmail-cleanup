import { z } from "zod"

const devServer = "http://localhost:3000"
const envSchema = z.object({
  // Node environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  BASE_URL: z.string().default(devServer),

  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().default(devServer),

  GOOGLE_API_KEY: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),

  TURSO_CONNECTION_URL: z.string().min(1),
  TURSO_AUTH_TOKEN: z.string().min(1),
})

export type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    console.error("❌ Invalid environment variables:")

    const errorMessages = z.prettifyError(result.error)

    throw new Error(
      `Environment validation failed:\n${errorMessages}\n\nPlease check your .env file and ensure all required variables are set.`
    )
  }

  return result.data
}

export const env = validateEnv()
