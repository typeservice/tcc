import axios from 'axios';
import Koa from '@typeservice/koa';
import * as Tcc from '../src';

const app = new Koa<any, Tcc.Context & { a: number }>(8000);
app.use(Tcc.Middleware());
app.use(async (ctx, next) => {
  ctx.tcc.on('error', async e => {
    ctx.status = 500;
    ctx.body = e.message;
  })
  if (ctx.url === '/error') {
    ctx.a = 1;
    ctx.tcc.stash(async () => ctx.a = 2);
    throw new Error('test error');
  } else if (ctx.url === '/half') {
    ctx.tcc.on('commit', async () => {
      throw new Error('v test');
    });
  } else {
    ctx.tcc.on('commit', async () => {});
    ctx.body = 'ok';
  }
})
app.httpBootstrap();

beforeAll(() => app.listen());
afterAll(() => app.close());

describe('TypeService koa frameworker unit tests', () => {
  test('error test', done => {
    axios.get('http://127.0.0.1:8000/error')
    .catch(e => {
      expect(e.response.status).toEqual(500);
      expect(e.response.data).toBe('test error');
    })
    .finally(done)
  });

  test('success test', done => {
    axios.get('http://127.0.0.1:8000/suc')
    .then(res => expect(res.data).toBe('ok'))
    .finally(done)
  })

  test('half test', done => {
    axios.get('http://127.0.0.1:8000/half')
    .catch(e => {
      expect(e.response.status).toEqual(500);
      expect(e.response.data).toBe('v test');
    })
    .finally(done)
  })
})