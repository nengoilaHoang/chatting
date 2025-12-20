export default class accountModel {
    constructor(data) {
        this.id = data?.id;
        this.email = data?.email;
        this.password = data?.password;
        this.displayName = data?.displayName;
        this.avatar = data?.avatar || "https://static.vecteezy.com/system/resources/previews/048/926/061/non_2x/bronze-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-illustration-vector.jpg";
    }
}