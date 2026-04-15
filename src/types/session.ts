export interface SessionExtensionResponse {
  success: boolean;
  error?: string;
}

export interface SessionExpirationModalProps {
  onExtend: () => Promise<void>;
  timeUntilExpiry: number;
}
