export interface QueryItem {
  id: string;
  title: string;
  type: 'group' | 'item';
  isEditable?: boolean;
  inputType?: string;
  items?: any[];
  comparator?: any;
  opened?: boolean;
}
