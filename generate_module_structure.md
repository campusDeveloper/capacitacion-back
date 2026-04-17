# Module Generator Script

This script automatically generates the complete file structure for a new module following the project's architecture pattern: Model → Repository → Service → Controller → Router.

## Usage

```bash
npm run generate:module <moduleName>
```

or

```bash
node scripts/generate-module.js <moduleName>
```

## Examples

### Generate a "location" module:
```bash
npm run generate:module location
```

This will create:
- `src/repositories/location/LocationRepository.ts`
- `src/services/location/LocationService.ts`
- `src/controllers/location/LocationController.ts`
- `src/validators/location/LocationValidator.ts`
- `src/routes/location/LocationRoutes.ts`

### Generate a "facility" module:
```bash
npm run generate:module facility
```

This will create:
- `src/repositories/facility/FacilityRepository.ts`
- `src/services/facility/FacilityService.ts`
- `src/controllers/facility/FacilityController.ts`
- `src/validators/facility/FacilityValidator.ts`
- `src/routes/facility/FacilityRoutes.ts`

## Generated Files Overview

### Repository (`*Repository.ts`)
- `getAll<Modules>(filter)` - Get all records with filtering, pagination, and sorting
- `get<Module>ById(id)` - Get a specific record by ID
- `create<Module>(data)` - Create a new record
- `update<Module>ById(id, data)` - Update a record
- `delete<Module>ById(id)` - Delete a record

### Service (`*Service.ts`)
- Calls repository methods
- Validates entity existence before operations
- Contains business logic

### Controller (`*Controller.ts`)
- Handles HTTP requests/responses
- Validates authentication
- Has GET and POST/PUT/DELETE endpoints for CRUD operations
- Returns API responses via `ApiResponse` utility

### Validator (`*Validator.ts`)
- Zod schemas for request validation
- Query parameters schema
- Request body schemas for create and update
- Type exports for TypeScript support

### Routes (`*Routes.ts`)
- GET `/<module>/list` - List all records with filtering
- GET `/<module>/:id` - Get single record
- POST `/<module>` - Create new record
- PUT `/<module>/:id` - Update record
- DELETE `/<module>/:id` - Delete record

All routes include authentication middleware and schema validation.

## Next Steps After Generation

1. **Update Model Import**: Ensure the model name matches your actual model in `src/models/`
2. **Add Route to Main Router**: Update `src/routes/index.ts` to include the new routes
3. **Customize Validators**: Adjust the Zod schemas based on your model fields
4. **Add Business Logic**: Extend the Service class with specific logic
5. **Customize Repository**: Add custom query methods as needed

## Example Integration

After generating a module, update `src/routes/index.ts`:

```typescript
import locationRoutes from './location/LocationRoutes';

// ... other imports

router.use(locationRoutes);
```

## Naming Conventions

The script automatically handles naming conversions:
- Input: `location` → PascalCase: `Location`, kebab-case: `location`
- Input: `customer-type` → PascalCase: `CustomerType`, kebab-case: `customer-type`
- Input: `UserPermission` → PascalCase: `UserPermission`, kebab-case: `user-permission`

Singular/plural forms are automatically handled for logical method names.
