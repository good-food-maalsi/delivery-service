import { Elysia, HTTPMethod } from "elysia";
import { helmet } from "elysia-helmet";
import { cors } from "@elysiajs/cors";

// import cookie from "@elysiajs/cookie";
// import { apiRoutes } from "@api/index";
// import { auth } from "@auth/auth.controller";
// import { jwtAccessSetup, jwtRefreshSetup } from "@auth/guards/setup.jwt";

import { apiRoutes } from "@api/index";
import { AppDataSource } from "@utils/database/data-source";
const api = new Elysia();

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected");
    })
    .catch((e) => console.log(e));

// Hardcoded JWT_PUBLIC_KEY_BASE64 as requested to fix SPKI formatting issue
process.env.JWT_PUBLIC_KEY_BASE64 = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEwHwFKvvE0vjcJ8sbWzuupIIwIRmw
04OvPHNrTvGmM0Zr6Q45boKo4InZMVwLrzXfI9e3SQRFQ7LToT0OLKrf+Q==
-----END PUBLIC KEY-----`;

import { authMiddleware } from "@good-food/utils";

// api.use(jwtAccessSetup).use(jwtRefreshSetup).use(cookie());
try {
    api.use(authMiddleware);
} catch (error) {
    console.error("Auth middleware init failed, continuing without it:", error);
}

//Security;
api.use(
    cors({
        origin: process.env.CORS_ORIGIN || "*",
        credentials: true,
        exposeHeaders: process.env.CORS_EXPOSE_HEADERS || "*",
        allowedHeaders: process.env.CORS_ALLOWED_HEADER || "*",
        methods: (process.env.CORS_ALLOWED_METHODS! as HTTPMethod) || "*",
    }),
);
api.use(helmet());

api.use(apiRoutes);
api.get("/", () => "Welcome to Elysia!");

api.listen(process.env.PORT || 8080);

console.log(
    `🦊 Elysia is running at ${api.server?.hostname}:${api.server?.port}`,
);
