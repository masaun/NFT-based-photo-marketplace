import assertions from './helpers/assertions';
import assertRevert from './helpers/assertRevert';
import shouldBehaveLikeOwnable from './behaviors/Ownable';
declare const helpers: {
    assertions: typeof assertions;
    assertRevert: typeof assertRevert;
    assertEvent: {
        inLogs: (logs: any, eventName: string, eventArgs?: any) => any;
        inTransaction: (tx: any, eventName: string, eventArgs?: {}) => Promise<any>;
    };
};
declare const behaviors: {
    shouldBehaveLikeOwnable: typeof shouldBehaveLikeOwnable;
};
export { helpers, behaviors };
