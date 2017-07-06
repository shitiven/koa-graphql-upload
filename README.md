# koa-graphql-upload
File upload middleware for koa-graphql (Koa Graphql Http Server)

## install
```
npm install koa-graphql-upload
```

## Usage

1. Add middleware in Koa app:
```js
import graphqlHTTP from 'koa-graphql';
import Koa from 'koa';
import koaRouter from 'koa-router';
import convert from 'koa-convert';
import upload from 'koa-graphql-upload';

const koa = new Koa();
const router = koaRouter();

router.all('/graphql', upload(), convert(graphqlHTTP({
  schema
})));

koa
  .use(router.allowedMethods())
  .use(router.routes());

```

2. Then can get files through koa.context.files

```js
...
async resolve(parentValue, args, ctx) {
  const files = ctx.files;
  //then you can do any operation with files;
}
...
```

For more examples see the `usage-test.js` and `schema.js` in the `/src/__tests__`

### See also

- [koa-graphql](https://github.com/chentsulin/koa-graphql)


