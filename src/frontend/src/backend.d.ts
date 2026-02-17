import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Scoreboard {
    team1Score: bigint;
    team2Icon: TeamIcon;
    team2Score: bigint;
    team1Icon: TeamIcon;
}
export type Time = bigint;
export interface FlagEvent {
    team: string;
    timestamp: Time;
    reason: string;
}
export interface Event {
    flagEvent?: FlagEvent;
    description: string;
    timestamp: Time;
    eventType: EventType;
}
export enum EventType {
    flag = "flag",
    point = "point"
}
export enum TeamIcon {
    dolphin = "dolphin",
    tornado = "tornado",
    fist = "fist",
    bullfrog = "bullfrog"
}
export interface backendInterface {
    addEvent(sessionCode: string, description: string, eventType: EventType): Promise<void>;
    addFlagEvent(sessionCode: string, team: string, reason: string): Promise<void>;
    clearFlagOverlays(sessionCode: string): Promise<void>;
    endSession(sessionCode: string): Promise<void>;
    getActiveFlagOverlays(sessionCode: string): Promise<Array<FlagEvent>>;
    getEvents(sessionCode: string): Promise<Array<Event>>;
    getScoreboard(sessionCode: string): Promise<Scoreboard>;
    getSessionMetadata(sessionCode: string): Promise<[string, Time, Time | null]>;
    isValidSessionCode(sessionCode: string): Promise<boolean>;
    startSession(broadcaster: string, sessionCode: string): Promise<void>;
    updateScoreboard(sessionCode: string, team1Score: bigint, team2Score: bigint, team1Icon: TeamIcon, team2Icon: TeamIcon): Promise<void>;
}
