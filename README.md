# Iconify MCP Server

An MCP (Model Context Protocol) server that provides AI assistants with access to Iconify's extensive collection of over 200,000 open source vector icons from 200+ icon sets.

## Features

- **Get all icon sets**: Browse all available icon collections
- **Get specific icon set**: Retrieve detailed information about a specific icon set
- **Search icons**: Search through icons with flexible query parameters
- **Get icon data**: Retrieve specific icon data with usage examples for popular frameworks

## Installation

```bash
npm install iconify-mcp-server
```

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
