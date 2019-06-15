// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { HttpClient, HttpHeaders } from '@angular/common/http';

// import { AuthService } from '../core/auth.service';
// import { IRMconfig } from '../../base.config';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Observable';

// /**
//  * Api services for the `User` model.
//  */
// @Injectable()
// export class AssetsApi {
//   constructor(protected http: HttpClient, private authService: AuthService) {}
//   public login(data): Observable<any> {
//     const url = IRMconfig.getPath() + '/auth';
//     return this.http.post(url, data).map((response: any) => {
//       return response;
//     });
//   }
//   public getAllAssets(): Observable<any> {
//     const url = IRMconfig.getPath() + '/assets';
//     return this.http
//       .get(url, {
//         headers: new HttpHeaders().set(
//           'Authorization',
//           this.authService.getAccessTokenId()
//         )
//       })
//       .map((response: any) => {
//         return response;
//       });
//   }
//   public getAssetsEverything(): Observable<any> {
//     const url = IRMconfig.getPath() + '/assets/everything';
//     const httpOptions = {
//       // responseType: 'arraybuffer' as 'json'
//       // 'responseType'  : 'blob' as 'json'        //This also worked
//     };
//     return this.http
//       .get(url, {
//         headers: new HttpHeaders().set(
//           'Authorization',
//           this.authService.getAccessTokenId()
//         ),
//         ...httpOptions
//       })
//       .map((response: any) => {
//         return response;
//       });
//   }
//   public getAssetsNextId(AssetCategory): Observable<any> {
//     const url =
//       IRMconfig.getPath() + `/assets/getnextid?AssetCategory=${AssetCategory}`;

//     return this.http
//       .get(url, {
//         headers: new HttpHeaders().set(
//           'Authorization',
//           this.authService.getAccessTokenId()
//         )
//       })
//       .map((response: any) => {
//         return response;
//       });
//   }
//   public getInventoryNextId(): Observable<any> {
//     const url = IRMconfig.getPath() + `/inventory/getnextid`;

//     return this.http
//       .get(url, {
//         headers: new HttpHeaders().set(
//           'Authorization',
//           this.authService.getAccessTokenId()
//         )
//       })
//       .map((response: any) => {
//         return response;
//       });
//   }
//   public getInventoryEverything(): Observable<any> {
//     const url = IRMconfig.getPath() + '/inventory/everything';
//     return this.http
//       .get(url, {
//         headers: new HttpHeaders().set(
//           'Authorization',
//           this.authService.getAccessTokenId()
//         )
//       })
//       .map((response: any) => {
//         return response;
//       });
//   }

//   public insertAsset(data): Observable<any> {
//     const url = IRMconfig.getPath() + '/assets/';
//     delete data._id;

//     return this.http
//       .post(url, data, {
//         headers: new HttpHeaders().set(
//           'Authorization',
//           this.authService.getAccessTokenId()
//         )
//       })
//       .map((response: any) => {
//         return response;
//       });
//   }

//   public uploadDocument(image: any): Observable<any> {
//     const url = IRMconfig.getPath() + `/assets/fileimport`;

//     const formData: FormData = new FormData();
//     formData.append('file', image, image.name);

//     return this.http
//       .post(url, formData, {
//         headers: new HttpHeaders().set(
//           'Authorization',
//           this.authService.getAccessTokenId()
//         )
//       })
//       .map((response: any) => {
//         return response;
//       });
//   }
//   public uploadInventoryDocument(image: any): Observable<any> {
//     const url = IRMconfig.getPath() + `/inventory/fileimport`;

//     const formData: FormData = new FormData();
//     formData.append('file', image, image.name);

//     return this.http
//       .post(url, formData, {
//         headers: new HttpHeaders().set(
//           'Authorization',
//           this.authService.getAccessTokenId()
//         )
//       })
//       .map((response: any) => {
//         return response;
//       });
//   }

//   public insertInventory(data): Observable<any> {
//     const url = IRMconfig.getPath() + '/inventory/';
//     delete data._id;

//     return this.http
//       .post(url, data, {
//         headers: new HttpHeaders().set(
//           'Authorization',
//           this.authService.getAccessTokenId()
//         )
//       })
//       .map((response: any) => {
//         return response;
//       });
//   }
//   public insertUser(data): Observable<any> {
//     const url = IRMconfig.getPath() + '/users/';
//     delete data._id;
//     return this.http
//       .post(url, data, {
//         headers: new HttpHeaders().set(
//           'Authorization',
//           this.authService.getAccessTokenId()
//         )
//       })
//       .map((response: any) => {
//         return response;
//       });
//   }

//   public updateAssetsStatus(_id: any, data?: any): Observable<any> {
//     const url = IRMconfig.getPath() + '/assets/' + _id;
//     return this.http
//       .put(url, data, {
//         headers: new HttpHeaders().set(
//           'Authorization',
//           this.authService.getAccessTokenId()
//         )
//       })
//       .map((response: any) => {
//         return response;
//       });
//   }
//   public updateInventoryStatus(_id: any, data?: any): Observable<any> {
//     const url = IRMconfig.getPath() + '/inventory/' + _id;
//     return this.http
//       .put(url, data, {
//         headers: new HttpHeaders().set(
//           'Authorization',
//           this.authService.getAccessTokenId()
//         )
//       })
//       .map((response: any) => {
//         return response;
//       });
//   }
//   public updateUsersStatus(_id: any, data?: any): Observable<any> {
//     const url = IRMconfig.getPath() + '/users/' + _id;
//     return this.http
//       .put(url, data, {
//         headers: new HttpHeaders().set(
//           'Authorization',
//           this.authService.getAccessTokenId()
//         )
//       })
//       .map((response: any) => {
//         return response;
//       });
//   }

//   public deleteAsset(_id: any): Observable<any> {
//     const url = IRMconfig.getPath() + '/assets/' + _id;
//     return this.http.delete(url, {
//       headers: new HttpHeaders().set(
//         'Authorization',
//         this.authService.getAccessTokenId()
//       )
//     });
//   }
//   public deleteUser(_id: any): Observable<any> {
//     const url = IRMconfig.getPath() + '/users/' + _id;
//     return this.http.delete(url, {
//       headers: new HttpHeaders().set(
//         'Authorization',
//         this.authService.getAccessTokenId()
//       )
//     });
//   }
//   public deleteInventory(_id: any): Observable<any> {
//     const url = IRMconfig.getPath() + '/inventory/' + _id;
//     return this.http.delete(url, {
//       headers: new HttpHeaders().set(
//         'Authorization',
//         this.authService.getAccessTokenId()
//       )
//     });
//   }

//   /// Statistics

//   public getAssetsStatistics(): Observable<any> {
//     const url = IRMconfig.getPath() + '/assets/statistics';
//     return this.http
//       .get(url, {
//         headers: new HttpHeaders().set(
//           'Authorization',
//           this.authService.getAccessTokenId()
//         )
//       })
//       .map((response: any) => {
//         return response;
//       });
//   }
//   public getSuppliesStatistics(): Observable<any> {
//     const url = IRMconfig.getPath() + '/inventory/statistics';
//     return this.http
//       .get(url, {
//         headers: new HttpHeaders().set(
//           'Authorization',
//           this.authService.getAccessTokenId()
//         )
//       })
//       .map((response: any) => {
//         return response;
//       });
//   }
//   public getUsersStatistics(): Observable<any> {
//     const url = IRMconfig.getPath() + '/users/statistics';
//     return this.http
//       .get(url, {
//         headers: new HttpHeaders().set(
//           'Authorization',
//           this.authService.getAccessTokenId()
//         )
//       })
//       .map((response: any) => {
//         return response;
//       });
//   }
// }
