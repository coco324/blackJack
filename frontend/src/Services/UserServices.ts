export default class UserServices {
    static async CreateUser(mail : string, password : string, username : string) {
        try {
            const response = await fetch(`/api/CreateUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ mail, password, username }),
            });
            return await response.json();
        } catch (error : any) {
          return error;
        }
    }
    static async Login(mail : string, password : string) {
        try {
            const response = await fetch(`/api/Login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ mail, password }),
            });
            return await response.json();
        } catch (error : any) {
          return error;
        }
    }
    static async Logout() {
        try {
            const response = await fetch(`/api/Logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                credentials: 'include',
            });
            return await response.json();
        } catch (error : any) {
          return error;
        }
    }

    static async CheckAuth() {
        try {
            const response = await fetch(`/api/checkAuth`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            return await response.json();
        } catch (error: any) {
            return { isConnected: false, error };
        }
    }
    
}
