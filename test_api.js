async function test() {
  try {
    const res = await fetch("http://localhost:8080/api/generate-scenario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        missionText: "Testing API",
        stakeholders: ["NGO"],
        budget: 50000
      })
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Body:", text);
  } catch (e) {
    console.error("Fetch failed:", e.message);
  }
}
test();
