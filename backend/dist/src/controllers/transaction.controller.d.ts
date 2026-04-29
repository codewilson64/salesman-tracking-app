import type { Request, Response } from "express";
export declare const getOutstandingTransactions: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPaidTransactions: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getTransactionById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateTransactionPayment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=transaction.controller.d.ts.map