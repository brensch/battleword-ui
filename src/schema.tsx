export interface Match {
    Games: Game[];
    LettersPerWord: number;
    Players: Player[];
    UUID: string;
    RoundsPerGame: number;
}

export interface Game {
    Answer: string;
    ID: string;
}

export interface Player {
    Definition: Definition;
    GamesPlayed: PlayerGame[];
    ID: string;
}

export interface Definition {
    Description: string;
    Name: string;
}

export interface PlayerGame {
    Error: string;
    GameID: string;
    Correct: boolean;
    GuessDurationsNS: number[];
    GuessResults: GuessResult[];
}

export interface GuessResult {
    Result: number[];
    Guess: string;
}

export interface Solver {
    Definition: SolverDefinition;
    URI: string;
}

export interface SolverDefinition {
    Description: string;
    Name: string;
    ConcurrentConnLimit: number;
}
