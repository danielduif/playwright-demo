export interface ApiValidationError {
  errors: Record<string, string[]>;
}

export interface ApiMessageError {
  message: string;
}
