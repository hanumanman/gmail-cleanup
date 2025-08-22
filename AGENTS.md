# AGENTS.md - Gmail Cleanup Project

## Build/Lint/Test Commands

### Development

- `bun run dev` - Start development server with Turbopack
- `bun run build` - Build for production
- `bun run start` - Start production server

### Code Quality

- `bun run check` - TypeScript type checking + ESLint (oxlint)
- `bun run format` - Format code with Prettier

### Database

- `bun run db:generate` - Generate database migrations
- `bun run db:migrate` - Run database migrations
- `bun run db:studio` - Open Drizzle Studio

### Auth

- `bun run auth:generate` - Generate auth schema from config

## Code Style Guidelines

### TypeScript & Imports

- Use `import type` for type-only imports
- Path aliases: `@/*` maps to `./src/*`
- Strict TypeScript mode enabled
- Explicit return types for functions

### Formatting (Prettier)

- No semicolons
- Double quotes
- 2-space indentation
- 80 character line width
- ES5 trailing commas
- No arrow function parentheses when possible

### Naming Conventions

- Components: PascalCase (e.g., `Button`, `ThemeProvider`)
- Functions/variables: camelCase (e.g., `cn`, `buttonVariants`)
- Types: PascalCase (e.g., `Metadata`, `VariantProps`)
- Database: snake_case columns, camelCase TypeScript

### Component Patterns

- Use `class-variance-authority` for variant components
- Utility function `cn()` for conditional classes
- Radix UI primitives for accessibility
- Tailwind CSS for styling

### Database

- Drizzle ORM with SQLite
- Timestamp fields use `integer` with `mode: "timestamp"`
- Boolean fields use `integer` with `mode: "boolean"`
- Foreign keys with cascade delete where appropriate

### Error Handling

- Leverage TypeScript strict mode for compile-time safety
- Use proper type guards and validation (Zod schemas where needed)
