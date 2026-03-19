import { whereGlobal } from 'src/common';
import { querySearchHabitats } from 'src/modules/habitats/querys';
import { optType } from 'src/types';

export const habitats_filter = (query: querySearchHabitats) => {
  const opt: any = {
    name: {
      value: query?.search,
      type: optType.stringLike,
      path: 'name',
    },
  };

  return whereGlobal(opt);
};
