import type { NextConfig } from "next";

const config: NextConfig = {
  // Keeps `next dev` from writing an AGENTS.md into the repository.
  agentRules: false,
};

export default config;
