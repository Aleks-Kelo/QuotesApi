export interface RequestType {
    id: string;
    data: any;
}

export interface ResponseType {
    success: boolean;
    message: string;
    data?: any;
}