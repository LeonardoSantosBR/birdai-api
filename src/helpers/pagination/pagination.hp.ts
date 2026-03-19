/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export const pagination_helper = (
  page: number,
  limit: number,
  count: number,
  rows: any,
) => {
  return {
    pagination: {
      page: page ? Number(page) : 1,
      lastPage: limit ? Math.ceil(count / limit) : 1,
      totalQuantity: count,
    },
    count: count,
    rows: rows,
  };
};
