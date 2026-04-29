import { type Request, type Response, type NextFunction } from "express";
export declare const authorize: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=authorize.d.ts.map