import { monthArray } from './utils.js';

export function getYear(dateString) {
  return dateString.slice(0, 4);
}

export function getMonth(dateString) {
  return dateString.slice(5, 7);
}

export function getNextMonth(dateString) {
  let year = getYear(dateString);
  let month = getMonth(dateString);
  let nextMonth;

  if (Number(month) !== 12) {
    nextMonth = Number(month) + 1;
    if (nextMonth < 10) {
      nextMonth = `0${nextMonth}`;
    }

    return `${year}-${nextMonth}`;
  } else {
    nextMonth = '01';
    let nextYear = Number(year) + 1;

    return `${nextYear}-${nextMonth}`;
  }
}

export function getPrevMonth(dateString) {
  let year = getYear(dateString);
  let month = getMonth(dateString);
  let prevMonth;

  if (Number(month) !== 1) {
    prevMonth = Number(month) - 1;
    if (prevMonth < 10) {
      prevMonth = `0${prevMonth}`;
    }

    return `${year}-${prevMonth}`;
  } else {
    prevMonth = '12';
    let prevYear = Number(year) - 1;

    return `${prevYear}-${prevMonth}`;
  }
}

export function getPeriodStartString(monthQuantity) {
  monthQuantity = monthQuantity - 1;
  let startYear;
  let startMounth;
  const today = new Date().toISOString();
  const todayMonth = getMonth(today);
  const todayYear = getYear(today);

  if (Number(todayMonth) <= monthQuantity) {
    startYear = todayYear - 1;
    const restMonthQuantity = monthQuantity - todayMonth;
    startMounth = 12 - restMonthQuantity;
  } else {
    startYear = todayYear;
    startMounth = todayMonth - monthQuantity;
  }

  if (startMounth < 10) {
    startMounth = `0${startMounth}`;
  }

  return `${startYear}-${startMounth}`;
}

export function getLabelsArray(userDataObj) {
  let labels = [];
  for (const key of Object.keys(userDataObj)) {
    const monthIndex = getMonth(key);
    labels.push(monthArray[monthIndex]);
  }

  return labels;
}

export function getSuggestedMax(userDataObj) {
  let values = [];
  for (const value of Object.values(userDataObj)) {
    values.push(Number(value));
  }
  const max = Math.max.apply(null, values);

  return max;
}

export function getSuggestedStackedMax(userDataObj) {
  const valuesIn = Object.values(userDataObj.in);
  const valuesOut = Object.values(userDataObj.out);
  let values = [];
  for (let i = 0; i < valuesIn.length; i++) {
    const value = Number(valuesIn[i]) + Number(valuesOut[i]);
    values.push(Number(value).toFixed(2));
  }
  const max = Math.max.apply(null, values);

  return max;
}

export function getTransactionsMax(userDataObj) {
  const valuesIn = Object.values(userDataObj.in);
  const valuesOut = Object.values(userDataObj.out);
  const length = valuesIn.length;
  for (let i = 0; i < length; i++) {
    valuesIn.push(valuesOut[i]);
  }
  const max = Math.max.apply(null, valuesIn);

  return max;
}
