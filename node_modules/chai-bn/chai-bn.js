module.exports = function (BN) {
  const isEqualTo = BN.prototype.eq;
  const isGreaterThan = BN.prototype.gt;
  const isGreaterThanOrEqualTo = BN.prototype.gte;
  const isLessThan = BN.prototype.lt;
  const isLessThanOrEqualTo = BN.prototype.lte;
  const isNegative = BN.prototype.isNeg;
  const isZero = BN.prototype.isZero;

  return function (chai, utils) {
    // The 'bignumber' property sets the 'bignumber' flag, enabling the custom overrides
    chai.Assertion.addProperty('bignumber', function () {
      utils.flag(this, 'bignumber', true);
    });

    // BN objects created using different (compatible) instances of BN can be used via BN.isBN()
    const isBN = function (object) {
      return object instanceof BN || BN.isBN(object);
    };

    const convert = function (value) {
      if (isBN(value)) {
        return value;
      } else if (typeof value === 'string') {
        return new BN(value);
      // BN also supports conversion from e.g. JavaScript numbers, but only for small values. We disable that entirely
      } else {
        new chai.Assertion(value).assert(false,
          'expected #{act} to be an instance of BN or string');
      }
    };

    const assertIsBN = function (value) {
      if (!isBN(value)) {
        new chai.Assertion(value).assert(
          false,
          'expected #{act} to be an instance of BN'
        );
      }
    };

    // Overwrites the assertion performed by multiple methods (which should be aliases) with a new function. Prior to
    // calling said function, we assert that the actual value is a BN, and attempt to convert all other arguments to BN.
    const overwriteMethods = function (methodNames, newAssertion) {
      function overwriteMethod (originalAssertion) {
        return function (value, sarasa) {
          if (utils.flag(this, 'bignumber')) {
            const actual = this._obj;
            assertIsBN(actual);

            newAssertion.apply(this, [actual].concat([].slice.call(arguments).map(convert)));
          } else {
            originalAssertion.apply(this, arguments);
          }
        };
      }

      methodNames.forEach(methodName =>
        chai.Assertion.overwriteMethod(methodName, overwriteMethod)
      );
    };

    // Overwrites the assertion performed by multiple properties (which should be aliases) with a new function. Prior to
    // calling said function, we assert that the actual value is a BN.
    const overwriteProperties = function (propertyNames, newAssertion) {
      function overwriteProperty (originalAssertion) {
        return function () {
          if (utils.flag(this, 'bignumber')) {
            const actual = this._obj;
            assertIsBN(actual);

            newAssertion.apply(this, [actual]);
          } else {
            originalAssertion.call(this);
          }
        };
      }

      propertyNames.forEach(propertyName =>
        chai.Assertion.overwriteProperty(propertyName, overwriteProperty)
      );
    };

    // BN.eq
    overwriteMethods(['equal', 'equals', 'eq'], function (actual, expected) {
      this.assert(
        isEqualTo.bind(expected)(actual),
        'expected #{act} to equal #{exp}',
        'expected #{act} to be different from #{exp}',
        expected.toString(),
        actual.toString()
      );
    });

    // BN.gt
    overwriteMethods(['above', 'gt', 'greaterThan'], function (actual, expected) {
      this.assert(
        isGreaterThan.bind(actual)(expected),
        'expected #{act} to be greater than #{exp}',
        'expected #{act} to be less than or equal to #{exp}',
        expected.toString(),
        actual.toString()
      );
    });

    // BN.gte
    overwriteMethods(['least', 'gte'], function (actual, expected) {
      this.assert(
        isGreaterThanOrEqualTo.bind(actual)(expected),
        'expected #{act} to be greater than or equal to #{exp}',
        'expected #{act} to be less than #{exp}',
        expected.toString(),
        actual.toString()
      );
    });

    // BN.lt
    overwriteMethods(['below', 'lt', 'lessThan'], function (actual, expected) {
      this.assert(
        isLessThan.bind(actual)(expected),
        'expected #{act} to be less than #{exp}',
        'expected #{act} to be greater than or equal to #{exp}',
        expected.toString(),
        actual.toString()
      );
    });

    // BN.lte
    overwriteMethods(['most', 'lte'], function (actual, expected) {
      this.assert(
        isLessThanOrEqualTo.bind(actual)(expected),
        'expected #{act} to be less than or equal to #{exp}',
        'expected #{act} to be greater than #{exp}',
        expected.toString(),
        actual.toString()
      );
    });

    // Equality with tolerance, using gte and lte
    overwriteMethods(['closeTo'], function (actual, expected, delta) {
      this.assert(
        isGreaterThanOrEqualTo.bind(actual)(expected.sub(delta)) && isLessThanOrEqualTo.bind(actual)(expected.add(delta)),
        `expected #{act} to be within '${delta}' of #{exp}`,
        `expected #{act} to be further than '${delta}' from #{exp}`,
        expected.toString(),
        actual.toString()
      )
    });

    // BN.isNeg
    overwriteProperties(['negative'], function (value) {
      this.assert(
        isNegative.bind(value)(),
        'expected #{this} to be negative',
        'expected #{this} to not be negative',
        value.toString()
      );
    });

    // BN.isZero
    overwriteProperties(['zero'], function (value) {
      this.assert(
        isZero.bind(value)(),
        'expected #{this} to be zero',
        'expected #{this} to not be zero',
        value.toString()
      );
    });
  };
};
