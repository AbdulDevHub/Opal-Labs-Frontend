/**
 * Sets headers for CORS and handles the request.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Object} The response object with a JSON body.
 */
export default function handler(req, res) {
  // Set headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', `${process.env.NEXT_PUBLIC_SITE_URL}`)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization', 'Content-Type')
  // Add more headers as needed

  // Handle your request as you normally would
  res.status(200).json({ name: 'John Doe' })
}
