import PromiseStatusEnum from '../utils/PromiseStatusEnum.js';
import IfBookmarkRootHasAnIdValidator from './IfBookmarkRootHasAnIdValidator.js';
import IfBookmarkRootHasValidIdValidator from './IfBookmarkRootHasValidIdValidator.js';
import IfBookmarksHaveOnlyValidTypesValidator from './IfBookmarksHaveOnlyValidTypesValidator.js';
import IfBookmarksHaveTypesValidator from './IfBookmarksHaveTypesValidator.js';
import IfThereIsAtLeastBookmarkRootValidator from './IfThereIsAtLeastBookmarkRootValidator.js';
import IfThereIsBookmarkTreeValidator from './IfThereIsBookmarkTreeValidator.js';
import IfThereIsOnlyOneBookmarkRootValidator from './IfThereIsOnlyOneBookmarkRootValidator.js';

export default class BookmarkValidatorExecutor {

    static async validate() {
        const validatorResults = await Promise.allSettled([
            new IfBookmarkRootHasAnIdValidator().validate(),
            new IfBookmarkRootHasValidIdValidator().validate(),
            new IfBookmarksHaveOnlyValidTypesValidator().validate(),
            new IfBookmarksHaveTypesValidator().validate(),
            new IfThereIsAtLeastBookmarkRootValidator().validate(),
            new IfThereIsBookmarkTreeValidator().validate(),
            new IfThereIsOnlyOneBookmarkRootValidator().validate(),
        ]);

        console.debug('validatorResults', validatorResults);

        const isValidatorsNotFinished = validatorResults
            .some(({status}) => PromiseStatusEnum.isRejected(status));

        console.debug('isValidatorsNotFinished', isValidatorsNotFinished);

        if (isValidatorsNotFinished) {
            return false;
        }

        return validatorResults
            .map(({value}) => value)
            .every(value => value === true);
    }

}