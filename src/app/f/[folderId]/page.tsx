import { eq } from "drizzle-orm";

import { db } from "~/server/db";
import { files_table, folders_table } from "~/server/db/schema";
import DriveContents from "./drive-content";

async function getAllParents(folderId: bigint) {
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
}

export default async function GoogleDriveClone(props: {
  params: Promise<{
    folderId: string;
  }>;
}) {
  const params = await props.params;

  const parseFolderId = BigInt(params.folderId);

  if (Number.isNaN(Number(parseFolderId))) {
    return <div>Invalid folder ID</div>;
  }

  const parentsPromise = getAllParents(parseFolderId);

  const foldersPromise = db
    .select()
    .from(folders_table)
    .where(eq(folders_table.parent, parseFolderId));

  const filesPromise = db
    .select()
    .from(files_table)
    .where(eq(files_table.parent, parseFolderId));

  const [folders, files, parents] = await Promise.all([
    foldersPromise,
    filesPromise,
    parentsPromise,
  ]);

  return <DriveContents files={files} folders={folders} parents={parents} />;
}
