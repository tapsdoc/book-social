/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { PageBookResponse } from '../../models/page-book-response';

export interface GetAllBooks$Params {
  page?: number;
}

export function getAllBooks(http: HttpClient, rootUrl: string, params?: GetAllBooks$Params, context?: HttpContext): Observable<StrictHttpResponse<PageBookResponse>> {
  const rb = new RequestBuilder(rootUrl, getAllBooks.PATH, 'get');
  if (params) {
    rb.query('page', params.page, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<PageBookResponse>;
    })
  );
}

getAllBooks.PATH = '/books/list';
