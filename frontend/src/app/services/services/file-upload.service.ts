/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { getURl } from '../fn/file-upload/get-u-rl';
import { GetURl$Params } from '../fn/file-upload/get-u-rl';

@Injectable({ providedIn: 'root' })
export class FileUploadService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getURl()` */
  static readonly GetURlPath = '/file-upload/file';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getURl()` instead.
   *
   * This method doesn't expect any request body.
   */
  getURl$Response(params: GetURl$Params, context?: HttpContext): Observable<StrictHttpResponse<{
}>> {
    return getURl(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getURl$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getURl(params: GetURl$Params, context?: HttpContext): Observable<{
}> {
    return this.getURl$Response(params, context).pipe(
      map((r: StrictHttpResponse<{
}>): {
} => r.body)
    );
  }

}
