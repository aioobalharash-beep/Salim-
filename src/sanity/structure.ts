import type { StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

/**
 * Custom desk structure.
 *
 * Mirrors the default document-type list, but with two tweaks:
 *   - Portfolio and Projects become orderable lists, giving editors
 *     drag-and-drop handles to set the exact order items appear in across the
 *     homepage and the /projects directory.
 *   - The master "Services Page" directory is a singleton, so it opens
 *     straight into its one-and-only document instead of a list.
 *   - The "Visual Arts" wing is likewise a singleton, opening straight into
 *     its one cinematic-track document.
 */
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Content")
    .items(
      S.documentTypeListItems()
        // The Services directory and Visual Arts wing are singletons — surface
        // them as dedicated editors below rather than one-item lists.
        .filter(
          (listItem) =>
            listItem.getId() !== "servicesPage" &&
            listItem.getId() !== "visualArts",
        )
        .map((listItem) => {
          if (listItem.getId() === "portfolio") {
            return orderableDocumentListDeskItem({
              type: "portfolio",
              title: "Portfolio",
              icon: () => "🎭",
              S,
              context,
            });
          }
          if (listItem.getId() === "project") {
            return orderableDocumentListDeskItem({
              type: "project",
              title: "Projects",
              icon: () => "🗂️",
              S,
              context,
            });
          }
          return listItem;
        })
        .concat([
          S.listItem()
            .title("Services Page (Directory)")
            .id("servicesPage")
            .icon(() => "✨")
            .child(
              S.document()
                .schemaType("servicesPage")
                .documentId("servicesPage"),
            ),
          S.listItem()
            .title("Visual Arts")
            .id("visualArts")
            .icon(() => "🎨")
            .child(
              S.document()
                .schemaType("visualArts")
                .documentId("visualArts"),
            ),
        ]),
    );
