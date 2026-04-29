function getDriverErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== 'object' || !('driverError' in error)) {
    return undefined;
  }

  const driverError = error.driverError;

  if (!driverError || typeof driverError !== 'object' || !('code' in driverError)) {
    return undefined;
  }

  return typeof driverError.code === 'string' ? driverError.code : undefined;
}

export function isUniqueConstraintViolation(error: unknown): boolean {
  return getDriverErrorCode(error) === '23505';
}

export function isForeignKeyViolation(error: unknown): boolean {
  return getDriverErrorCode(error) === '23503';
}
