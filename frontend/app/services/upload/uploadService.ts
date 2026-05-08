import { api } from "../../libs/axios";

export const uploadImage = async (image: string, folder: string): Promise<{
  url: string;
  public_id: string;
}> => {
  const formData = new FormData();

  const imageFile: {
    uri: string;
    type: string;
    name: string;
  } = {
    uri: image,
    type: "image/jpeg",
    name: "photo.jpg",
  };

  formData.append("image", imageFile as unknown as Blob);

  const res = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    params: { folder },
  });

  return {
    url: res.data.data.url,
    public_id: res.data.data.public_id,
  };
};

export const deleteImage = async (publicId: string) => {
  await api.delete("/upload", {
    params: { publicId },
  });
};