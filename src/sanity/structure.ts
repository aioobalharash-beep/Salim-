import type { StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

/**
 * Custom desk structure.
 *
 * Mirrors the default document-type list, but with two tweaks:
 *   - Portfolio becomes an orderable list, giving editors drag-and-drop
 *     handles to set the exact order items appear in across the homepage.
 *   - The master "Services Page" directory is a singleton, so it opens
 *     straight into its one-and-only document instead of a list.
 */
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Content")
    .items(
      S.documentTypeListItems()
        // The Services directory is a singleton — surface it as a dedicated
        // editor below rather than a one-item list.
        .filter((listItem) => listItem.getId() !== "servicesPage")
        .map((listItem) =>
          listItem.getId() === "portfolio"
            ? orderableDocumentListDeskItem({
                type: "portfolio",
                title: "Portfolio",
                icon: () => "🎭",
                S,
                context,
              })
            : listItem,
        )
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
        ]),
    );
