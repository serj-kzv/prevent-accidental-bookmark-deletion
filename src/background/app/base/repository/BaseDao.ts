import {default as PouchDB} from "pouchdb-browser";
import {Identifiable} from "../model/Identifiable";
import IdentifiableValidatorUtils from "../../utils/IdentifiableValidatorUtils";

export abstract class BaseDao<T extends Identifiable, Q extends Identifiable> {

    protected constructor(public db: PouchDB.Database<T> = null, public dbQueryType: any) {
    }

    public async save(payload: T): Promise<T> {
        console.debug('BookmarkDao save', payload);

        IdentifiableValidatorUtils.validateHasId(payload);

        const foundBookmark: T = await this.findById(payload.getId());

        if (foundBookmark) {
            throw new Error('Already exists');
        }

        await this.db.put<T>(payload);

        return payload;
    }

    public async saveAll(payloads: T[]): Promise<T[]> {
        IdentifiableValidatorUtils.validateHasIdAll(payloads);

        await this.db.bulkDocs(payloads);

        return payloads;
    }

    public async find(query: Q): Promise<T[]> {
        console.debug('BookmarkDao find', query);

        // TODO: find does not work
        const docs = (await this.db.find({selector: query})).docs;

        console.debug('BookmarkDao find found', query, docs);

        return docs;
    }

    public async findOne(query: Q): Promise<T | null> {
        const bookmarks: T[] = await this.find(query);
        const count: number = bookmarks.length;

        if (count < 1) {
            return null;
        } else if (count > 1) {
            throw new Error('Multi values');
        }

        return bookmarks[0];
    }

    public async findById(id: string): Promise<T | null> {
        IdentifiableValidatorUtils.validateId(id);

        return this.findOne(new this.dbQueryType(id));
    }

    public async findAll(): Promise<T[]> {
        console.debug('BookmarkDao findAll');
        const rows = (await this.db.allDocs({include_docs: true})).rows;

        return rows.map(row => row.doc as T);
    }

    public async delete(query: Q): Promise<void> {
        console.debug('BookmarkDao delete', query, await this.find(query));

        await Promise.allSettled((await this.find(query))
            .map(async payload => {
                const doc = await this.db.get(payload.getId());

                console.debug('BookmarkDao delete doc', doc);

                await this.db.remove(doc);
            }));
    }

    public async deleteById(id: string): Promise<void> {
        IdentifiableValidatorUtils.validateId(id);

        await this.delete(new this.dbQueryType(id));
    }

    public async deleteAll(): Promise<void> {
        console.debug('BookmarkDao deleteAll', (await this.db.allDocs()).rows);

        await Promise.allSettled((await this.db.allDocs()).rows
            .map(async ({id}) => await this.deleteById(id)));
    }

}