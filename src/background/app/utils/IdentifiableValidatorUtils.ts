import {Identifiable} from "../base/model/Identifiable";

export default abstract class IdentifiableValidatorUtils {

    private constructor() {
    }

    public static validateHasId(identifiable: Identifiable): void {
        if (identifiable.getId()) {
            return;
        }

        throw Error('bookmark should has an id');
    }

    public static validateHasIdAll(identifiables: Identifiable[]): void {
        identifiables.forEach(identifiable => this.validateHasId(identifiable));
    }

    public static validateHasNoId(identifiable: Identifiable): void {
        if (identifiable.getId()) {
            throw Error('bookmark should not has an id');
        }
    }

    public static validateId(id: string): void {
        if (id && id.length > 0) {
            return
        }

        throw Error('bookmark id is wrong');
    }

}