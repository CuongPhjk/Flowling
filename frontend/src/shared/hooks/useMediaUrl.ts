import { useEffect, useState } from "react";
import { getAsset } from "../api/media";
export function useMediaUrl(source: string) {
  const [url, setUrl] = useState(source.startsWith("asset:") ? "" : source);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    let objectUrl = "";
    setError("");
    setUrl(source.startsWith("asset:") ? "" : source);
    if (source.startsWith("asset:"))
      getAsset(source)
        .then((blob) => {
          if (active) {
            objectUrl = URL.createObjectURL(blob);
            setUrl(objectUrl);
          }
        })
        .catch((e) => {
          if (active) setError(String(e.message));
        });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [source]);
  return { url, error };
}
