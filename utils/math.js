define(function(require) {

// Minify Raphael ourselves because IE8 has a problem with the 1.5.2 minified release
// http://groups.google.com/group/raphaeljs/browse_thread/thread/c34c75ad8d431544
require("../third_party/raphael.js");
var knumber = require("./knumber.js");

$.extend(KhanUtil, {

    // Simplify formulas before display
    cleanMath: function(expr) {
        return typeof expr === "string" ?
            expr.replace(/\+\s*-/g, "- ")
                .replace(/-\s*-/g, "+ ")
                .replace(/\^1/g, "") :
            expr;
    },

    // A simple random number picker
    // Returns a random int in [0, num)
    rand: function(num) {
        return Math.floor(num * KhanUtil.random());
    },

    /* Returns an array of the digits of a nonnegative integer in reverse
     * order: digits(376) = [6, 7, 3] */
    digits: function(n) {
        if (n === 0) {
            return [0];
        }

        var list = [];

        while (n > 0) {
            list.push(n % 10);
            n = Math.floor(n / 10);
        }

        return list;
    },

    // Similar to above digits, but in original order (not reversed)
    integerToDigits: function(n) {
        return KhanUtil.digits(n).reverse();
    },

    // Convert a decimal number into an array of digits (reversed)
    decimalDigits: function(n) {
        var str = "" + Math.abs(n);
        str = str.replace(".", "");

        var list = [];
        for (var i = str.length; i > 0; i--) {
            list.push(str.charAt(i-1));
        }

        return list;
    },

    // Find number of digits after the decimal place
    decimalPlaces: function(n) {
        var str = "" + Math.abs(n);
        str = str.split(".");

        if (str.length === 1) {
            return 0;
        } else {
            return str[1].length;
        }
    },

    digitsToInteger: function(digits) {
        var place = Math.floor(Math.pow(10, digits.length - 1));
        var number = 0;

        $.each(digits, function(index, digit) {
            number += digit * place;
            place /= 10;
        });

        return number;
    },

    padDigitsToNum: function(digits, num) {
        digits = digits.slice(0);
        while (digits.length < num) {
            digits.push(0);
        }
        return digits;
    },

    placesLeftOfDecimal: [$._("one"), $._("ten"), $._("hundred"),
        $._("thousand")],
    placesRightOfDecimal: [$._("one"), $._("tenth"), $._("hundredth"),
        $._("thousandth"),$._("ten thousandth")],

    powerToPlace: function(power) {
        if (power < 0) {
            return KhanUtil.placesRightOfDecimal[-1 * power];
        } else {
            return KhanUtil.placesLeftOfDecimal[power];
        }
    },


    //Adds 0.001 because of floating points uncertainty so it errs on the side of going further away from 0
    roundTowardsZero: function(x) {
        if (x < 0) {
            return Math.ceil(x - 0.001);
        }
        return Math.floor(x + 0.001);
    },

    // Bound a number by 1e-6 and 1e20 to avoid exponents after toString
    bound: function(num) {
        if (num === 0) {
            return num;
        } else if (num < 0) {
            return -KhanUtil.bound(-num);
        } else {
            return Math.max(1e-6, Math.min(num, 1e20));
        }
    },

    factorial: function(x) {
        if (x <= 1) {
            return x;
        } else {
            return x * KhanUtil.factorial(x - 1);
        }
    },

    getGCD: function(a, b) {
        if (arguments.length > 2) {
            var rest = [].slice.call(arguments, 1);
            return KhanUtil.getGCD(a, KhanUtil.getGCD.apply(KhanUtil, rest));
        } else {
            var mod;

            a = Math.abs(a);
            b = Math.abs(b);

            while (b) {
                mod = a % b;
                a = b;
                b = mod;
            }

            return a;
        }
    },

    getLCM: function(a, b) {
        if (arguments.length > 2) {
            var rest = [].slice.call(arguments, 1);
            return KhanUtil.getLCM(a, KhanUtil.getLCM.apply(KhanUtil, rest));
        } else {
            return Math.abs(a * b) / KhanUtil.getGCD(a, b);
        }
    },

    primes: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43,
        47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97],

    denominators: [2, 3, 4, 5, 6, 8, 10, 12, 100],
    smallDenominators: [2, 3, 4, 5, 6, 8, 10, 12],

    getPrime: function() {
        return KhanUtil.primes[KhanUtil.rand(KhanUtil.primes.length)];
    },

    isPrime: function(n) {
        if (n <= 1) {
            return false;
        } else if (n < 101) {
            return !!$.grep(KhanUtil.primes, function(p, i) {
                return Math.abs(p - n) <= 0.5;
            }).length;
        } else {
            if (n <= 1 || n > 2 && n % 2 === 0) {
                return false;
            } else {
                for (var i = 3, sqrt = Math.sqrt(n); i <= sqrt; i += 2) {
                    if (n % i === 0) {
                        return false;
                    }
                }
            }

            return true;
        }

    },

    isOdd: function(n) {
        return n % 2 === 1;
    },

    isEven: function(n) {
        return n % 2 === 0;
    },

    getOddComposite: function(min, max) {
        if (min === undefined) {
            min = 0;
        }

        if (max === undefined) {
            max = 100;
        }

        var oddComposites = [9, 15, 21, 25, 27, 33, 35, 39, 45, 49, 51, 55];
        oddComposites = oddComposites.concat([57, 63, 65, 69, 75, 77, 81, 85, 87, 91, 93, 95, 99]);

        var result = -1;
        while (result < min || result > max) {
            result = oddComposites[KhanUtil.rand(oddComposites.length)];
        }
        return result;
    },

    getEvenComposite: function(min, max) {
        if (min === undefined) {
            min = 0;
        }

        if (max === undefined) {
            max = 100;
        }

        var evenComposites = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26];
        evenComposites = evenComposites.concat([28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48]);
        evenComposites = evenComposites.concat([50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72]);
        evenComposites = evenComposites.concat([74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98]);

        var result = -1;
        while (result < min || result > max) {
            result = evenComposites[KhanUtil.rand(evenComposites.length)];
        }
        return result;
    },

    getComposite: function() {
        if (KhanUtil.randRange(0, 1)) {
            return KhanUtil.getEvenComposite();
        } else {
            return KhanUtil.getOddComposite();
        }
    },

    getPrimeFactorization: function(number) {
        if (number === 1) {
            return [];
        } else if (KhanUtil.isPrime(number)) {
            return [number];
        }

        var maxf = Math.sqrt(number);
        for (var f = 2; f <= maxf; f++) {
            if (number % f === 0) {
                return $.merge(KhanUtil.getPrimeFactorization(f), KhanUtil.getPrimeFactorization(number / f));
            }
        }
    },

    getFactors: function(number) {
        var factors = [],
            ins = function(n) {
                if (_(factors).indexOf(n) === -1) {
                    factors.push(n);
                }
            };

        var maxf2 = number;
        for (var f = 1; f * f <= maxf2; f++) {
            if (number % f === 0) {
                ins(f);
                ins(number / f);
            }
        }
        return KhanUtil.sortNumbers(factors);
    },

    // Get a random factor of a composite number which is not 1 or that number
    getNontrivialFactor: function(number) {
        var factors = KhanUtil.getFactors(number);
        return factors[KhanUtil.randRange(1, factors.length - 2)];
    },

    getMultiples: function(number, upperLimit) {
        var multiples = [];
        for (var i = 1; i * number <= upperLimit; i++) {
            multiples.push(i * number);
        }
        return multiples;
    },

    // splitRadical(24) gives [2, 6] to mean 2 sqrt(6)
    splitRadical: function(n) {
        if (n === 0) {
            return [0, 1];
        }

        var coefficient = 1;
        var radical = n;

        for (var i = 2; i * i <= n; i++) {
            while (radical % (i * i) === 0) {
                radical /= i * i;
                coefficient *= i;
            }
        }

        return [coefficient, radical];
    },

    // splitCube(24) gives [2, 3] to mean 2 cube_root(3)
    splitCube: function(n) {
        if (n === 0) {
            return [0, 1];
        }

        var coefficient = 1;
        var radical = n;

        for (var i = 2; i * i * i <= n; i++) {
            while (radical % (i * i * i) === 0) {
                radical /= i * i * i;
                coefficient *= i;
            }
        }

        return [coefficient, radical];
    },

    // randRange(min, max) - Get a random integer between min and max, inclusive
    // randRange(min, max, count) - Get count random integers
    // randRange(min, max, rows, cols) - Get a rows x cols matrix of random integers
    // randRange(min, max, x, y, z) - You get the point...
    randRange: function(min, max) {
        var dimensions = [].slice.call(arguments, 2);

        if (dimensions.length === 0) {
            return Math.floor(KhanUtil.rand(max - min + 1)) + min;
        } else {
            var args = [min, max].concat(dimensions.slice(1));
            return $.map(new Array(dimensions[0]), function() {
                return [KhanUtil.randRange.apply(null, args)];
            });
        }
    },

    // Get an array of unique random numbers between min and max
    randRangeUnique: function(min, max, count) {
        if (count == null) {
            return KhanUtil.randRange(min, max);
        } else {
            var toReturn = [];
            for (var i = min; i <= max; i++) {
                toReturn.push(i);
            }

            return KhanUtil.shuffle(toReturn, count);
        }
    },

    // Get an array of unique random numbers between min and max,
    // that ensures that none of the integers in the array are 0.
    randRangeUniqueNonZero: function(min, max, count) {
        if (count == null) {
            return KhanUtil.randRangeNonZero(min, max);
        } else {
            var toReturn = [];
            for (var i = min; i <= max; i++) {
                if (i === 0) {
                    continue;
                }
                toReturn.push(i);
            }

            return KhanUtil.shuffle(toReturn, count);
        }
    },

    // Get a random integer between min and max with a perc chance of hitting
    // target (which is assumed to be in the range, but it doesn't have to be).
    randRangeWeighted: function(min, max, target, perc) {
        if (KhanUtil.random() < perc || (target === min && target === max)) {
            return target;
        } else {
            return KhanUtil.randRangeExclude(min, max, [target]);
        }
    },

    // Get a random integer between min and max that is never any of the values
    // in the excludes array.
    randRangeExclude: function(min, max, excludes) {
        var result;

        do {
            result = KhanUtil.randRange(min, max);
        } while (_(excludes).indexOf(result) !== -1);

        return result;
    },

    // Get a random integer between min and max with a perc chance of hitting
    // target (which is assumed to be in the range, but it doesn't have to be).
    // It never returns any of the values in the excludes array.
    randRangeWeightedExclude: function(min, max, target, perc, excludes) {
        var result;

        do {
            result = KhanUtil.randRangeWeighted(min, max, target, perc);
        } while (_(excludes).indexOf(result) !== -1);

        return result;
    },

    // From limits_1
    randRangeNonZero: function(min, max) {
        return KhanUtil.randRangeExclude(min, max, [0]);
    },

    // Returns a random member of the given array
    // If a count is passed, it gives an array of random members of the given array
    randFromArray: function(arr, count) {
        if (count == null) {
            return arr[KhanUtil.rand(arr.length)];
        } else {
            return $.map(new Array(count), function() {
                return KhanUtil.randFromArray(arr);
            });
        }
    },

    // Returns a random member of the given array that is never any of the values
    // in the excludes array.
    randFromArrayExclude: function(arr, excludes) {
        var cleanArr = [];
        for (var i = 0; i < arr.length; i++) {
            if (_(excludes).indexOf(arr[i]) === -1) {
                cleanArr.push(arr[i]);
            }
        }
        return KhanUtil.randFromArray(cleanArr);
    },

    // Round a number to the nearest increment
    // E.g., if increment = 30 and num = 40, return 30. if increment = 30 and num = 45, return 60.
    roundToNearest: function(increment, num) {
        return Math.round(num / increment) * increment;
    },

    // Round a number to a certain number of decimal places
    roundTo: function(precision, num) {
        var factor = Math.pow(10, precision).toFixed(5);
        return Math.round((num * factor).toFixed(5)) / factor;
    },

    /**
     * Return a string of num rounded to a fixed precision decimal places,
     * with an approx symbol if num had to be rounded, and trailing 0s
     */
    toFixedApprox: function(num, precision) {
        // TODO(jack): Make this locale-dependent like
        // KhanUtil.localeToFixed
        var fixedStr = num.toFixed(precision);
        if (knumber.equal(+fixedStr, num)) {
            return fixedStr;
        } else {
            return "\\approx " + fixedStr;
        }
    },

    /**
     * Return a string of num rounded to precision decimal places, with an
     * approx symbol if num had to be rounded, but no trailing 0s if it was
     * not rounded.
     */
    roundToApprox: function(num, precision) {
        var fixed = KhanUtil.roundTo(precision, num);
        if (knumber.equal(fixed, num)) {
            return String(fixed);
        } else {
            return KhanUtil.toFixedApprox(num, precision);
        }
    },

    floorTo: function(precision, num) {
        var factor = Math.pow(10, precision).toFixed(5);
        return Math.floor((num * factor).toFixed(5)) / factor;
    },

    ceilTo: function(precision, num) {
        var factor = Math.pow(10, precision).toFixed(5);
        return Math.ceil((num * factor).toFixed(5)) / factor;
    },

    // toFraction(4/8) => [1, 2]
    // toFraction(0.666) => [333, 500]
    // toFraction(0.666, 0.001) => [2, 3]
    //
    // tolerance can't be bigger than 1, sorry
    toFraction: function(decimal, tolerance) {
        if (tolerance == null) {
            tolerance = Math.pow(2, -46);
        }

        if (decimal < 0 || decimal > 1) {
            var fract = decimal % 1;
            fract += (fract < 0 ? 1 : 0);

            var nd = KhanUtil.toFraction(fract, tolerance);
            nd[0] += Math.round(decimal - fract) * nd[1];
            return nd;
        } else if (Math.abs(Math.round(Number(decimal)) - decimal) <= tolerance) {
            return [Math.round(decimal), 1];
        } else {
            var loN = 0, loD = 1, hiN = 1, hiD = 1, midN = 1, midD = 2;

            while (1) {
                if (Math.abs(Number(midN / midD) - decimal) <= tolerance) {
                    return [midN, midD];
                } else if (midN / midD < decimal) {
                    loN = midN;
                    loD = midD;
                } else {
                    hiN = midN;
                    hiD = midD;
                }

                midN = loN + hiN;
                midD = loD + hiD;
            }
        }
    },

    // Returns the format (string) of a given numeric string
    // Note: purposively more inclusive than answer-types' predicate.forms
    // That is, it is not necessarily true that interpreted input are numeric
    getNumericFormat: function(text) {
        text = $.trim(text);
        text = text.replace(/\u2212/, "-").replace(/([+-])\s+/g, "$1");
        if (text.match(/^[+-]?\d+$/)) {
            return "integer";
        } else if (text.match(/^[+-]?\d+\s+\d+\s*\/\s*\d+$/)) {
            return "mixed";
        }
        var fraction = text.match(/^[+-]?(\d+)\s*\/\s*(\d+)$/);
        if (fraction) {
            return parseFloat(fraction[1]) > parseFloat(fraction[2]) ?
                    "improper" : "proper";
        } else if (text.replace(/[,. ]/g, "").match(/^\d+$/)) {
            return "decimal";
        } else if (text.match(/(pi?|\u03c0|t(?:au)?|\u03c4|pau)/)) {
            return "pi";
        } else {
            return null;
        }
    },


    // Returns a string of the number in a specified format
    toNumericString: function(number, format) {
        if (number == null) {
            return "";
        } else if (number === 0) {
            return "0"; // otherwise it might end up as 0% or 0pi
        }

        if (format === "percent") {
            return number * 100 + "%";
        }

        if (format === "pi") {
            var fraction = knumber.toFraction(number / Math.PI);
            var numerator = Math.abs(fraction[0]), denominator = fraction[1];
            if (knumber.isInteger(numerator)) {
                var sign = number < 0 ? "-" : "";
                var pi = "\u03C0";
                return sign + (numerator === 1 ? "" : numerator) + pi +
                    (denominator === 1 ? "" : "/" + denominator);
            }
        }

        if (_(["proper", "improper", "mixed", "fraction"]).contains(format)) {
            var fraction = knumber.toFraction(number);
            var numerator = Math.abs(fraction[0]), denominator = fraction[1];
            var sign = number < 0 ? "-" : "";
            if (denominator === 1) {
                return sign + numerator; // for integers, irrational, d > 1000
            } else if (format === "mixed") {
                var modulus = numerator % denominator;
                var integer = (numerator - modulus) / denominator;
                return sign + (integer ? integer + " " : "") +
                        modulus + "/" + denominator;
            } // otherwise proper, improper, or fraction
            return sign + numerator + "/" + denominator;
        }

        // otherwise (decimal, float, long long)
        return String(number);
    },

    // Shuffle an array using a Fischer-Yates shuffle
    // If count is passed, returns an random sublist of that size
    shuffle: function(array, count) {
        array = [].slice.call(array, 0);
        var beginning = typeof count === "undefined" || count > array.length ? 0 : array.length - count;

        for (var top = array.length; top > beginning; top--) {
            var newEnd = Math.floor(KhanUtil.random() * top),
                tmp = array[newEnd];

            array[newEnd] = array[top - 1];
            array[top - 1] = tmp;
        }

        return array.slice(beginning);
    },

    sortNumbers: function(array) {
        return array.slice(0).sort(function(a, b) {
            return a - b;
        });
    },

    // From limits_1
    truncate_to_max: function(num, digits) {
        return parseFloat(num.toFixed(digits));
    },

    // Checks if a number or string representation thereof is an integer
    isInt: function(num) {
        return parseFloat(num) === parseInt(num, 10) && !isNaN(num);
    },


    /**
     * Add LaTeX color markup to a given value.
     */
    colorMarkup: function(val, color) {
        return "\\color{" + color + "}{" + val + "}";
    },

    /**
     * Like _.contains except using _.isEqual to verify if item is present.
     * (Works for lists of non-primitive values.)
     */
    contains: function(list, item) {
        return _.any(list, function(elem) {
            if (_.isEqual(item, elem)) {
                return true;
            }
            return false;
        });
    },

    BLUE: "#6495ED",
    ORANGE: "#FFA500",
    PINK: "#FF00AF",
    GREEN: "#28AE7B",
    PURPLE: "#9D38BD",
    RED: "#DF0030",
    GRAY: "gray",
    BLACK: "black",
    LIGHT_BLUE: "#9AB8ED",
    LIGHT_ORANGE: "#EDD19B",
    LIGHT_PINK: "#ED9BD3",
    LIGHT_GREEN: "#9BEDCE",
    LIGHT_PURPLE: "#DA9BED",
    LIGHT_RED: "#ED9AAC",
    LIGHT_GRAY: "#ED9B9B",
    LIGHT_BLACK: "#ED9B9B",
    GRAY10: "#D6D6D6",
    GRAY20: "#CDCDCD",
    GRAY30: "#B3B3B3",
    GRAY40: "#9A9A9A",
    GRAY50: "#808080",
    GRAY60: "#666666",
    GRAY70: "#4D4D4D",
    GRAY80: "#333333",
    GRAY90: "#1A1A1A",
    BLUE_A: "#C7E9F1",
    BLUE_B: "#9CDCEB",
    BLUE_C: "#58C4DD",
    BLUE_D: "#29ABCA",
    BLUE_E: "#1C758A",
    TEAL_A: "#ACEAD7",
    TEAL_B: "#76DDC0",
    TEAL_C: "#5CD0B3",
    TEAL_D: "#55C1A7",
    TEAL_E: "#49A88F",
    GREEN_A: "#C9E2AE",
    GREEN_B: "#A6CF8C",
    GREEN_C: "#83C167",
    GREEN_D: "#77B05D",
    GREEN_E: "#699C52",
    GOLD_A: "#F7C797",
    GOLD_B: "#F9B775",
    GOLD_C: "#F0AC5F",
    GOLD_D: "#E1A158",
    GOLD_E: "#C78D46",
    RED_A: "#F7A1A3",
    RED_B: "#FF8080",
    RED_C: "#FC6255",
    RED_D: "#E65A4C",
    RED_E: "#CF5044",
    MAROON_A: "#ECABC1",
    MAROON_B: "#EC92AB",
    MAROON_C: "#C55F73",
    MAROON_D: "#A24D61",
    MAROON_E: "#94424F",
    PURPLE_A: "#CAA3E8",
    PURPLE_B: "#B189C6",
    PURPLE_C: "#9A72AC",
    PURPLE_D: "#715582",
    PURPLE_E: "#644172",
    MINT_A: "#F5F9E8",
    MINT_B: "#EDF2DF",
    MINT_C: "#E0E5CC",
    GRAY_A: "#FDFDFD",
    GRAY_B: "#F7F7F7",
    GRAY_C: "#EEEEEE",
    GRAY_D: "#DDDDDD",
    GRAY_E: "#CCCCCC",
    GRAY_F: "#AAAAAA",
    GRAY_G: "#999999",
    GRAY_H: "#555555",
    GRAY_I: "#333333",
    KA_BLUE: "#314453",
    KA_GREEN: "#639B24",
    // Don't actually use _BACKGROUND! Make things transparent instead. The
    // background color used in exercises is subject to change at the whim
    // of fickle designers.
    _BACKGROUND: "#FDFDFD"  // TODO(eater): Get rid of this altogether.
});

// For consistent coloring throughout Perseus
$.extend(KhanUtil, {
    INTERACTING: KhanUtil.ORANGE,
    INTERACTIVE: KhanUtil.ORANGE,
    DYNAMIC: KhanUtil.BLUE
});

});
