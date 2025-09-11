export interface Props {
  index: number;
  data: {
    large: string;
    medium: string;
    small: string;
    id: number;
  };
  onClick: (index: number) => void;
}
