
import {
  Request,
  Response,
  NextFunction
} from 'express';

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export function asyncHandler(
  controller: AsyncController
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    Promise
      .resolve(
        controller(req, res, next)
      )
      .catch(next);
  };
}

