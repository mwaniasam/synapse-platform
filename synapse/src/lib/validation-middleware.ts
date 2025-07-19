import { type NextRequest, NextResponse } from 'next/server';
import { z, type ZodType, type ZodSchema, type ZodTypeDef } from 'zod';
import type { ValidatedRequest } from '@/types/next-request';

type ErrorResponse = {
  error: string;
  details?: unknown;
};

type AnyZodObject = z.ZodObject<any, any, any, any>;

/**
 * Validates the request body against the provided Zod schema
 * @param request The incoming request
 * @param schema The Zod schema to validate against
 * @returns An object containing the validated data or an error response
 */
async function validateRequest<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ data: T } | ErrorResponse> {
  try {
    // Only parse JSON if the content type is application/json
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return { error: 'Content-Type must be application/json' };
    }

    let body;
    try {
      body = await request.json();
    } catch (error) {
      return { 
        error: 'Invalid JSON',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }

    const validationResult = await schema.safeParseAsync(body);
    if (!validationResult.success) {
      return {
        error: 'Validation failed',
        details: validationResult.error.format()
      };
    }

    return { data: validationResult.data };
  } catch (error) {
    console.error('Validation error:', error);
    return {
      error: 'Internal server error during validation',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Higher-order function to create validated API route handlers
 * @param schema The Zod schema to validate the request body against
 * @param handler The handler function that will process the validated request
 * @returns A request handler function with type-safe validated data
 */
export function withValidation<T>(
  schema: AnyZodObject,
  handler: (request: ValidatedRequest<z.infer<typeof schema>>) => Promise<NextResponse>
) {
  return async function (request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json().catch(() => ({}));
      const validationResult = await schema.safeParseAsync(body);
      
      if (!validationResult.success) {
        return NextResponse.json(
          { 
            error: 'Validation failed',
            details: validationResult.error.format()
          },
          { status: 400 }
        );
      }
      
      // Create a new request object with the validated data
      const enhancedRequest = Object.assign(request, { 
        data: validationResult.data 
      }) as ValidatedRequest<z.infer<typeof schema>>;
      
      return await handler(enhancedRequest);
    } catch (error) {
      console.error('Error in API handler:', error);
      return NextResponse.json(
        { 
          error: 'Internal server error',
          ...(process.env.NODE_ENV === 'development' && {
            message: error instanceof Error ? error.message : 'Unknown error'
          })
        },
        { status: 500 }
      );
    }
  };
}
