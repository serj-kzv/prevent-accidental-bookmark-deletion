import {BookmarkType} from "./BookmarkType";
import {Equals} from "../Equals";
import {Identifiable} from "../Identifiable";

export class Bookmark implements Equals, Identifiable {

    public constructor(
        public id: string,
        public parentId: string,
        public title: string,
        public type: BookmarkType,
        public url: string,
        public index: number,
    ) {
    }

    public equals(object: any): boolean {
        if (this === object) {
            return true;
        }

        const bookmark: Bookmark = (object as Bookmark);

        return this.id === bookmark.id
            && this.parentId === bookmark.parentId
            && this.title === bookmark.title
            && this.type.valueOf() === bookmark.type.valueOf()
            && this.url === bookmark.url
            && this.index === bookmark.index;
    }

    public getId(): string {
        return this.id;
    }
}