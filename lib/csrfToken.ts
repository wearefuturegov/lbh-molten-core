import Tokens from 'csrf';
import {NextApiRequest, NextApiResponse} from "next";

export class CSRFValidationError extends Error {
  message = 'invalid csrf token provided';
}

class CSRF {
  private readonly tokenMaker: Tokens;

  constructor() {
    this.tokenMaker = new Tokens({saltLength: 32});
  }

  token(): string {
    return this.tokenMaker.create(process.env.CSRF_SECRET);
  }

  validate(token): void {
    if (!this.tokenMaker.verify(process.env.CSRF_SECRET, token))
      throw new CSRFValidationError();
  }

  middleware(handler: (req: NextApiRequest, res: NextApiResponse) => void):
    (req: NextApiRequest, res: NextApiResponse) => Promise<void> {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        this.validate(req.headers["xsrf-token"])
      } catch (e) {
        res.status(403).json({error: "invalid csrf token"});
        console.error(`[xsrf][error] invalid token on request to ${req.url}: ${e.message}`);
        return;
      }
      return handler(req, res);
    };
  }
}

const csrf = new CSRF();

export const {init, middleware, token, validate} = {
  init: (): CSRF => new CSRF(),
  token: (): string => csrf.token(),
  validate: (token: string): void => csrf.validate(token),
  middleware: (handler: (req: NextApiRequest, res: NextApiResponse) => void):
    (req: NextApiRequest, res: NextApiResponse) => Promise<void> => csrf.middleware(handler),
};
