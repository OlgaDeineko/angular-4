export interface IFileResponse {
  id: number;
  model_id: number;
  model: string;
  attachment_url: string;
  size: string;
  type: string;
  mime: string;
  locked?: boolean;
}
