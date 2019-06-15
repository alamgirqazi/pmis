import {Injectable}      from '@angular/core'
import { Observable,ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CloseService {
	private close = new Subject<boolean>();

 /*
     *@UserLogin() called when user login
     * flag from function login or logout
     */
    setClose(flag) {
        this.close.next(true);
    }

    /*
     *verifyUser() function to check if user is login or not return observable
     */
    getClose():Observable<any> {
        return this.close.asObservable();
    }
}
