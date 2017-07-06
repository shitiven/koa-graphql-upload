import { describe, it } from 'mocha';
import supertest from 'supertest';
import upload from '../index';
import graphqlHTTP from 'koa-graphql';
import Koa from 'koa';
import koaRouter from 'koa-router';
import convert from 'koa-convert';
import schema from './schema';
import path from 'path';

const rootPath = path.resolve('./src/__tests__');
const tmpDir = path.resolve(rootPath, 'tmp');

const koa = new Koa();
const router = koaRouter();

router.all('/graphql', upload(), convert(graphqlHTTP({
  schema
})));

koa
  .use(router.allowedMethods())
  .use(router.routes());
koa.context.tmpDir = tmpDir;

const request = supertest.agent(koa.listen());
const query = `
  query sayHey($me:String!){
    say(hey:$me) {
      hey
    }
  }
  mutation uploadFile {
    upload {
      fieldname,
      filename,
      mimeType
    }
  }
`;

describe('upload testcase..', () => {

  it('query with variables and operationName', done => {

    request.get('/graphql')
      .send({
        query,
        operationName: 'sayHey',
        variables: `
        {
          "me": "say hi from me"
        }
        `
      })
      .expect(res => {
        res.body.hey = res.body.data.say.hey;
        delete res.body.data;
      })
      .expect(200, {
        hey: 'say hi from me'
      }, done);

  });

  it('test upload with operationName', done => {

    request.post('/graphql')
      .field('query', query)
      .field('operationName', 'uploadFile')
      .attach('attachfile', __filename)
      .expect(res => {
        res.body.files = res.body.data.upload;
        delete res.body.data;
      })
      .expect(200, {
        files: [ {
          fieldname: 'attachfile',
          filename: 'usage-test.js',
          mimeType: 'application/javascript'
        } ]
      }, done);

  });

});
