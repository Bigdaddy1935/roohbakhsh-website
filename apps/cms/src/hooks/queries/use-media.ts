"use client";

import { useMutation } from "@tanstack/react-query";
import { apiUpload } from "@/lib/api-client";
import type { MediaUploadResponse } from "@roohbakhsh/shared";

/** آپلود تصویر عمومی (کاور دوره، آواتار استاد و...) — لینک عمومی برمی‌گرداند. */
export function useUploadMedia() {
  return useMutation<MediaUploadResponse, Error, File>({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      return apiUpload<MediaUploadResponse>("/media/upload", formData);
    },
  });
}
