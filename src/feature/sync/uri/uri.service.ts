import { type postUriDto } from "@src/models/sync/uri/uri.dto";
import redisClient from "../../../../config/db.redis";

export const uriService = {
  post: async (data: postUriDto[]): Promise<postUriDto[]> => {
    try {
      console.log(data);
      const res: postUriDto[] = [];
      for (const uri of data) {
        const key = `uri:${uri.uri}`;
        const ok: string | null = await redisClient.set(key, "1", {
          NX: true,
          EX: 72 * 60 * 60
        });
        if (ok === "OK") {
          res.push(uri);
        }
      }
      return res;
    } catch (error) {
      console.error("Error in uriService.post:", error);
      throw error;
    }
  }
};
