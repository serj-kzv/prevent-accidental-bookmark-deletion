export default class PromiseStatusEnum {
    static REJECTED = 'rejected';

    static isRejected(status) {
        return PromiseStatusEnum.REJECTED === status;
    }
}