
import imageCompression from "browser-image-compression";

export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

export const compressListingImage = async (file: File): Promise<File> => {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select a valid image file");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Image must be 2 MB or smaller");
  }

  const compressedFile = await imageCompression(file, {
    maxSizeMB: 2,
    maxWidthOrHeight: 2500,
    useWebWorker: true,
    fileType: file.type === "image/png" ? "image/png" : "image/jpeg",
  });

  if (compressedFile.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Image must be 2 MB or smaller");
  }

  return new File([compressedFile], file.name, {
    type: compressedFile.type || file.type,
    lastModified: Date.now(),
  });
};