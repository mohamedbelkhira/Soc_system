interface EnvironmentVariables {
  BACKEND_API_URL: string;
  BACKEND_URL: string;
  COST_PER_KG: number;
  LOW_STOCK_THRESHOLD: number;
  ENABLE_PRODUCT_WEIGHT: boolean;
  ENABLE_OPTIONAL_DELIVERY_HANDLER: boolean;
  ENABLE_PRODUCT_IMAGES: boolean;
  ENABLE_PRIMARY_ATTRIBUTE: boolean;
}

export const env: EnvironmentVariables = {
  BACKEND_API_URL:
    import.meta.env.VITE_BACKEND_API_URL || "http://10.1.0.101:5000/api",
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || "http://10.1.0.101:5000",
  COST_PER_KG: 0,
  LOW_STOCK_THRESHOLD: 5,
  ENABLE_PRODUCT_WEIGHT: false,
  ENABLE_OPTIONAL_DELIVERY_HANDLER: false,
  ENABLE_PRODUCT_IMAGES: false,
  ENABLE_PRIMARY_ATTRIBUTE: false,
};
