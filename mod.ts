import type { CouchSettings, CouchFindRequest } from "./types.ts";

export class Couch {
  settings:CouchSettings;
  cookie = "";

  constructor(settings: CouchSettings) {
    if (settings.host == "") throw new Error(`Couch Hostname Invalid ${settings.host}`);
    if (settings.db == "") throw new Error("Couch DB Invalid");
    if (settings.password == "") throw new Error("Couch Password Invalid");

    this.settings = settings;

    if (!settings.authType) { this.settings.authType = "basic" } 
  }

  private get url():URL{
    let basicAuth = "";
    if (this.settings.authType == "basic") basicAuth = `${this.settings.user}:${this.settings.password}@`;
    return new URL(`http://${basicAuth}${this.settings.host}:${this.settings.port}`);
  }

  async connect():Promise<boolean>{
    const fetchResult = await fetch(`${this.url}/${this.settings.db}`);
    if (!fetchResult.ok) throw new Error(`Connecting to database (${this.settings.db}): ${fetchResult.statusText}`);
    return true;
  }

  /** Insert new document */
  // deno-lint-ignore no-explicit-any
  async put(documentID: string, document:any):Promise<any> {

    const fetchReq:RequestInit = {
      method: "put",
      body: JSON.stringify(document),
      headers: {"Content-Type": "application/json"},
    }

    const fetchResult = await fetch(`${this.url}/${this.settings.db}/${documentID}`, fetchReq);
    
    const fetchBody = await fetchResult.json();

    const fetchStatus = fetchResult.status;

    if (fetchBody.ok != true) throw { 
      status: fetchStatus,
      error: fetchBody.error,
      reason: fetchBody.reason
    }

    else return fetchBody;
  }

  /** Get document by ID */
  // deno-lint-ignore no-explicit-any
  async get(id:string):Promise<any>{
    const fetchResult = await fetch(`${this.url}/${this.settings.db}/${id}`)
    if (!fetchResult.ok) throw new Error(`DB Request Failed ${fetchResult.statusText}`)
    return await fetchResult.json();
  }

  /** Delete document by ID   */
  async delete(documentID:string, revisionID:string):Promise<boolean>{
    const fetchReq:RequestInit = {
      method: "delete",
      headers: {"Content-Type": "application/json"}
    }
    const fetchResult = await fetch(`${this.url}/${this.settings.db}/${documentID}?rev=${revisionID}`, fetchReq);
    const fetchBody = await fetchResult.json();

    if (!fetchResult.ok) throw new Error(`Couch Delete ${fetchResult.status} ${fetchResult.statusText} ${fetchBody.error} ${fetchBody.reason}`)
    return true;
  }

  /**
   * Update a document
   * 
   * @param documentID 
   * @param revisionID 
   * @param document 
   * @returns Document object
   */
  // deno-lint-ignore no-explicit-any
  async update(documentID:string, revisionID:string, document:any):Promise<any>{
    const fetchReq:RequestInit = {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Referer": this.settings.host
    },
      body: JSON.stringify(document)
    }
    const fetchResult = await fetch(`${this.url}/${this.settings.db}/${documentID}?_rev=${revisionID}`, fetchReq);
    const fetchBody = await fetchResult.json();
  
    if (fetchResult.ok) return fetchBody;
    else throw `${fetchResult.status} ${fetchResult.statusText} ${fetchBody.error} ${fetchBody.reason}`
  }

  /**
   * Query database
   */
  // deno-lint-ignore no-explicit-any
  async find(findRequest:CouchFindRequest):Promise<any>{
    const fetchReq:RequestInit = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Referer": this.settings.host,
      },
      body: JSON.stringify(findRequest)
    }

    const fetchResult = await fetch(`${this.url}/${this.settings.db}/_find`, fetchReq);
    const fetchResp = await fetchResult.json();
    return fetchResp;
  }



  /**
   * Authenticate user 
   */
  async userAuth(name:string, password:string):Promise<string>{
    const fetchReq:RequestInit = {
      method: "post",
      body: JSON.stringify( { name:name, password:password } ),
      headers: {"Content-Type": "application/json"},
    }

    const fetchResult = await fetch(`${this.url}/_session`, fetchReq);

    const fetchToken = fetchResult.headers.get("set-cookie");
    console.log("Got cookie", fetchToken);
  

    const tryingCookie = await fetch(`${this.url}/_session`, { 
      method: "get",
      headers: {
        "Set-Cookie" : fetchToken || "",
        "Content-Type": "application/json"
      }

    });

    console.log("trying cookie", await tryingCookie.json());
    
    const fetchBody = await fetchResult.json();

    if (fetchBody.ok != true) {
      throw new Error (`${fetchResult.status} ${fetchResult.statusText}`)
    }

    
    return fetchBody;
  }


}
