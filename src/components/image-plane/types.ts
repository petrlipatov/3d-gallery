export interface Props {
  index: number;
  data: {
    large: string;
    medium: string;
    small: string;
    id: number;
  };
  isDragged: boolean;
  onClick: (index: number) => void;
}
