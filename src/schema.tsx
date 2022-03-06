export interface Match {
    UUID: string;
    Players: Player[];
    Games: MatchGame[];
    Summary: MatchSummary;
}

export interface MatchGame {
    ID: string;
    Answer: string;
    Summary: GameSummary;
}

export interface GameSummary {
    Start: End;
    End: End;
    Loudest: Loudest;
    Fastest: Fastest;
    MostAccurate: MostAccurate;
}

export interface End {
    seconds: number;
    nanoseconds: number;
}

export interface Fastest {
    Time: number;
    PlayerID: string;
}

export interface Loudest {
    PlayerID: string;
    Volume: number;
}

export interface MostAccurate {
    PlayerID: string;
    AverageGuessLength: number;
}

export interface Player {
    Games: PlayerGame[];
    Definition: Definition;
    FailedToFinish: boolean;
    Summary: PlayerSummary;
    ID: string;
}

export interface Definition {
    Description: string;
    Name: string;
}

export interface PlayerGame {
    Times: number[];
    TotalTime: number;
    GuessResults: GuessResult[];
    GameID: string;
    Correct: boolean;
    Error: string;
}

export interface GuessResult {
    Result: number[];
    Guess: Guess;
}

export enum Guess {
    Crane = "crane",
}

export interface PlayerSummary {
    TotalVolume: number;
    TotalGuesses: number;
    AverageGuesses: number;
    TotalTime: number;
    GamesWon: number;
}

export interface MatchSummary {
    MostCorrect: MostCorrect;
    MostAccurate: MostAccurate;
    GamesMostAccurate: Games;
    Loudest: Loudest;
    GamesFastest: Games;
    Fastest: Fastest;
    GamesLoudest: Games;
}

export interface Games {
    PlayerID: string;
    Count: number;
}

export interface MostCorrect {
    CorrectGames: number;
    PlayerID: string;
}
