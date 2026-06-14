import api from "../utils/api";
import { BlockchainRecord } from "../types";

export const eaglePassService = {
  getBlockchainRecords: async (): Promise<BlockchainRecord[]> => {
    try {
      const res = await api.get("/users/credentials");
      const credentials = res.data.credentials || [];
      return credentials.map((c: any) => ({
        id: c._id || c.id,
        type: c.type,
        title: c.title,
        recipient: c.recipient,
        issuer: c.issuer,
        date: c.date,
        txHash: c.txHash,
        status: c.status,
      }));
    } catch (err) {
      console.error("Failed to load blockchain credentials:", err);
      return [];
    }
  },

  verifyCredential: async (
    title: string,
    recipient: string,
    issuer: string,
    type: "Certificate" | "Hackathon" | "Internship" | "Achievement"
  ): Promise<BlockchainRecord> => {
    try {
      const res = await api.post("/users/credentials", {
        title,
        recipient,
        issuer,
        type,
      });
      const c = res.data.credential;
      return {
        id: c._id || c.id,
        type: c.type,
        title: c.title,
        recipient: c.recipient,
        issuer: c.issuer,
        date: c.date,
        txHash: c.txHash,
        status: c.status,
      };
    } catch (err: any) {
      console.error("Failed to verify credential:", err);
      throw err;
    }
  },
};
