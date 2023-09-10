export default class Utils {
    static isUndefinedOrNull(variable) {
        return typeof variable === 'undefined' || variable === null;
    }

    static isNotUndefinedOrNull(variable) {
        return !Utils.isUndefinedOrNull(variable);
    }

}