const userStore = {
    user: JSON.parse(sessionStorage.getItem("user")) || null,

    setUser(userData) {
        this.user = userData;
        sessionStorage.setItem("user", JSON.stringify(userData));
    },

    getUser() {
        return this.user;
    },

    logout() {
        this.user = null;
        sessionStorage.removeItem("user");
    }
};

export default userStore;