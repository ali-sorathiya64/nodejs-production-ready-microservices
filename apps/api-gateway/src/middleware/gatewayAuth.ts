import { Request, Response, NextFunction } from 'express'
import { AppError, verifyToken } from 'shared';
import { getAllowedRoles, isPublicRoute } from '../rbac';

// headers only the gateway should set, never trust them from the client
const IDENTITY_HEADERS = [
    "x-user-id",
    "x-user-role",
    "x-gateway-secret"
] as const

// client can send fake x-user-id etc, so remove them first
function stripIdentityHeaders(req: Request) {
    for (const header of IDENTITY_HEADERS) {
        delete req.headers[header]
    }
}

// auth-service checks this secret to know the request came via gateway
function attachGatewayRequest(req: Request) {
    const gatewaySecret = process.env.GATEWAY_SECRET;

    if (!gatewaySecret) {
        throw new AppError(500, "Gateway secret is not defined in .env")
    }

    req.headers["x-gateway-secret"] = gatewaySecret
}

// baseUrl = "/auth", path = "/login" -> "/auth/login"
function requestPath(req: Request) {
    const combined = `${req.baseUrl}${req.path}`

    // remove trailing slash (/auth/login/ -> /auth/login)
    if (combined.length > 1 && combined.endsWith("/")) {
        return combined.slice(0, -1)
    }

    return combined || "/"
}

// auth-service reads these to know who is calling
function attachUserHeaders(req: Request, userId: string, role: string) {
    req.headers["x-user-id"] = userId;
    req.headers["x-user-role"] = role;
}

export const gatewayAuth = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    try {
        stripIdentityHeaders(req)
        attachGatewayRequest(req)

        const path = requestPath(req)

        // login/register don't need a token
        if (isPublicRoute(req.method, path)) {
            return next()
        }

        const authHeader = req.headers['authorization'];

        if (!authHeader?.startsWith("Bearer ")) {
            throw new AppError(401, "Invalid bearer token")
        }

        // cut off the "Bearer " part, keep only the token
        const token = authHeader.slice("Bearer ".length).trim();
        const payload = verifyToken(token)

        // no rule for this route = unknown route
        const allowedRoles = getAllowedRoles(req.method, path)

        if (!allowedRoles) {
            throw new AppError(404, 'Route not found')
        }

        // token is valid but role is not allowed here
        if (!allowedRoles.includes(payload.role)) {
            throw new AppError(403, 'Forbidden, you dont have access to this route')
        }

        attachUserHeaders(req, payload.userId, payload.role);
        return next();
    } catch (error) {
        if (error instanceof AppError) {
            return next(error)
        }
        // anything else (expired/tampered token from jwt.verify)
        return next(new AppError(401, "Invalid or expired token"))
    }
}