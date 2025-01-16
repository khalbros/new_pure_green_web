import { useState } from "react"
import axios from "axios"

const VerifyNIN = () => {
  const [nin, setNin] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)

  const handleVerify = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    const baseUrl = "https://api.monnify.com/api/v1/vas/nin-details" // Use production URL in live mode
    const apiKey = "MK_TEST_5X59HW0KTY"
    const secretKey = "8GZWGAQ7GUXVZK0TSK94NKQG82KQYF5E"
    const encodedCredentials = btoa(`${apiKey}:${secretKey}`)

    try {
      const response = await axios.post(
        baseUrl,
        { nin },
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
            "Content-Type": "application/json",
          },
        }
      )
      console.log(response)

      if (response.data.requestSuccessful) {
        setResult(response.data.responseBody)
      } else {
        setError(response.data.responseMessage || "Verification failed")
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.responseMessage || "An error occurred")
      } else {
        setError("An error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Verify NIN</h2>
      <div>
        <label htmlFor="nin">NIN Number:</label>
        <input
          type="text"
          id="nin"
          value={nin}
          onChange={(e) => setNin(e.target.value)}
          placeholder="Enter NIN"
          style={{ width: "100%", padding: "10px", marginTop: "10px" }}
        />
      </div>
      <button
        onClick={handleVerify}
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
        disabled={loading || !nin}>
        {loading ? "Verifying..." : "Verify"}
      </button>
      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}
      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Verification Details:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default VerifyNIN
