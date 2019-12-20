export class WsError extends Error {
    code: string;
    data: any;
    constructor(code: string, message?: string, data?: any) {
        super(message);
        this.code = code;
        this.data = data;
    }
}

export class WsException extends WsError {
    statusCode: number;
    constructor(statusCode: number, code: string, message?: string, data?: any) {
        super(code, message);
        this.statusCode = statusCode;
        this.data = data;
    }
}
