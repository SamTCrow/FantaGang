export default defineEventHandler(async (event) => {
	console.log("Inizio endpoint DELETE");
	try {
		console.log("Restituisco risposta diretta");
		return new Response(JSON.stringify({ success: true, message: "Test" }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Errore:", error);
		return new Response(JSON.stringify({ success: false, message: "Errore", error: String(error) }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
});
