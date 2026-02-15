export default class UserServices {
    static async CreateUser(mail : string, password : string, username : string) {
        try {
            const response = await fetch(`/api/CreateUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
            });
            return await response.json();
        } catch (error: any) {
            return { isConnected: false, error };
        }
    }

    static async GetUserStats() {
        try {
            const response = await fetch(`/api/GetUserStats`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch user stats');
            }
            
            return await response.json();
        } catch (error: any) {
            return { error: error.message };
        }
    }

    static async GetLeaderboard() {
        try {
            const response = await fetch(`/api/GetLeaderboard`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch leaderboard');
            }
            return await response.json();
        } catch (error: any) {
            return { error: error.message };
        }
    }

    static async GetAllUsers() {
        try {
            const response = await fetch(`/api/GetAllUsers`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch leaderboard');
            }
            return await response.json();
        } catch (error: any) {
            return { error: error.message };
        }
    }
    static async DeleteUser(userId: number) {
        try {
            const response = await fetch(`/api/DeleteUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });
            return await response.json();
        } catch (error: any) {
            return { error: error.message };
        }
    }

    static async UpdateUserSolde(userId: number, newSolde: number) {
        try {
            const response = await fetch(`/api/UpdateUserSolde`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, newSolde }),
            });
            return await response.json();
        } catch (error: any) {
            return { error: error.message };
        }
    }    
}
