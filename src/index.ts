import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ofetch } from "ofetch";
import { capitalizeDash } from "./utils";

const iconify = ofetch.create({
  baseURL: "https://api.iconify.design",
  headers: {
    "User-Agent": "Iconify MCP (https://github.com/imjac0b/iconify-mcp)",
  },
  cf: {
    cacheEverything: true,
    cacheTtl: 60 * 60 * 24,
  },
});

export class Iconify extends McpAgent {
  server = new McpServer({
    name: "Iconify",
    version: "1.0.0",
  });

  async init() {
    this.server.tool("get_all_icon_sets", {}, async () => {
      const data = await iconify("/collections");

      return {
        content: [{ type: "text", text: JSON.stringify(data) }],
      };
    });

    this.server.tool(
      "get_icon_set",
      {
        set: z.string(),
      },
      async ({ set }) => {
        const data = await iconify("/collection", {
          params: {
            prefix: set,
            info: true,
          },
        });

        return {
          content: [{ type: "text", text: JSON.stringify(data) }],
        };
      }
    );

    this.server.tool(
      "search_icons",
      {
        query: z.string(),
        limit: z.number().max(999).optional().default(64),
        start: z.number().optional().describe("Start index of result"),
        prefix: z
          .string()
          .optional()
          .describe(
            "Icon set prefix if you want to get result only for one icon set."
          ),
      },
      async ({ query, limit, start, prefix }) => {
        if (limit < 32) {
          limit = 32;
        }

        if (limit > 999) {
          limit = 999;
        }

        const data = await iconify("/search", {
          params: {
            query,
            limit,
            start,
            prefix,
          },
        });

        return {
          content: [{ type: "text", text: JSON.stringify(data) }],
        };
      }
    );

    this.server.tool(
      "get_icon",
      {
        set: z.string(),
        icon: z.string(),
      },
      async ({ set, icon }) => {
        const data = await iconify(`/${set}.json`, {
          params: {
            icons: icon,
          },
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                IconifyIcon: data,
                css: {
                  unocss: `<div class="i-${set}:${icon}" style="color: #fff;"></div>`,
                  tailwindcss: `<span class="icon-[${set}--${icon}]" style="color: #fff;"></span>`,
                },
                web: {
                  IconifyIconWebComponent: `<iconify-icon icon="${set}:${icon}" width="24" height="24" style="color: #fff"></iconify-icon>`,
                  IconifyForVue: `<Icon icon="${set}:${icon}" width="24" height="24"  style="color: #fff" />`,
                  IconifyForReact: `<Icon icon="${set}:${icon}" width="24" height="24"  style={{color: #fff}} />`,
                  IconifyForSvelte: `<Icon icon="${set}:${icon}" width="24" height="24"  style={{color: #fff}} />`,
                  AstroIcon: `<Icon name="${set}:${icon}" />`,
                  UnpluginIcons: `import ${capitalizeDash(set)}${capitalizeDash(
                    icon
                  )} from '~icons/${set}/${icon}';`,
                },
              }),
            },
          ],
        };
      }
    );
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      // @ts-ignore
      return Iconify.serveSSE("/sse").fetch(request, env, ctx);
    }

    if (url.pathname === "/mcp") {
      // @ts-ignore
      return Iconify.serve("/mcp").fetch(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  },
};
