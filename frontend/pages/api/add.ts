import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

type Data = {
  status: string;
  reason?: string;
};

export default function check(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    res.status(405).send({
      status: "ERROR",
      reason: "Method not allowed",
    });
    return;
  }

  const address = req.body.address;
  if (!address) {
    res.status(400).send({
      status: "ERROR",
      reason: "Missing address",
    });
    return;
  }
  if (!(address.startsWith("0x") && address.length === 42)) {
    res.status(400).send({
      status: "ERROR",
      reason: "Invalid address",
    });
    return;
  }

  mongoose.connect(process.env.NEXT_PUBLIC_MONGOOSE_URI as string);
  if (mongoose.connection.readyState !== 1) {
    res.status(500).send({
      status: "ERROR",
      reason: "MongoDB connection error",
    });
    return;
  }

  mongoose.connection
    .collection("whitelist")
    .findOne({ address: address })
    .then((data) => {
      if (data) {
        return res.status(400).send({
          status: "ERROR",
          reason: "Address already whitelisted",
        });
      } else {
        mongoose.connection
          .collection("whitelist")
          .insertOne({ address: address })
          .then(() => {
            return res.status(200).send({
              status: "SUCCESS",
            });
          })
          .catch(() => {
            return res.status(500).send({
              status: "ERROR",
              reason: "Server error",
            });
          });
      }
    })
    .catch(() => {
      return res.status(500).send({
        status: "ERROR",
        reason: "Server error",
      });
    });
}
