const AWS = require('aws-sdk');
const utils = require('utils.js');

const TableName = 'Quizes';
const database = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const done = (err, res) => callback(null, utils.getCallbackConfig(err, res));

  switch (event.httpMethod) {
    case 'GET':
      getRequest(event, done);
      break;
    case 'POST':
      postRequest(event, done);
      break;
    case 'DELETE':
      deleteRequest(event, done);
      break;
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
  }
};

function postRequest(event, callback) {
  const requestBody = JSON.parse(event.body);
  const quizId = utils.toUrlString();
  const params = {
    TableName,
    Item: {
      quizId,
      title: requestBody.title,
      date: new Date().toISOString(),
      description: requestBody.description,
      questions: requestBody.questions
    }
  };

  database.put(params).promise().then(() => {
    callback(null, {quizId});
  });
}

function deleteRequest(event, done) {
  database.delete(getQuizIdParams(event.pathParameters.quizId), done);
}

function getRequest(event, done) {
  if(event.pathParameters && event.pathParameters.quizId) {
    database.get(getQuizIdParams(event.pathParameters.quizId)).promise().then(body => {
      if(Object.keys(body).length === 0) {
        done({message: 'There is no quiz with such id'});
      } else {
        done(null, body);
      }
    })
  } else {
    database.scan({TableName}, done);
  }
}

function getQuizIdParams(quizId) {
  return {
    TableName,
    Key: {
      quizId
    }
  };
}


