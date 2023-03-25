export interface Practice {
    title: string;
    description: string
}
export interface FullDetailPractice {
    opt: string;
    id: string;
    title: string;
    description: string;

}
export interface SelectedQuiz {
    id: string;
    title: string;
}
export interface RecievedQuiz {
    id: string;
    title: string;
    description: string;
    createAt: Date;
}