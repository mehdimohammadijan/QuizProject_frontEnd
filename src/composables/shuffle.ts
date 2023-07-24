import { ref } from 'vue';
import { FrontOption, ColumnRowOption } from '../types/Question'
type OptionType = FrontOption[] | ColumnRowOption[];
const shuffleArray = () => {
    const shuffle = (arr: OptionType) => {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
  return {
    shuffle
  };
};

export default shuffleArray;