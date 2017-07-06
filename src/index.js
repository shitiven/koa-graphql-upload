import asyncBusboy from 'async-busboy';

const upload = function () {

  return async (ctx, next) => {

    const isMuti = Boolean(
        ctx.request.method === 'POST' &&
        ctx.request.is('multipart/*'));

    if (!isMuti) {
      return next();
    }

    const { files, fields } = await asyncBusboy(ctx.req);
    const { operationName, query } = fields;
    let variables = {};
    if (fields.variables) {
      variables = JSON.parse(fields.variables);
    }
    ctx.files = files;
    ctx.request.body = {
      operationName,
      query,
      variables
    };
    await next();
  };

};

export default upload;
