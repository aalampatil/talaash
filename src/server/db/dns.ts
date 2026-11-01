import { setServers } from "node:dns/promises";
import "server-only";

let configuredServers = "";

export function configureDatabaseDns(value = process.env.MONGODB_DNS_SERVERS) {
  if (!value || value === configuredServers) return;
  const servers = value.split(",").map(server => server.trim()).filter(Boolean);
  if (servers.length) setServers(servers);
  configuredServers = value;
}
