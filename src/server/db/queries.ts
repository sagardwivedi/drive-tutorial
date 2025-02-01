import "server-only";

import { eq } from "drizzle-orm";

import { db } from "~/server/db";
import { files_table, folders_table } from "~/server/db/schema";

export const QUERIES = {
  getAllParentsForFolder: async (folderId: bigint) => {
    const parents = [];
    let currentId: bigint | null = folderId;
    while (currentId !== null) {
      const folder = await db
        .selectDistinct()
        .from(folders_table)
        .where(eq(folders_table.id, currentId));

      if (!folder[0]) {
        throw new Error("Parent folder not found");
      }

      parents.unshift(folder[0]);
      currentId = folder[0]?.parent;
    }
    return parents;
  },

  getFolders: (folderId: bigint) =>
    db.select().from(folders_table).where(eq(folders_table.parent, folderId)),

  getFiles: (folderId: bigint) =>
    db.select().from(files_table).where(eq(files_table.parent, folderId)),
};
