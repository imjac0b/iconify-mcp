# Iconify MCP Server

An MCP (Model Context Protocol) server that provides AI assistants with access to Iconify's extensive collection of over 200,000 open source vector icons from 200+ icon sets.

## Features

- **Get all icon sets**: Browse all available icon collections
- **Get specific icon set**: Retrieve detailed information about a specific icon set
- **Search icons**: Search through icons with flexible query parameters
- **Get icon data**: Retrieve specific icon data with usage examples for popular frameworks

## Installation

### Install in Cursor

Go to: `Settings` -> `Cursor Settings` -> `MCP` -> `Add new global MCP server`

Pasting the following configuration into your Cursor `~/.cursor/mcp.json` file is the recommended approach. You may also install in a specific project by creating `.cursor/mcp.json` in your project folder. See [Cursor MCP docs](https://docs.cursor.com/context/model-context-protocol) for more info.

```json
{
  "mcpServers": {
    "iconify": {
      "command": "npx",
      "args": ["-y", "iconify-mcp-server@latest"]
    }
  }
}
```

### Install in Claude Code

Run this command. See [Claude Code MCP docs](https://docs.anthropic.com/en/docs/claude-code/mcp) for more info.

```sh
claude mcp add iconify -- npx -y iconify-mcp-server@latest
```

### Install in Windsurf

Add this to your Windsurf MCP config file. See [Windsurf MCP docs](https://docs.windsurf.com/windsurf/cascade/mcp) for more info.

```json
{
  "mcpServers": {
    "iconify": {
      "command": "npx",
      "args": ["-y", "iconify-mcp-server@latest"]
    }
  }
}
```

#### Cursor One-Click Install

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=iconify&config=eyJjb21tYW5kIjoibnB4IC15IGljb25pZnktbWNwLXNlcnZlckBsYXRlc3QifQ%3D%3D)

## Usage

This MCP server runs as a stdio server and can be integrated with MCP-compatible clients.

### Available Tools

#### `get_all_icon_sets`

Get a list of all available icon sets from Iconify.

**Response**: JSON object containing all icon collections with metadata.

#### `get_icon_set`

Retrieve detailed information about a specific icon set.

**Parameters**:

- `set` (string): The icon set prefix (e.g., "mdi", "heroicons", "lucide")

**Response**: JSON object with icon set information including total icons, categories, etc.

#### `search_icons`

Search for icons across all or specific icon sets.

**Parameters**:

- `query` (string): Search query
- `limit` (number, optional): Maximum results (32-999, default: 64)
- `start` (number, optional): Starting index for pagination
- `prefix` (string, optional): Icon set prefix to limit search scope

**Response**: JSON array of matching icons with metadata.

#### `get_icon`

Get detailed information about a specific icon.

**Parameters**:

- `set` (string): Icon set prefix
- `icon` (string): Icon name

**Response**: Icon data with usage examples for:

- UnoCSS
- Tailwind CSS
- Iconify Icon web component
- Vue (Iconify)
- React (Iconify)
- Svelte (Iconify)
- Astro
- Unplugin Icons

## Build

```bash
bun run build
```

## Development

### Prerequisites

- Node.js >= 18.0.0
- Bun runtime

### Setup

1. Clone the repository:

```bash
git clone https://github.com/imjac0b/iconify-mcp-server.git
cd iconify-mcp-server
```

2. Install dependencies:

```bash
bun install
```

3. Build the project:

```bash
bun run build
```

4. Run in development mode:

```bash
bun run dist/index.js
```

### Project Structure

```
src/
├── index.ts          # Main MCP server implementation
├── utils.ts          # Utility functions
└── ...

dist/                 # Built output
├── index.js          # ES module build
├── index.cjs         # CommonJS build
└── index.d.ts        # TypeScript definitions
```

## Testing

Test the MCP server using the MCP Inspector:

```bash
npx -y @modelcontextprotocol/inspector bun run dist/index.js
```

This will open a web interface where you can test all available tools interactively.

## Usage Examples

### Get All Icon Sets

```bash
# This would be called by your MCP client
# Returns: JSON object with all available icon collections
get_all_icon_sets
```

### Get Specific Icon Set

```bash
# Get information about Material Design Icons
get_icon_set({"set": "mdi"})
```

### Search Icons

```bash
# Search for "home" icons across all sets
search_icons({"query": "home", "limit": 10})

# Search for "heart" icons in Lucide set only
search_icons({"query": "heart", "prefix": "lucide"})
```

### Get Icon Data

```bash
# Get detailed information about a specific icon
get_icon({"set": "heroicons", "icon": "home"})
```

## API Reference

All tools return structured JSON responses. See the tool definitions above for detailed parameter and response information.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Support

If you find this MCP server useful, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs or issues
- 💡 Suggesting new features
- 🔗 Sharing with other developers

## Changelog

### v1.0.0

- Initial release
- Support for all major Iconify operations
- Compatible with Cursor, Claude Code, and Windsurf
- Comprehensive icon set and search functionality
