export default class chatBoxModel {
    constructor({
        id,
        name,
        type,
        avatar,
        partnerId,
        partnerEmail,
        partnerDisplayName,
        partnerAvatar,
        memberIds,
        createdAt,
        updatedAt,
    }) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.avatar = avatar ?? partnerAvatar ?? null;
        this.partnerId = partnerId ?? null;
        this.partnerEmail = partnerEmail ?? null;
        this.partnerDisplayName = partnerDisplayName ?? null;
        this.partnerAvatar = partnerAvatar ?? null;
        this.memberIds = memberIds ?? [];
        this.createdAt = this.formatDate(createdAt);
        this.updatedAt = this.formatDate(updatedAt);
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

