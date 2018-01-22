import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import * as moment from 'moment';

export const currentTime: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const date = new Date();

  cb(null, {
    statusCode: 200,
    body: JSON.stringify({
      ISO8601: date.toISOString(),
      Date: date.toDateString(),
      ObjectID: generateObjectId(date.getTime())
    }),
  });
}

export const objectIDFromDate: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const date = moment(decodeURIComponent(event.pathParameters.date));

  if (date.isValid()) {
    cb(null, {
      statusCode: 200,
      headers: {
        "Content-Type": "text/plain"
      },
      body: generateObjectId(date.unix()),
    });

  } else {
    cb(null, {
      statusCode: 400,
      headers: {
        "Content-Type": "text/plain"
      },
      body: 'Error: Invalid date provided',
    });
  }
}

export const dateFromObjectID: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const objectId = event.pathParameters.oid;

  if (/^[0-9a-fA-F]{24}$/.test(objectId)) {
    cb(null, {
      statusCode: 200,
      headers: {
        "Content-Type": "text/plain"
      },
      body: new Date(parseInt(objectId.substring(0, 8), 16) * 1000).toISOString(),
    });

  } else {
    cb(null, {
      statusCode: 400,
      headers: {
        "Content-Type": "text/plain"
      },
      body: 'Error: Invalid ObjectID provided',
    });
  }
}

function generateObjectId(timestamp) {
  return Math.floor(timestamp / 1000).toString(16) + "0000000000000000";
}