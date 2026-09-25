// Minimal .env reader so the scripts have no dependencies.
// Variables already set (e.g. by GitHub Actions) are never overwritten.
import { readFileSync, existsSync } from "node:fs";

if (existsSync(".env")) {
    for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Z_]+)\s*=\s*"?([^"]*)"?\s*$/);
        if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
    }
}
