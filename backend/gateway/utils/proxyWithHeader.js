import proxy from "express-http-proxy";

export const proxyWithHeader = (serviceUrl) => {
    return proxy(serviceUrl, {
        timeout: 120000,

        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            if (srcReq) {
                proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
            }

            return proxyReqOpts;
        }
    });
};