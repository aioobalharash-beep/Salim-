import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";
import { projectId, dataset } from "./env";

export default defineConfig({
  name: "salim-dada-studio",
  title: "Salim Dada — Backstage",
  projectId,
  dataset,
  basePath: "/backstage",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
  studio: {
    components: {
      // Custom branding can be added here
    },
  },
  theme: {
    // Sage Gray & Alabaster palette injected via CSS below
  },
});
