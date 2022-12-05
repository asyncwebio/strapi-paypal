/* eslint-disable node/no-extraneous-require */
/* eslint-disable node/no-missing-require */

"use strict";

const path = require("path");
const koaStatic = require("koa-static");

module.exports = async ({ strapi }) => {
  strapi.server.routes([
    {
      method: "GET",
      path: "/plugins/strapi-paypal/static/(.*)",
      async handler(ctx, next) {
        ctx.url = path.basename(`${ctx.url}/paypal.js`);
        const folderPath =
          strapi.dirs.extensions || strapi.dirs.dist.extensions;
        const staticFolder = path.resolve(
          folderPath,
          "strapi-paypal",
          "public"
        );
        return koaStatic(staticFolder)(ctx, next);
      },
      config: {
        auth: false,
      },
    },
  ]);
};
