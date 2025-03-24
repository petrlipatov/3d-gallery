export interface Props {
  index: number;
  data: {
    large: string;
    medium: string;
    small: string;
  };
  isDragged: boolean;
  onClick: (index: number) => void;
}
