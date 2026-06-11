import type { StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

/**
 * Custom desk structure.
 *
 * Mirrors the default document-type list, but swaps the standard Portfolio
 * list for an orderable list. This gives editors drag-and-drop handles to
 * set the exact order portfolio items appear in across the homepage, instead
 * of the old manual "Slider page number" / "Sort Order" number fields.
 */
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Content")
    .items(
      S.documentTypeListItems().map((listItem) =>
        listItem.getId() === "portfolio"
          ? orderableDocumentListDeskItem({
              type: "portfolio",
              title: "Portfolio",
              icon: () => "🎭",
              S,
              context,
            })
          : listItem,
      ),
    );
