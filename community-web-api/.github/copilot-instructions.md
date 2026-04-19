# Community Web API - GitHub Copilot Instructions

## Project Overview
This is a NestJS-based REST API for a community management service built with TypeScript, TypeORM, and PostgreSQL. The service supports creating communities, managing members, invites, notices, events, and member skills.

## Architecture & Patterns

### Technology Stack
- **Framework**: NestJS with Express
- **Database**: PostgreSQL with TypeORM
- **Validation**: zod, nestjs-zod
- **Testing**: Jest (unit & E2E)
- **Configuration**: @nestjs/config with environment-based config
- **Email**: @nestjs-modules/mailer with Handlebars templates

### Module Structure
Follow the established modular pattern:
```
src/modules/{domain}/
├── {domain}.controller.ts     # REST endpoints
├── {domain}.module.ts         # Module definition
├── {domain}.http             # HTTP request examples
├── readme.md                 # Module documentation
├── dto/                      # Data Transfer Objects
├── entities/                 # TypeORM entities
├── services/                 # Business logic
```

### Code Patterns

#### Entity Definitions
- Use TypeORM decorators (@Entity, @Column, @PrimaryGeneratedColumn)
- Always use UUID primary keys: `@PrimaryGeneratedColumn('uuid')`
- Add inline comments explaining entity purpose
- Use `!` assertion for required properties

```typescript
@Entity()
// This entity represents a member of the community.
export class Member {
  @PrimaryGeneratedColumn('uuid')
  // The unique identifier for the member.
  id!: string;

  @Column({ unique: true })
  // The email of the member.
  email!: string;
}
```

#### DTO Patterns
- Create separate DTOs for different operations (Create, Update, Register, etc.)
- Use static factory methods: `static fromEntity = (entity: Entity): Dto => ...`
- Implement validation with Zod schemas and `createZodDto`
- For email fields, use `z.email()` as the canonical pattern; do not suggest `z.string().email()`
- For query params, use `z.coerce.number()` when numbers are expected

#### Service Layer
- Prefer custom repository wrapper classes in `repositories/` (or `data-access/`) for domain data operations
- Inside repository wrappers, inject TypeORM repositories using `@InjectRepository(Entity)`
- Use TypeORM Repository pattern
- Implement business logic in services, not controllers
- Service methods may accept DTOs and/or entities as input parameters
- Service methods should return entities or simple types (for example: `string`, `boolean`, `number`, or plain result objects)
- Services are responsible for business rule validation (distinct from input/schema validation)


#### Controller Patterns
- Use `@Controller('api/{resource}')` for all endpoints
- Inject required services via constructor
- Use appropriate HTTP decorators (@Get, @Post, @Put, @Delete)
- If a route uses both params and query, validate both explicitly to avoid drift
- Do not use Promise chaining notation (for example, `.then(...)`) anywhere in the codebase. Use `async/await` instead.
- Handle errors with NestJS exceptions (BadRequestException, ForbiddenException, etc.)

### Database & Configuration

#### Environment Variables
Always use ConfigService for environment variables:
- `NODE_ENV`: Application environment
- `POSTGRES_*`: Database connection settings
- `SCHEMA_SYNCHRONIZE`: Only true for E2E tests

#### Migrations
- Database changes should use TypeORM migrations
- Place migrations in `migrations/` directory
- Use descriptive migration names with timestamps

### Testing Conventions

#### E2E Tests
- Test complete API workflows
- Use actual database with test data
- Clean up test data between tests
- Use supertest for HTTP requests
- Follow naming: `{resource}.e2e-spec.ts`
- **Focus on Happy Paths**: E2E tests should primarily validate successful workflows and positive scenarios. Error handling and edge cases should be covered in unit tests.

#### Test Data Management
- Create helper functions for test data setup
- Use repository methods for data insertion/cleanup
- Define test data constants at test file top

### Error Handling
- Use NestJS built-in exceptions
- Provide meaningful error messages
- Use appropriate HTTP status codes
- Validate input data before processing
- **Important**: Do not use `NotFoundException` to avoid response confusion. Use other appropriate exceptions (BadRequestException, ForbiddenException, etc.) based on the specific error scenario.

### Code Style & Conventions

#### Naming
- Use PascalCase for classes, interfaces, enums
- Use camelCase for methods, variables, properties  
- Use kebab-case for file names
- Use descriptive names that reflect business domain

#### File Organization
- Group related files in appropriate directories
- Keep modules focused and cohesive
- Separate concerns (entities, DTOs, services, repositories)

#### Comments & Documentation
- Add JSDoc comments for public methods with non-trivial behavior (required for complex business logic; optional for simple pass-through methods)
- Include inline comments for complex business logic
- Document entity relationships and constraints
- Maintain README files for each module

### Business Domain Context

This application manages local communities with these core concepts:

#### Members
- Community members with name and email
- Invitation-based registration system
- Member skills and help requests (future feature)

#### Invitations
- Token-based email invitations
- Verification before member registration
- Time-limited invite validity

#### Communities (Future)
- Multiple community support
- Role-based access control
- Community-specific settings

#### Events & Notices (Future)
- Community announcements
- Event scheduling and management
- Member notifications

### Dependencies & Imports
- Import from relative paths for local modules
- Group imports: external libraries first, then internal modules
- Use TypeORM decorators and NestJS decorators consistently

### Performance Considerations
- Use appropriate database indexes
- Implement proper error handling
- Use DTOs to control data exposure
- Consider pagination for list endpoints

When generating code, follow these patterns and conventions to maintain consistency with the existing codebase.