export interface OptionList {
    id: number;
    text: string;

}

export interface SendQuestion {
    type:string;
    quiz: string;
    questionText: string;
    optionColumn?: string[] | null;
    optionFront?: {
        leftOption: string[];
        rightOption: string[];
    } | null;
    optionRow?: string[];
} 

export interface SendQuestionColumn_Row {
    type:string;
    quiz: string;
    questionText: string;
    options: string[];
} 
export interface SendQuestionFront {
    type:string;
    quiz: string;
    questionText: string;
    options: {
        leftOption: string[];
        rightOption: string[];
    };
} 

export interface DisplayQuestion {
    id:string;
    text: string;
    type: string;
} 

export type CreateQuestion = SendQuestionColumn_Row | SendQuestionFront;