import { Request, Response, NextFunction } from "express";
import { fetchDailyCost } from "../Models/dailycostmodel";
import { checkExist } from "../Models/api.utils";
import { DailyExpectedCost } from "../types/types";

export const getDailyCost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const country = req.params.country;

  const promises: Promise<DailyExpectedCost | void>[] = [
    fetchDailyCost(country),
  ];

  if (country) {
    promises.push(checkExist("dailycost", "country", country));
  }

  Promise.all(promises)
    .then(([countryInfo]) => {
      res.status(200).send({ countryInfo });
    })
    .catch((err) => {
      next(err);
    });
};
