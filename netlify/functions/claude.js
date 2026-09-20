exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);

    console.log("Calling Anthropic API, model:", body.model);
    console.log("API key present:", !!process.env.ANTHROPIC_API_KEY);
    console.log("API key prefix:", process.env.ANTHROPIC_API_KEY?.slice(0, 12));

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(body)
    });

    console.log("Anthropic status:", response.status);
    const data = await response.json();
    console.log("Anthropic response type:", data.type);
    if (data.error) console.log("Anthropic error:", JSON.stringify(data.error));

    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.log("Function error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
