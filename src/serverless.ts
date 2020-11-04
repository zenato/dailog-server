import serverless from 'serverless-http'
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { initialize } from './database'
import app from './app'

const serverlessApp = serverless(app)

export const handler: APIGatewayProxyHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = true

  // Initialize database connection
  await initialize()

  const response = await serverlessApp(event, context)

  return response as APIGatewayProxyResult
}
