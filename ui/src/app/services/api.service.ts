import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { environment } from '../../environments/environment';

/* Token Received as a Response */
interface TokenResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private router: Router, private tokenService: TokenService) { }

  public request(method: string, url: string, tokenPayLoad?: any) {
  	let res, reqBody;
  	var baseApiUrl = `${environment.apiUrl}/${environment.apiVer}`;
  	if(tokenPayLoad) {
  	  reqBody = tokenPayLoad;
  	} else {
  	  reqBody = { headers: { Authorization: `${this.tokenService.getToken()}` }};
  	}

  	res = this.http[`${method}`](`${baseApiUrl}/${url}`, reqBody);

  	const request = res.pipe(
  	  map((data: TokenResponse) => {
  	  	if (data.token) {
  	  	  this.tokenService.setToken(data.token);
  	  	}
  	  	return data;
  	  })
  	);

  	return request;
  }
}
