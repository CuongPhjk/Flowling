// Uploaded demo assets stay in IndexedDB; object URLs are released by useMediaUrl.
function db(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("flowling-media", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("assets");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export async function saveAsset(file: File): Promise<string> {
  const database = await db();
  const id = crypto.randomUUID();
  await new Promise<void>((resolve, reject) => {
    const tx = database.transaction("assets", "readwrite");
    tx.objectStore("assets").put(file, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  database.close();
  return `asset:${id}`;
}
export async function getAsset(url: string): Promise<Blob> {
  const database = await db();
  return new Promise((resolve, reject) => {
    const request = database
      .transaction("assets")
      .objectStore("assets")
      .get(url.slice(6));
    request.onsuccess = () => {
      database.close();
      if (request.result) resolve(request.result);
      else reject(Error("Không tìm thấy tệp đã lưu trong trình duyệt."));
    };
    request.onerror = () => {
      database.close();
      reject(request.error);
    };
  });
}
