import {default as PouchDB} from "pouchdb-browser";
import {Identifiable} from "../model/Identifiable";
import IdentifiableValidatorUtils from "../../utils/IdentifiableValidatorUtils";
import IdentifiableQuery from "../model/IdentifiableQuery";

export abstract class BaseDao<T extends Identifiable, Q extends IdentifiableQuery> {

    private daoTypeName = this.constructor.name;

    protected constructor(public db: PouchDB.Database<T> = null) {
    }

    public async save(payload: T): Promise<T> {
        console.debug(`${this.daoTypeName} save`, payload);

        IdentifiableValidatorUtils.validateHasId(payload);

        const foundPayload: T = await this.findById(payload.getId());

        if (foundPayload) {
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
        console.debug(`${this.daoTypeName} find`, query);

        // TODO: find does not work
        const docs = (await this.db.find({selector: query})).docs;

        console.debug(`${this.daoTypeName} find found`, query, docs);

        return docs;
    }

    public async findOne(query: Q): Promise<T | null> {
        const payloads: T[] = await this.find(query);
        const count: number = payloads.length;

        if (count < 1) {
            return null;
        } else if (count > 1) {
            throw new Error('Multi values');
        }

        return payloads[0];
    }

    public async findById(id: string): Promise<T | null> {
        IdentifiableValidatorUtils.validateId(id);

        return this.findOne(new IdentifiableQuery(id) as Q);
    }

    public async findAll(): Promise<T[]> {
        console.debug(`${this.daoTypeName} findAll`);
        const rows = (await this.db.allDocs({include_docs: true})).rows;

        return rows.map(row => row.doc as T);
    }

    public async delete(query: Q): Promise<void> {
        console.debug(`${this.daoTypeName} delete`, query, await this.find(query));

        await Promise.allSettled((await this.find(query))
            .map(async payload => {
                const doc = await this.db.get(payload.getId());

                console.debug(`${this.daoTypeName} delete doc`, doc);

                await this.db.remove(doc);
            }));
    }

    public async deleteById(id: string): Promise<void> {
        IdentifiableValidatorUtils.validateId(id);

        await this.delete(new IdentifiableQuery(id));
    }

    public async deleteAll(): Promise<void> {
        console.debug(`${this.daoTypeName} deleteAll`, (await this.db.allDocs()).rows);

        await Promise.allSettled((await this.db.allDocs()).rows
            .map(async ({id}) => await this.deleteById(id)));
    }

}