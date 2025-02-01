import {
  getAllParentsForFolder,
  getFiles,
  getFolders,
} from "~/server/db/queries";
import DriveContents from "./drive-content";

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

  const [folders, files, parents] = await Promise.all([
    getFolders(parseFolderId),
    getFiles(parseFolderId),
    getAllParentsForFolder(parseFolderId),
  ]);

  return <DriveContents files={files} folders={folders} parents={parents} />;
}
