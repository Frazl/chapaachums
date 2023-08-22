import { PaliaItem } from "./items"

export const NpcIDs = ["Ashura",
    "Auni",
    "Badruu",
    "Caleri",
    "Chayne",
    "Delaila",
    "Einar",
    "Elouisa",
    "Eshe",
    "Hassian",
    "Hekla",
    "Hodari",
    "Jel",
    "Jina",
    "Kenli",
    "Kenyatta",
    "Nai'o",
    "Najuma",
    "Reth",
    "Sifuu",
    "Tamala",
    "Tish",
    "Zeki"] as const

export type NpcID = typeof NpcIDs[number]

export interface NPC {
    name: NpcID
    likes: PaliaItem[]
    loves: PaliaItem[]
}

export const ALL_NPCS: NPC[] = NpcIDs.map((id: NpcID) => { return ({ name: id, likes: [], loves: [] }) })