
  import { v2 as cloudinary } from "cloudinary";
  import { v4 as uuidv4 } from "uuid";

  // Cloudinary configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  export const uploadOnCloudinary = async (
    file: File,
    folder: string
  ): Promise<string> => {
  
    if (!file || !folder) {
      throw new Error("File path and folder are required");
    }

    try {
          const buffer = Buffer.from(await file.arrayBuffer());

          const result = await new Promise<string>((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            public_id: uuidv4(),
            resource_type: "image",
          },
          (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result!.secure_url);
              }
          }
        )
              stream.end(buffer); 
    } 

  )
  return result;
  }

    catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload image to Cloudinary");
    }
  };

  export default uploadOnCloudinary;