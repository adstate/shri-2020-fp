/**
 * @file Домашка по FP ч. 1
 * 
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

const { 
    propEq,
    allPass,
    props,
    equals,
    compose,
    filter,
    length,
    partial,
    partialRight,
    gt,
    values,
    converge,
    reject,
    prop,
    not,
    __,
    none,
    uniq,
    lte,
    gte,
    pipe,
    where,
    groupWith,
    map,
    complement,
    all
  } = require('ramda');

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (opts) => {
    const starIsRed = propEq('star', 'red');
    const squareIsGreed = propEq('square', 'green');
    const circleIsWhite = propEq('circle', 'white');
    const triangleISWhite = propEq('triangle', 'white');
  
    return allPass([
        starIsRed,
        squareIsGreed,
        circleIsWhite,
        triangleISWhite
      ])(opts);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (opts) => {
    return pipe(
      values,
      filter(equals('green')),
      length,
      gt(__, 1)
    )(opts);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (opts) => {
    const isRedFigure = equals('red');
    const isBlueFigure = equals('blue');

    const colors = values(opts);

    const redFigures = filter(isRedFigure, colors);
    const blueFigures = filter(isBlueFigure, colors);

    return equals(length(redFigures), length(blueFigures));
};

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = (opts) => {
    return where({
        star: equals("red"),
        square: equals("orange"),
        circle: equals("blue")
    })(opts);
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (opts) => {
    const isNotWhite = complement(equals('white'));
    const colors = filter(isNotWhite, values(opts));
    const group = groupWith(equals, colors);
    const counts = map(length, group);
    const filterCount = filter(gt(__, 2), counts);

    return gt(length(filterCount), 0);
};

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = (opts) => {
    const isGreen = equals('green');
    const isRed = equals('red');
    const containGreenTriangle = where({
        triangle: isGreen
    });

    const checkGreenFigures = pipe(
        filter(isGreen),
        values,
        length,
        equals(2)
    );

    const checkRedFigure = pipe(
        filter(isRed),
        values,
        length,
        equals(1)
    );

    return allPass([
        checkGreenFigures,
        checkRedFigure,
        containGreenTriangle
    ])(opts);
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (opts) => {
    return pipe(
        values,
        all(equals('orange'))
    )(opts);
};

// 8. Не красная и не белая звезда.
export const validateFieldN8 = (opts) => {
    const isNotWhite = complement(equals('white'));
    const isNotRed = complement(equals('red'));

    const containNotWhiteStar = where({
        star: isNotWhite
    });

    const containNotRedStar = where({
        star: isNotRed
    });

    return allPass([
        containNotWhiteStar,
        containNotRedStar
    ])(opts);
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = (opts) => {
    return pipe(
        values,
        all(equals('green'))
    )(opts);
};

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = (opts) => {
    const getColors = props(['triangle', 'square']);

    const checkSameColor = pipe(
        getColors,
        uniq,
        length,
        equals(__, 1)
    );

    const checkNotWhite = pipe(
        getColors,
        none(equals('white'))
    );

    return allPass([
        checkSameColor,
        checkNotWhite
    ])(opts);
};
