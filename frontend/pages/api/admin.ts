import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: string;
  isValid?: boolean;
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

  const { address, password } = req.body;
  if (!address || !password) {
    res.status(400).send({
      status: "ERROR",
      reason: "Missing address or password",
    });
    return;
  }
  if (
    password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD &&
    address === process.env.NEXT_PUBLIC_ADMIN_ADDRESS
  ) {
    res.status(200).send({
      status: "SUCCESS",
      isValid: true,
    });
  } else {
    res.status(200).send({
      status: "SUCCESS",
      isValid: false,
    });
  }
}
