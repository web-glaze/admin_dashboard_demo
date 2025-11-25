const PRODUCTION_ENV = "production";

export function isProduction() {
  return process.env.NODE_ENV === PRODUCTION_ENV;
}
