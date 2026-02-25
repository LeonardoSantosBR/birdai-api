import { whereGlobal } from 'src/common';
import { optType } from 'src/types';
import { querySearchBird } from 'src/modules/birds/querys';

export const birds_filter = (query: querySearchBird) => {
  const opt: any = {
    name: {
      value: query?.search,
      type: optType.stringLike,
      path: 'name',
    },
    cientific_name: {
      value: query?.search,
      type: optType.stringLike,
      path: 'cientific_name',
    },
  };

  return whereGlobal(opt);
};
