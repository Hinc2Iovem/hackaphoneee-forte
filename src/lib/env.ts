import { from } from "env-var";

const env = from(import.meta.env);

export const BASE_URL = env.get("VITE_API_BASE_URL").required().asString();
// export const WEBSOCKET_URL = env
//   .get("VITE_WEBSOCKET_URL")
//   .required()
//   .asString();
