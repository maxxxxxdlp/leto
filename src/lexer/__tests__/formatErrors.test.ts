import { formatErrors, formatPosition } from '../formatErrors.js';
import { theories } from '../../tests/utils.js';
import { cretePositionResolver } from '../../utils/resolvePosition.js';

const positionResolver = cretePositionResolver(`
Example
Text
Here
`);

theories(formatErrors, [
  [
    [
      [
        {
          start: 3,
          end: 10,
          message: 'Error message',
        },
      ],
      positionResolver,
    ],
    'FATAL [2,3]-[3,2]: Error message',
  ],
  [
    [
      [
        { start: 3, end: 10, message: 'Error message' },
        {
          start: 1,
          end: 20,
          message: 'Error message #2',
        },
      ],
      positionResolver,
    ],
    'FATAL [2,3]-[3,2]: Error message\nFATAL [2,1]-[5,1]: Error message #2',
  ],
]);

theories(formatPosition, [[[{ lineNumber: 3, columnNumber: 5 }], '[3,5]']]);
