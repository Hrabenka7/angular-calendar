/** Returns weather for next five days
 *  For authorized request Add API KEY into
 * https://api.openweathermap.org/data/2.5/forecast?q=Barcelona,es&units=metric&APPID=<HERE YOU API KEY>
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class WeatherService {

  constructor(private http: HttpClient, private router: Router) { }

  getWeatherForecast() {
    const observable =
      this.http.get(`https://api.openweathermap.org/data/2.5/forecast?q=Barcelona,es&units=metric&APPID=`);
    return observable.pipe(
      catchError(err => {
        console.warn(err);
        this.router.navigateByUrl('/error');
        return throwError(err.statusText);
      })
    );
  }

}
