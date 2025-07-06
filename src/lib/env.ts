import { z } from "zod/v4"

// Define the schema for environment variables
const envSchema = z.object({
  // Node environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Google OAuth credentials
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  // Server configuration
  PORT: z.coerce.number().positive().default(3000),
})

// Type inference from the schema
export type Env = z.infer<typeof envSchema>

// Validate and parse environment variables
function validateEnv(): Env {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    console.error("❌ Invalid environment variables:")

    // Create a detailed error message
    const errorMessages = z.prettifyError(result.error)

    throw new Error(
      `Environment validation failed:\n${errorMessages}\n\nPlease check your .env file and ensure all required variables are set.`
    )
  }

  return result.data
}

// Export the validated environment variables
export const env = validateEnv()
