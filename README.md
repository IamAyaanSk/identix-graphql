# GraphQL API Boilerplate

A minimal boilerplate for building a GraphQL API with Apollo Server, Prisma, and TypeScript.

## Getting Started

1. Clone this repository.
2. Install dependencies by running `npm i`.
3. Configure your environment variables, take help of `.env.example`.
4. Run database migrations or Prisma introspection (if needed).
5. Start the Apollo Server for development by running `npm run watch`.
6. Access your GraphQL API at `http://localhost:1337/graphql`, port can be different here as per `.env` file.

## Project Structure

- `src`: Source code for the GraphQL server.
  - `generated`: Contains the generated TS types of the GraphQL Schema you define.
  - `handlers`: Contains example user module with schema and resolvers and the schema setup overall.
    - `{{module}}`: Name of the module
      - `gql-types.ts`: For GraphQL types of this module.
      - `mutations.ts`: For mutation resolvers + mutation types of this module.
      - `queries.ts`: For queries resolvers + queries types of this module.
      - `index.ts`: All above things combined and exported for further use.
- `prisma`: Prisma configuration and migrations.
  - `schema.prisma`: All model definitions and prisma configration.
  - `migrations`: Directory containing prisma migrations.

## License

This project is open-source and available under the MIT License.
