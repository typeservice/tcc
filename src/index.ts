import * as Koa from 'koa';
import { EventEmitter } from '@typeservice/core';

export type Context = {
  tcc: Tcc
};

class Tcc extends EventEmitter {
  stash(callback: () => Promise<any>) {
    this.on('rollback', callback);
    return this;
  }

  commit() {
    return this.emit('commit');
  }

  rollback() {
    return this.lookup('rollback');
  }
}

export function Middleware() {
  return async (ctx: Context & Koa.Context, next: Function) => {
    let done = false;
    const tcc = new Tcc();
    Object.defineProperty(ctx, 'tcc', { value: tcc });
    try {
      await next();
      done = true;
      await ctx.tcc.commit();
    } catch(e) {
      if (!done) {
        await ctx.tcc.rollback();
      }
      await ctx.tcc.sync('error', e);
    } finally {
      await ctx.tcc.sync('end');
    }
  }
}