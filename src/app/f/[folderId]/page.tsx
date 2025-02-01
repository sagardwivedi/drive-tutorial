import { eq } from "drizzle-orm";
import DriveContents from "~/app/drive-content";
import { db } from "~/server/db";
import {
    files as filesSchema,
    folders as foldersSchema,
} from "~/server/db/schema";

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

	const folders = await db
		.select()
		.from(foldersSchema)
		.where(eq(foldersSchema.parent, parseFolderId));

	const files = await db
		.select()
		.from(filesSchema)
		.where(eq(filesSchema.parent, parseFolderId));

	return <DriveContents files={files} folders={folders} />;
}
