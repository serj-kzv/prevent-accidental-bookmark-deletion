export default class Utils {

    public static removeFromArray<T>(array: T[], element: T): void {
        const index = array.indexOf(element);

        if (index > -1) {
            array.splice(index, 1);
        }
    }

}