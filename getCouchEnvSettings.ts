import type { CouchSettings } from "./types.ts";

/**
 * Creates a `CouchSettings` object from Deno.env vars using specified `prefix`
 * to use when instantiating a new Couch class.
 * 
 * @param prefix string to prefix
 * @returns `CouchSettings`
 * @throws Error if any key is blank.
 */
export function getCouchEnvSettings(prefix = "COUCH"): CouchSettings {
  const settings = {
    "host": Deno.env.get(`${prefix}_HOST`) || "",
    "port": parseInt(Deno.env.get(`${prefix}_PORT`) || "5984"),
    "db": Deno.env.get(`${prefix}_DB`) || "",
    "user": Deno.env.get(`${prefix}_USER`) || "",
    "password": Deno.env.get(`${prefix}_PASS`) || "",
    "authType": Deno.env.get(`${prefix}_AUTH_TYPE`) || "basic"
  };

  for (const [key, value] of Object.entries(settings)) {
    if (value === "") {
      throw new Error(`Error creating CouchSettings: ${key} is blank. `);
    }
  }

  return settings;
}
