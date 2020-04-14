/**
 * @file Домашка по FP ч. 2
 * 
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 * 
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 * 
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import { 
    tap,
    pipe,
    gt,
    lt,
    length,
    has,
    __,
    allPass,
    match,
    replace,
    pipeWith,
    applySpec,
    prop,
    partialRight,
    mathMod,
    curry,
    cond,
    isNil,
    not,
    ifElse
} from 'ramda';

const api = new Api();

/**
 * Я – пример, удали меня
 */
// const wait = time => new Promise(resolve => {
//     setTimeout(resolve, time);
// })

const validateValue = (value) => {
    const checkLength = pipe(
        length,
        allPass([gt(__, 2), lt(__, 10)])
    );

    const checkNumber = pipe(
        match(/^[0-9]+\.?[0-9]+$/g),
        length,
        gt(__, 0)
    );

    const checkPositive = pipe(
        Number,
        gt(__, 0)
    );

    return pipe(
        replace(',', ''),
        allPass([checkLength, checkNumber, checkPositive])
    )(value);
}

const toNumber = (value) => {
    return pipe(
        replace(',', '.'),
        Number,
        Math.round
    )(value);
}

const double = partialRight(Math.pow, [2]);

const convertNum = api.get('https://api.tech/numbers/base');
const getAnimal = (id) => api.get(`https://animals.tech/${id}`, {});


const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    if (!validateValue(value)) {
        handleError('ValidationError');
        return;
    }

    const constructRequestParams = applySpec({
        from: () => 10,
        to: () => 2,
        number: (x) => x
      });

    const asyncPipe = pipeWith(
        (fn, res) => (res && res.then) ?
            res.then(fn)
               .catch((err) => {handleError(err)})
            : fn(res)
    );
    
    const convertToBinary = pipe(
        tap(writeLog),
        constructRequestParams,
        convertNum
    );

    const convertNumForAnimal = pipe(
        tap(writeLog),
        length,
        tap(writeLog),
        double,
        tap(writeLog),
        mathMod(__, 3),
        tap(writeLog),
    );

    asyncPipe([
        toNumber,
        convertToBinary,
        ifElse(
            has('result'),
            asyncPipe([
                prop('result'),
                convertNumForAnimal,
                getAnimal,
                ifElse(
                    has('result'),
                    pipe(
                        prop('result'),
                        tap(writeLog),
                        handleSuccess
                    ),
                    handleError
                )
            ]),
            handleError
        )
    ])(value);

    
}

export default processSequence;
