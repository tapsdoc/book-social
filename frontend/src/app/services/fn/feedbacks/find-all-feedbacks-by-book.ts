/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { PageFeedbackResponse } from '../../models/page-feedback-response';

export interface FindAllFeedbacksByBook$Params {
  'book-id': number;
  page?: number;
}

export function findAllFeedbacksByBook(http: HttpClient, rootUrl: string, params: FindAllFeedbacksByBook$Params, context?: HttpContext): Observable<StrictHttpResponse<PageFeedbackResponse>> {
  const rb = new RequestBuilder(rootUrl, findAllFeedbacksByBook.PATH, 'get');
  if (params) {
    rb.path('book-id', params['book-id'], {});
    rb.query('page', params.page, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<PageFeedbackResponse>;
    })
  );
}

findAllFeedbacksByBook.PATH = '/feeback/book/{book-id}';
