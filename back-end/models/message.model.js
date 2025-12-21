export default class messageModel{
    constructor({ id, chatBoxId, senderId, content, createdAt}) {
        this.id = id;
        this.chatBoxId = chatBoxId;
        this.senderId = senderId;
        this.content = content;
        this.createdAt = this.formatDate(createdAt);
    }
    formatDate(dateInput) {
        if (!dateInput) return null;
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) return dateInput;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
}