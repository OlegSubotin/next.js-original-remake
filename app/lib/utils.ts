import { Income } from './definitions';

/**
 * Formats a given amount in cents into a currency string (USD).
 * @param {number} amount - The amount to be formatted.
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

/**
 * Formats a date string to a localized date format.
 * @param {string} dateStr - The date string to be formatted.
 * @param {string} locale - The locale to be used for formatting (default is 'en-US').
 * @returns {string} The formatted date string.
 */
export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

/**
 * Generates Y-axis labels and the top label for a given set of income data.
 * @param {Income[]} income - An array of income data.
 * @returns {object} An object containing Y-axis labels and the top label.
 */
export const generateYAxis = (income: Income[]) => {
  const yAxisLabels = [];
  const highestRecord = Math.max(...income.map((month) => month.income));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

/**
 * Generates pagination links based on the current page and total number of pages.
 * @param {number} currentPage - The current page.
 * @param {number} totalPages - The total number of pages.
 * @returns {Array<number|string>} An array representing pagination links.
 */
export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
