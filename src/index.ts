import { Elysia, HTTPMethod } from "elysia";
import { helmet } from "elysia-helmet";
import { cors } from "@elysiajs/cors";

// import cookie from "@elysiajs/cookie";
// import { apiRoutes } from "@api/index";
// import { auth } from "@auth/auth.controller";
// import { jwtAccessSetup, jwtRefreshSetup } from "@auth/guards/setup.jwt";

import { apiRoutes } from "@api/index";

const api = new Elysia();

// api.use(jwtAccessSetup).use(jwtRefreshSetup).use(cookie());

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
