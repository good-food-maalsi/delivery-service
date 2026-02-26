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

// Hardcoded JWT_PUBLIC_KEY_BASE64 to fix SPKI formatting issue
process.env.JWT_PUBLIC_KEY_BASE64 = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAn6v2wD5P6ycIz00CH8oU
FzvJIW/ob9f4On3aJr42yrQYUS56LfuN1P4BgApWP1d2u6AgLBA0yq8X6j1+rJgd
R6YvGky28hP9+74F66s8EXXxrEfI+Y9awD7bY8vKmAIkam7f6Otad5nlJKPzLN9s
eSuVfP/rl+6MJxr7LykZ2rA+ZOeNi9BHoJ2QNvV/jzBDrxpVuSmcLA0qvcDtIqy0
40xYP7sw4yeaZ6Pc062DaurL4cfuNNcAkuDEvYilWBsYH15jJl5S/jbZqggOHAgV
M3aCWU7T/NMLPTxRdnt3w68M2aQOc+DqELOuIh6jkxD0mNN/+xfyQyVJBCdcSgxo
0RkbKZOJMk+Kl7lzRV+NLyJtqdx/wdNLAA65Gx7USjlNHb7HeMsLWrY8ZVBiZRLX
+ReuO8+aZI3CvmUzAYpnMbg+GJ1SZt8Zzx3KSm/0ay3Bt5tYwvr5okToJvR6Uh9r
rwDuVerri4sNxrJ6Bk59kZZrk3kW5AuNbEIvZUyDhPAo2p/HqU44TmcftQSvI0k2
sKGUELix5ClhB89q7Ypch4H4SUu6CiNs3V4nPPJ2dnRXnrYkoQocFZsTdBLjUbSg
G/+1qlk1Bl64I0ZqZkgBImSrJF48e2Y+qgpQy9cHcujA1uhK9V0CfwT45eQBK9kV
4a1VWyZO3NWV08oELwZaly8CAwEAAQ==
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
