# @typeservice/tcc

[![codecov](https://codecov.io/gh/typeservice/tcc/branch/master/graph/badge.svg)](https://codecov.io/gh/typeservice/tcc)

TCC (Try-Ack-Cancel) is called a two-stage compensation transaction. The first phase attempts to reserve resources. The second phase must clearly tell the service provider whether this resource is needed or not. Cancel, used to clear the impact of the first phase, so called compensation transactions.

## Installing

For the latest stable version:

```bash
$ npm install @typeservice/tcc
```

## Usage

```ts
import * as Tcc from '@typeservice/tcc';
app.use(Tcc.Middleware());
```

It has 4 events:

- `commit` 成功提交事件
- `rollback` 回滚事件
- `error` 出错事件
- `end` 结束事件

```ts
ctx.tcc.on('commit', async () => {});
ctx.tcc.on('rollback', async () => {});
ctx.tcc.on('error', async (e: Error) => {});
ctx.tcc.on('end', async () => {});
```

# License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2019-present, yunjie (Evio) shen
