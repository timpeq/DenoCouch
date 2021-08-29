
export interface CouchSettings {
  host: string,
  db: string,
  user: string,
  password: string,
  port: number,
  authType?: string
}

export interface CouchDocument {
  "_id": string
}

export interface CouchPutResponse {
  status: number,
  error?: string,
  reason?: string,
}

export interface CouchFindRequest {
  /** Object containing search criteria  */
  // deno-lint-ignore no-explicit-any
  selector: any,
  /** Maximum number of results returned */
  limit?: number,
  /** Number of results to skip */
  skip?: number,
  /** Array following `sort syntax` */
  // deno-lint-ignore no-explicit-any
  sort?: any[], //Todo build type
  /** Specifying which fields of each object should be returned. 
   * If omitted, the entire object is returned.  */
  fields?: string[],
  /**  Include conflicted documents  */
  conflicts?: boolean,
  r?: number,
  bookmark?:string,
  update?: boolean,
  stable?: boolean,
  // deno-lint-ignore camelcase
  execution_stats?: boolean
}