import { DocumentData, DocumentReference, SetOptions, DocumentSnapshot, PartialWithFieldValue, CollectionReference } from "firebase/firestore";
import { Observable } from "rxjs";
export declare function docExists<T>(ref: DocumentReference<T>): Promise<boolean>;
export declare function setWithCounter<T>(ref: DocumentReference<T>, data: PartialWithFieldValue<T>, setOptions?: SetOptions, opts?: {
    paths?: {
        [col: string]: string;
    };
    dates?: boolean;
}): Promise<void>;
export declare function deleteWithCounter<T>(ref: DocumentReference<T>, opts?: {
    paths?: {
        [col: string]: string;
    };
}): Promise<void>;
export declare function expandRef<T>(obs: Observable<T>, fields?: any[]): Observable<T>;
export declare function expandRefs<T>(obs: Observable<T[]>, fields?: any[]): Observable<T[]>;
/**
 *
 * @param param: {
 *  ref - document ref
 *  data - document data
 *  del - boolean - delete past index
 *  useSoundex - index with soundex
 *  docObj - the document object in case of ssr,
 *  soundexFunc - change out soundex function for other languages,
 *  copyFields - field values to copy from original document
 *  searchCol - the collection to store search index
 *  allCol - the search sub collection to store index docs
 *  termField - the document field to store index
 *  numWords - the number of words to index in a phrase
 * }
 * @returns
 */
export declare function searchIndex<T>({ ref, data, indexFields, del, useSoundex, docObj, soundexFunc, copyFields, allCol, searchCol, termField, numWords }: {
    ref: DocumentReference<T>;
    data: any;
    indexFields: string[];
    del?: boolean;
    useSoundex?: boolean;
    docObj?: Document;
    copyFields?: string[];
    soundexFunc?: (s: string) => string;
    allCol?: string;
    searchCol?: string;
    termField?: string;
    numWords?: number;
}): Promise<void>;
/**
 * @param collectionRef - the collection reference
 * @param term - the phrase you're searching
 * @param param: {
 *   searchCol - the search collection indexed
 *   allCol - the sub search collection indexed
 *   idField - the name of the id field to return
 *   termField - the term field that is indexed
 *   soundexFunc - the soundex function to use
 *   filters = other query constraints to add (where, startAt, etc)
 * }
 * @returns search document references
 */
export declare function searchDocs<T>(collectionRef: CollectionReference<T>, term: string, { searchCol, allCol, idField, termField, soundexFunc, filters }?: {
    searchCol?: string | undefined;
    allCol?: string | undefined;
    idField?: string | undefined;
    termField?: string | undefined;
    soundexFunc?: typeof soundex | undefined;
    filters?: never[] | undefined;
}): Promise<T[] | null>;
export declare function createIndex(doc: Document, html: string, n: number): string[];
export declare function soundex(s: string): string;
export declare function snapToData<T = DocumentData>(snapshot: DocumentSnapshot<T>, options?: {
    idField?: string;
}): T | undefined;
export declare function docData<T = DocumentData>(ref: DocumentReference<T>, options?: {
    idField?: string;
}): Observable<T>;
