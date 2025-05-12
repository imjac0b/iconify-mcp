import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ofetch } from "ofetch";
import { capitalizeDash } from "./utils";

const iconify = ofetch.create({
  baseURL: "https://api.iconify.design",
  headers: {
    "User-Agent": "Iconify MCP (https://github.com/imjac0b/iconify-mcp)",
  },
});

const server = new McpServer({
  name: "Iconify",
  version: "1.0.0",
});

server.tool("get_all_icon_sets", "Get all icon sets", {}, async () => {
  const data = await iconify("/collections");

  return {
    content: [{ type: "text", text: JSON.stringify(data) }],
  };
});

server.tool(
  "get_icon_set",
  "Get a icon set",
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

server.tool(
  "search_icons",
  "Search icons",
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

server.tool(
  "get_icon",
  "Get icon",
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

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Iconify MCP Server running on stdio");
