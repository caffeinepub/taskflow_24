import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;

export enum ProductCategory {
    Cleanser = "Cleanser",
    Toner = "Toner",
    Serum = "Serum",
    Moisturizer = "Moisturizer",
    SPF = "SPF",
    Other = "Other"
}

export enum RoutineType {
    Morning = "Morning",
    Evening = "Evening"
}

export enum SkinType {
    All = "All",
    Oily = "Oily",
    Dry = "Dry",
    Combination = "Combination",
    Sensitive = "Sensitive"
}

export interface Product {
    id: bigint;
    name: string;
    brand: string;
    category: ProductCategory;
    notes: string;
}

export interface RoutineStep {
    productId: bigint;
    instructions: string;
    order: bigint;
}

export interface JournalEntry {
    id: bigint;
    date: string;
    skinCondition: bigint;
    notes: string;
    concerns: string;
    createdAt: bigint;
}

export interface Tip {
    id: bigint;
    title: string;
    content: string;
    skinType: SkinType;
}

export interface backendInterface {
    addProduct(name: string, brand: string, category: ProductCategory, notes: string): Promise<bigint>;
    getAllProducts(): Promise<Array<Product>>;
    updateProduct(id: bigint, name: string, brand: string, category: ProductCategory, notes: string): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    setRoutine(routineType: RoutineType, steps: Array<RoutineStep>): Promise<void>;
    getRoutine(routineType: RoutineType): Promise<Array<RoutineStep>>;
    addJournalEntry(date: string, skinCondition: bigint, notes: string, concerns: string): Promise<bigint>;
    getAllJournalEntries(): Promise<Array<JournalEntry>>;
    deleteJournalEntry(id: bigint): Promise<void>;
    getTips(): Promise<Array<Tip>>;
}
